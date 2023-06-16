import { useState } from 'react'

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
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import NivoLine from './graph/NivoLine'

const surrealData: SurrealGraphQuery[] = [
    {
        metadata: {
            tagList: [
                {
                    tag: null,
                },
                {
                    tag: 'Cloud Ops',
                },
                {
                    tag: 'Performance',
                },
                {
                    tag: 'Test Tag',
                },
                {
                    tag: 'Test Tag 2',
                },
                {
                    tag: 'Test Tag 3',
                },
                {
                    tag: 'Test Tag 4',
                },
                {
                    tag: 'Test Tag 5',
                },
                {
                    tag: 'Another Tag',
                },
            ],
            time: {
                maxDateTime: '2023-06-16T00:00:00Z',
                minDateTime: '2023-06-09T00:00:00Z',
                timePeriod: 'day',
            },
        },
        result: [
            {
                tag: null,
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Cloud Ops',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Performance',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 2,
            },
            {
                tag: 'Test Tag 2',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 2,
            },
            {
                tag: 'Test Tag 3',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag 4',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag 5',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 2,
            },
            {
                tag: 'Another Tag',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Cloud Ops',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag 2',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 2,
            },
        ],
    },
]

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

export default function GetRage() {
    const [tagEditIsOpen, setTagEditIsOpen] = useState(false)
    const [tableRowToEdit, setTableRowToEdit] = useState<
        Row<ComplaintTableRow> | undefined
    >(undefined)
    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false)
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success')

    const queryClient = useQueryClient()

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

    const { data } = useQuery({
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
            }).then((res) => res.json()),
        enabled: !!tagData,
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
                queryClient.invalidateQueries({ queryKey: ['complaints'] })
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

    const lineData = convertSurrealToNivo(surrealData[0])

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}>
                    <Typography variant="h2" gutterBottom>
                        Rages Sent:
                    </Typography>
                    {data && data[0].result?.length > 0 ? (
                        <>
                            <ReactTable
                                columns={columns}
                                data={data[0].result}
                                // showTableState
                            />
                            {/* <NivoLine /> */}
                            {/* <NivoLine data={data[0].result} /> */}
                            <NivoLine data={lineData} />
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
        </>
    )
}
