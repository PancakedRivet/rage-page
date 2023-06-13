import ReactTable from './table/ReactTable'
import { DATABASE_URL, Tag, ComplaintTableRow } from '../helpers/helpers'

import { useQuery } from '@tanstack/react-query'

import { Row, createColumnHelper } from '@tanstack/react-table'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import NivoLine from './graph/NivoLine'
import { useState } from 'react'
import TagEditDialog from './TagEditDialog'

export default function GetRage() {
    const [tagEditIsOpen, setTagEditIsOpen] = useState(false)
    const [tableRowToEdit, setTableRowToEdit] = useState<
        Row<ComplaintTableRow> | undefined
    >(undefined)

    const handleClickOpenTagEdit = (row: Row<ComplaintTableRow>) => {
        setTagEditIsOpen(true)
        setTableRowToEdit(row)
    }

    const handleUpdateTag = () => {
        console.log(tableRowToEdit)
    }

    const handleCloseTagEdit = () => {
        setTagEditIsOpen(false)
        setTableRowToEdit(undefined)
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

    const columnHelper = createColumnHelper<ComplaintTableRow>()
    const columns = [
        // columnHelper.accessor('select', {
        //     header: ({ table }) => (
        //         <IndeterminateCheckbox
        //             {...{
        //                 checked: table.getIsAllRowsSelected(),
        //                 indeterminate: table.getIsSomeRowsSelected(),
        //                 onChange: table.getToggleAllRowsSelectedHandler(),
        //             }}
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <div className="px-1">
        //             <IndeterminateCheckbox
        //                 {...{
        //                     checked: row.getIsSelected(),
        //                     disabled: !row.getCanSelect(),
        //                     indeterminate: row.getIsSomeSelected(),
        //                     onChange: row.getToggleSelectedHandler(),
        //                 }}
        //             />
        //         </div>
        //     ),
        // }),
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
                    // Adjust shape from result to map
                    const tagMap: Map<string, string> = new Map(
                        tagData.map((obj: Tag) => {
                            return [obj.id, obj.name]
                        })
                    )
                    const tagList = cellValue.map((val) => tagMap?.get(val))
                    return tagList.join(', ')
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
            <TagEditDialog
                tableRowToEdit={tableRowToEdit}
                tagList={tagData}
                open={tagEditIsOpen}
                onUpdate={handleUpdateTag}
                onClose={handleCloseTagEdit}
            />
        </Box>
    )
}
