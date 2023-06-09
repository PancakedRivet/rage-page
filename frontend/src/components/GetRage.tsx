import { DATABASE_URL, Complaint } from '../helpers/helpers'

import { useQuery } from '@tanstack/react-query'

import { createColumnHelper } from '@tanstack/react-table'
import Table from './table/Table'

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
        <div>
            Rages Sent:
            {data && data[0].result?.length > 0 ? (
                <Table columns={columns} data={data[0].result} />
            ) : (
                <p>No Rage</p>
            )}
        </div>
    )
}
