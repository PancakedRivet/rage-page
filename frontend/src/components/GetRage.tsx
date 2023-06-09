import ReactTable from './table/ReactTable'
import { DATABASE_URL, Complaint } from '../helpers/helpers'

import { useQuery } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const columnHelper = createColumnHelper<Complaint>()

const columns = [
    columnHelper.accessor('submissionTime', {
        header: 'Time',
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('complaint', {
        header: 'Complaint',
        cell: (info) => info.getValue(),
    }),
]

export default function GetRage() {
    const { data } = useQuery(['complaints'], () =>
        fetch(DATABASE_URL + 'key/complaints', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Basic ' + btoa('root:root'),
                NS: 'test',
                DB: 'test',
            },
        }).then((res) => res.json())
    )

    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
                <Typography variant="h2" gutterBottom>
                    Rages Sent:
                </Typography>
                {data && data[0].result?.length > 0 ? (
                    <ReactTable
                        columns={columns}
                        data={data[0].result}
                        // showTableState
                    />
                ) : (
                    <Typography variant="h4" gutterBottom>
                        No Rages Sent!
                    </Typography>
                )}
            </Stack>
        </Box>
    )
}
