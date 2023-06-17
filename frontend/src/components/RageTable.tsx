import { useState } from 'react'

import ReactTable from './table/ReactTable'
import TagEditDialog from './TagEditDialog'
import { Tag, ComplaintTableRow } from '../helpers/types'

import { Row, createColumnHelper } from '@tanstack/react-table'

import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface RageTableProps {
    tagData: any
    complaintData: any
    onCreateTag: (newTagName: string) => void
    onUpdateTag: (
        selectedTags: Tag[],
        tableRowToEdit: Row<ComplaintTableRow>
    ) => void
}

export default function RageTable(props: RageTableProps) {
    const { tagData, complaintData, onCreateTag, onUpdateTag } = props

    const [tagEditIsOpen, setTagEditIsOpen] = useState(false)

    const [tableRowToEdit, setTableRowToEdit] = useState<
        Row<ComplaintTableRow> | undefined
    >(undefined)

    if (!tagData || !complaintData) {
        return <div>Loading...</div>
    }

    const handleClickOpenTagEdit = (row: Row<ComplaintTableRow>) => {
        setTagEditIsOpen(true)
        setTableRowToEdit(row)
    }

    const handleCreateTag = (newTagName: string) => {
        onCreateTag(newTagName)
    }

    const handleUpdateTagEdit = (selectedTags: Tag[]) => {
        if (tableRowToEdit) {
            onUpdateTag(selectedTags, tableRowToEdit)
            setTagEditIsOpen(false)
        }
    }

    const handleCloseTagEdit = () => {
        setTagEditIsOpen(false)
        setTableRowToEdit(undefined)
    }

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

    return (
        <>
            {complaintData && complaintData.length > 0 ? (
                <ReactTable
                    columns={columns}
                    data={complaintData}
                    // showTableState
                />
            ) : (
                <Typography variant="h4" gutterBottom>
                    No Rages Sent!
                </Typography>
            )}
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
        </>
    )
}
