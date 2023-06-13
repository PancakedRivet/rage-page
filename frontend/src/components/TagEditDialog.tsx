import { useEffect, useState } from 'react'

import { ComplaintTableRow, Tag } from '../helpers/helpers'

import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'

import { Row } from '@tanstack/react-table'

interface SimpleDialogProps {
    open: boolean
    tableRowToEdit?: Row<ComplaintTableRow>
    tagList: Tag[]
    onUpdate: (selectedTags: Tag[]) => void
    onClose: () => void
}

export default function TagEditDialog(props: SimpleDialogProps) {
    const { onUpdate, onClose, tableRowToEdit, tagList, open } = props

    const [selectedTags, setSelectedTags] = useState<Tag[]>([])

    const handleClose = () => {
        onClose()
    }

    const handleUpdate = () => {
        onUpdate(selectedTags)
    }

    const handleListItemClick = (
        e: React.MouseEvent<HTMLDivElement>,
        value: string
    ) => {
        e.stopPropagation()
        e.preventDefault()

        let newSelectedTags = selectedTags
        if (selectedTags.some((tag) => tag.name === value)) {
            // If "unchecking" a tag
            newSelectedTags = selectedTags.filter((tag) => tag.name != value)
        } else {
            // If "checking" a tag
            const tagToAdd = tagList.find((tag) => tag.name === value)
            if (tagToAdd) {
                newSelectedTags = [...selectedTags, tagToAdd]
            }
        }
        setSelectedTags(newSelectedTags)
    }

    // Update the pre-selected tags based on the row being editted
    useEffect(() => {
        const rowTags = tableRowToEdit?.original?.tags
        let selectedTags: Tag[] = []
        if (rowTags) {
            selectedTags = tagList.filter((tag) => rowTags.includes(tag.id))
        }
        setSelectedTags(selectedTags)
    }, [open, tagList, tableRowToEdit?.original?.tags])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Tag The Rage</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {tableRowToEdit?.original.complaint}
                </DialogContentText>
                <List sx={{ pt: 0 }}>
                    <FormGroup>
                        {tagList &&
                            tagList.map((tag) => (
                                <ListItem disableGutters key={tag.id}>
                                    <ListItemButton
                                        key={tag.id}
                                        onClickCapture={(e) =>
                                            handleListItemClick(e, tag.name)
                                        }
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedTags.some(
                                                        (item) =>
                                                            tag.name ===
                                                            item.name
                                                    )}
                                                />
                                            }
                                            label={tag.name}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                    </FormGroup>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
