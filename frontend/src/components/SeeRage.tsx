import { useMemo, useState } from 'react'

import { DATABASE_URL, SURREAL_HEADERS } from '../helpers/constants'
import { convertSurrealQueryToNivoLine } from '../helpers/functions'
import { Tag, ComplaintTableRow, Complaint } from '../helpers/types'

import { Row } from '@tanstack/react-table'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Alert, { AlertColor } from '@mui/material/Alert'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import RageTable from './RageTable'
import RageGraph from './RageGraph'

export default function SeeRage() {
    const [snackbarIsOpen, setSnackbarIsOpen] = useState(false)
    const [isShowingGraph, setIsShowingGraph] = useState(false)
    const [numberOfWeeksToQuery, setNumberOfWeeksToQuery] =
        useState<string>('1')

    const [alertSeverity, setAlertSeverity] = useState<AlertColor>('success')

    const queryClient = useQueryClient()

    const surrealQueryForGraph = `
    LET $bucket = "day";
    LET $endDateTime = time::group(time::now(), $bucket) + 1d;
    LET $startDateTime = $endDateTime - ${numberOfWeeksToQuery}w;

    LET $complaintDateRange = SELECT * FROM complaints WHERE submissionTime > $startDateTime AND submissionTime < $endDateTime;
    LET $complaintBucket = SELECT *, time::group(submissionTime, $bucket) AS timeBucket, tags.name as tags FROM $complaintDateRange SPLIT tags;
    LET $complaintTagList = SELECT count() as total, timeBucket, tags AS tag FROM $complaintBucket GROUP BY timeBucket, tag;
    LET $tagList = SELECT tag FROM $complaintTagList;

    LET $lineGraphData = SELECT * FROM $complaintTagList;
    LET $pieGraphData = SELECT count() as value, tags AS id FROM $complaintBucket GROUP BY id;
    LET $metaTagList = SELECT tag FROM array::distinct($tagList) ORDER BY tag DESC;
    LET $metaTime = SELECT * FROM { timePeriod: $bucket, minDateTime: $startDateTime, maxDateTime: $endDateTime };

    SELECT * FROM { graphData: { line: $lineGraphData, pie: $pieGraphData }, metadata: { time: $metaTime, tagList: $metaTagList } };`

    const handleChangeDisplay = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIsShowingGraph(event.target.checked)
    }

    const handleCreateTag = (newTagName: string) => {
        const jsonTag = JSON.stringify({
            name: newTagName,
        })
        createTag.mutate(jsonTag)
    }

    const handleUpdateTagEdit = (
        selectedTags: Tag[],
        tableRowToEdit: Row<ComplaintTableRow>
    ) => {
        const complaintId = tableRowToEdit?.original.id
        const newTagIds = selectedTags.map((tag) => tag.id)
        const query = `UPDATE ${complaintId} SET tags = [${newTagIds}];`
        updateTags.mutate(query)
    }

    const handleCloseSnackbar = () => {
        setSnackbarIsOpen(false)
    }

    const handleChangeTimePeriod = (newTimePeriod: string) => {
        setNumberOfWeeksToQuery(newTimePeriod)
    }

    const handleRefreshGraph = () => {
        graphDataRefetch()
    }

    const { data: tagData } = useQuery(['tags'], () =>
        fetch(DATABASE_URL + 'key/tags', {
            method: 'GET',
            headers: SURREAL_HEADERS,
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
                headers: SURREAL_HEADERS,
            })
                .then((res) => res.json())
                .then((res) => {
                    // Only save the object that contains the results we want.
                    // There is only one item in the array
                    const sortedComplaints = res[0].result.sort(
                        (complaint1: Complaint, complaint2: Complaint) =>
                            new Date(complaint1.submissionTime) <
                            new Date(complaint2.submissionTime)
                                ? 1
                                : new Date(complaint1.submissionTime) >
                                  new Date(complaint2.submissionTime)
                                ? -1
                                : 0
                    )
                    return sortedComplaints
                }),
        enabled: !!tagData,
    })

    const { data: graphData, refetch: graphDataRefetch } = useQuery({
        queryKey: ['graphData'],
        queryFn: () =>
            fetch(DATABASE_URL + 'sql', {
                method: 'POST',
                headers: SURREAL_HEADERS,
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
                headers: SURREAL_HEADERS,
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
                headers: SURREAL_HEADERS,
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

    const lineData = useMemo(() => {
        if (graphData) {
            return convertSurrealQueryToNivoLine(graphData)
        }
        return null
    }, [graphData])

    const pieData = useMemo(() => {
        if (graphData) {
            return graphData.graphData.pie
        }
        return null
    }, [graphData])

    return (
        <>
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
            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}>
                    <Typography variant="h2" gutterBottom>
                        Rages Sent:
                    </Typography>
                    {complaintData && complaintData.length > 0 ? (
                        <>
                            {isShowingGraph ? (
                                <RageGraph
                                    lineData={lineData}
                                    pieData={pieData}
                                    numberOfWeeksToQuery={numberOfWeeksToQuery}
                                    onTimePeriodChange={handleChangeTimePeriod}
                                    onGraphRefetch={handleRefreshGraph}
                                />
                            ) : (
                                <RageTable
                                    tagData={tagData}
                                    complaintData={complaintData}
                                    onCreateTag={handleCreateTag}
                                    onUpdateTag={handleUpdateTagEdit}
                                />
                            )}
                        </>
                    ) : (
                        <Typography variant="h4" gutterBottom>
                            No Rages Sent!
                        </Typography>
                    )}
                </Stack>
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
