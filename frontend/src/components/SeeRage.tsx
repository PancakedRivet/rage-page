import { useMemo, useState } from 'react'

import ReactTable from './table/ReactTable'
import TagEditDialog from './TagEditDialog'
import {
    DATABASE_URL,
    Tag,
    ComplaintTableRow,
    NivoGraph,
    SurrealGraphQuery,
    SurrealTagFilter,
} from '../helpers/helpers'

import { Row, createColumnHelper } from '@tanstack/react-table'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Alert, { AlertColor } from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import NivoLine from './graph/NivoLine'

function getDaysArray(start: Date, end: Date, increment: number) {
    const arr = []
    for (
        let dt = new Date(start);
        dt <= new Date(end);
        dt.setDate(dt.getDate() + increment)
    ) {
        // arr.push(new Date(dt))
        arr.push(dt.toDateString())
    }
    return arr
}

function convertSurrealToNivo(surrealQueryData: SurrealGraphQuery) {
    const lineDataForTag = new Map()

    const daylist = getDaysArray(
        new Date(surrealQueryData.metadata.time.minDateTime),
        new Date(surrealQueryData.metadata.time.maxDateTime),
        1
    )

    // intially setting each date to 0 total
    surrealQueryData.metadata.tagList.map((tag) => {
        const key = tag.tag ? tag.tag : 'Not tagged'

        const zeroDataMap = new Map()

        daylist.map((date) => {
            zeroDataMap.set(date, 0)
        })

        lineDataForTag.set(key, zeroDataMap)
    })

    // update the date to reflect the correct totals
    surrealQueryData.result.map((item: SurrealTagFilter) => {
        const key = item.tag ? item.tag : 'Not tagged'
        // Get the map for a specific tag
        const dataMap = lineDataForTag.get(key) // (dateTime, 0)

        // Update the new total for the specific timebucket
        const dateString = new Date(item.timeBucket)
        // dataMap.set(new Date(item.timeBucket), item.total)
        dataMap.set(dateString.toDateString(), item.total)

        // Update the map with the new total (as it was 0 and each item has a unique timeBucket and tag combination
        lineDataForTag.set(key, dataMap)
    })

    const returnedDataForNivoLine: NivoGraph[] = []

    // Shape the data into an array for returning
    lineDataForTag.forEach((dataMap, tagName) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataArray = Array.from(dataMap, function (entry: any) {
            return { x: new Date(entry[0]), y: entry[1] }
        })
        returnedDataForNivoLine.push({
            id: tagName,
            data: dataArray,
        })
    })

    return returnedDataForNivoLine
}

