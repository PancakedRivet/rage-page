import { useState } from 'react'

import { ComplaintTableRow, Tag } from '../helpers/helpers'

import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import { Row } from '@tanstack/react-table'

interface SimpleDialogProps {
    open: boolean
    tableRowToEdit?: Row<ComplaintTableRow>
    tagList?: Tag[]
    onUpdate: (selectedTags: string[]) => void
    onClose: () => void
}

export default function TagEditDialog(props: SimpleDialogProps) {
    const { onUpdate, onClose, tableRowToEdit, tagList, open } = props

    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const handleClose = () => {
        onClose()
    }

    const handleUpdate = () => {
        onUpdate(selectedTags)
    }

    const handleListItemClick = (value: string) => {
        console.log('clicked', value)
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Set Tags</DialogTitle>
            <DialogContent>
                <List sx={{ pt: 0 }}>
                    <FormGroup>
                        {tagList &&
                            tagList.map((tag) => (
                                <ListItem disableGutters key={tag.id}>
                                    <ListItemButton
                                        key={tag.id}
                                        onClick={() =>
                                            handleListItemClick(tag.name)
                                        }
                                    >
                                        <FormControlLabel
                                            control={<Checkbox />}
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
