import ReactTable from './table/ReactTable'
import { DATABASE_URL, Complaint, Tag } from '../helpers/helpers'

import { useQuery } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import NivoLine from './graph/NivoLine'

export default function GetRage() {
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
                // Adjust shape from result to map
                const map = new Map(
                    res[0].result.map((obj: Tag) => {
                        return [obj.id, obj.tag]
                    })
                )
                return map
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

    const columnHelper = createColumnHelper<Complaint>()
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
            header: 'Tag',
            cell: (info) => {
                const cellValue = info.getValue()
                if (Array.isArray(cellValue)) {
                    // If the data is an array, try get the names of the tags associated
                    const tagList = cellValue.map((val) => tagData?.get(val))
                    return tagList.join(', ')
                }
                return info.getValue()
            },
        }),
    ]

    return (
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
                        <NivoLine data={data[0].result} />
                    </>
                ) : (
                    <Typography variant="h4" gutterBottom>
                        No Rages Sent!
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}