export default function SeeRage() {
    const [tagEditIsOpen, setTagEditIsOpen] = useState(false)
    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false)
    const [isShowingGraph, setIsShowingGraph] = useState(false)

    const [tableRowToEdit, setTableRowToEdit] = useState<
        Row<ComplaintTableRow> | undefined
    >(undefined)
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success')

    const queryClient = useQueryClient()

    const surrealQueryForGraph = `
    LET $bucket = "day"; 
    LET $endDateTime = time::group(time::now(), $bucket);
    LET $startDateTime = $endDateTime - 1w;

    LET $complaintDateRange = SELECT * FROM complaints WHERE submissionTime > $startDateTime AND submissionTime < $endDateTime;
    LET $complaintBucket = SELECT *, time::group(submissionTime, $bucket) AS timeBucket, tags.name as tags FROM $complaintDateRange SPLIT tags;
    LET $complaintTagList = SELECT count() as total, timeBucket, tags AS tag FROM $complaintBucket GROUP BY timeBucket, tag;
    LET $tagList = SELECT tag FROM $complaintTagList;
    LET $result = SELECT * FROM $complaintTagList;
    LET $metaTagList = SELECT tag FROM array::distinct($tagList) ORDER BY tag DESC;
    LET $metaTime = SELECT * FROM { timePeriod: $bucket, minDateTime: $startDateTime, maxDateTime: $endDateTime };

    SELECT * FROM { result: $result, metadata: { time: $metaTime, tagList: $metaTagList } };`

    const handleChangeDisplay = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIsShowingGraph(event.target.checked)
    }

    const handleClickOpenTagEdit = (row: Row<ComplaintTableRow>) => {
        setTagEditIsOpen(true)
        setTableRowToEdit(row)
    }

    const handleCreateTag = (newTagName: string) => {
        const jsonTag = JSON.stringify({
            name: newTagName,
        })
        createTag.mutate(jsonTag)
    }

    const handleUpdateTagEdit = (selectedTags: Tag[]) => {
        const complaintId = tableRowToEdit?.original.id
        const newTagIds = selectedTags.map((tag) => tag.id)
        const query = `UPDATE ${complaintId} SET tags = [${newTagIds}];`
        updateTags.mutate(query)
        setTagEditIsOpen(false)
    }

    const handleCloseTagEdit = () => {
        setTagEditIsOpen(false)
        setTableRowToEdit(undefined)
    }

    const handleCloseSnackbar = () => {
        setSnackbarIsOpen(false)
    }

    const { data: tagData } = useQuery(['tags'], () =>
        fetch(DATABASE_URL + 'key/tags', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Basic ' + btoa('root:root'),
                NS: 'test',
                DB: 'test',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                // Sorting the tags based on the name
                const sortedTags = res[0].result.sort((tag1: Tag, tag2: Tag) =>
                    tag1.name > tag2.name ? 1 : tag1.name < tag2.name ? -1 : 0
                )
                return sortedTags
            })
    )

    const { data: complaintData } = useQuery({
        queryKey: ['complaints'],
        queryFn: () =>
            fetch(DATABASE_URL + 'key/complaints', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Basic ' + btoa('root:root'),
                    NS: 'test',
                    DB: 'test',
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    // Only save the object that contains the results we want.
                    // There is only one item in the array
                    return res[0].result
                }),
        enabled: !!tagData,
    })

    const { data: graphData } = useQuery({
        queryKey: ['graphData'],
        queryFn: () =>
            fetch(DATABASE_URL + 'sql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Basic ' + btoa('root:root'),
                    NS: 'test',
                    DB: 'test',
                },
                body: surrealQueryForGraph,
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('An error ocurred')
                    }
                    return res.json()
                })
                .then((res) => {
                    // Only save the object that contains the results we want.
                    // It's always the last item in the array
                    const results = res[res.length - 1].result
                    return results[0]
                }),
    })

    const updateTags = useMutation(
        (postBody: string) =>
            fetch(DATABASE_URL + 'sql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Basic ' + btoa('root:root'),
                    NS: 'test',
                    DB: 'test',
                },
                body: postBody,
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('An error ocurred')
                }
                return res
            }),
        {
            onSuccess: () => {
                setAlertSeverity('success')
                setSnackbarIsOpen(true)
                queryClient.invalidateQueries({
                    queryKey: ['complaints'],
                })
                queryClient.invalidateQueries({
                    queryKey: ['graphData'],
                })
            },
            onError: () => {
                setAlertSeverity('error')
                setSnackbarIsOpen(true)
            },
        }
    )

    const createTag = useMutation(
        (postBody: string) =>
            fetch(DATABASE_URL + 'key/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: 'Basic ' + btoa('root:root'),
                    NS: 'test',
                    DB: 'test',
                },
                body: postBody,
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('An error ocurred')
                }
                return res
            }),
        {
            onSuccess: () => {
                setAlertSeverity('success')
                setSnackbarIsOpen(true)
                queryClient.invalidateQueries({ queryKey: ['tags'] })
            },
            onError: () => {
                setAlertSeverity('error')
                setSnackbarIsOpen(true)
            },
        }
    )

    const columnHelper = createColumnHelper<ComplaintTableRow>()
    const columns = [
        columnHelper.accessor('id', {
            header: 'Id',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('submissionTime', {
            header: 'Time',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('complaint', {
            header: 'Complaint',
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('tags', {
            header: 'Tags',
            cell: (info) => {
                const cellValue = info.getValue()
                if (Array.isArray(cellValue)) {
                    // If the data is an array, try get the names of the tags associated
                    // Adjust shape from result to map
                    const tagMap: Map<string, string> = new Map(
                        tagData.map((obj: Tag) => {
                            return [obj.id, obj.name]
                        })
                    )
                    const tagList = cellValue.map((val) => tagMap?.get(val))
                    return (
                        <Stack
                            spacing={{ xs: 1, sm: 2 }}
                            direction="row"
                            useFlexGap
                            flexWrap="wrap"
                        >
                            {tagList.map((tag, idx) => {
                                return <Chip key={idx} label={tag} />
                            })}
                        </Stack>
                    )
                }
                return info.getValue()
            },
        }),
        columnHelper.accessor('edit', {
            header: 'Edit Tags',
            cell: ({ row }) => (
                <Button
                    variant="outlined"
                    onClick={() => handleClickOpenTagEdit(row)}
                >
                    Edit Tags
                </Button>
            ),
        }),
    ]

    const lineData = useMemo(() => {
        if (graphData) {
            return convertSurrealToNivo(graphData)
        }
        return null
    }, [graphData])

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}>
                    <Typography variant="h2" gutterBottom>
                        Rages Sent:
                    </Typography>
                    {complaintData && complaintData.length > 0 ? (
                        <>
                            {!isShowingGraph && (
                                <ReactTable
                                    columns={columns}
                                    data={complaintData}
                                    // showTableState
                                />
                            )}
                            {isShowingGraph && lineData && (
                                <NivoLine data={lineData} />
                            )}
                        </>
                    ) : (
                        <Typography variant="h4" gutterBottom>
                            No Rages Sent!
                        </Typography>
                    )}
                </Stack>
                {tableRowToEdit && tagData && (
                    <TagEditDialog
                        tableRowToEdit={tableRowToEdit}
                        tagList={tagData}
                        open={tagEditIsOpen}
                        onCreate={handleCreateTag}
                        onUpdate={handleUpdateTagEdit}
                        onClose={handleCloseTagEdit}
                    />
                )}
            </Box>
            <Snackbar
                open={snackbarIsOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {alertSeverity === 'success'
                        ? 'Tags have been updated'
                        : 'Oh no, something went wrong!'}
                </Alert>
            </Snackbar>
            <FormControlLabel
                sx={{ m: 1, top: 0, right: 0, position: 'absolute' }}
                control={
                    <Switch
                        checked={isShowingGraph}
                        onChange={handleChangeDisplay}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                }
                label={isShowingGraph ? 'Hide Graph' : 'Show Graph'}
            />
        </>
    )
}
