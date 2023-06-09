import React from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SendIcon from '@mui/icons-material/Send'

export default function Rage() {
    const [open, setOpen] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <>
            <Box
                sx={{
                    width: 500,
                    maxWidth: '100%',
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h2" gutterBottom>
                        What is making you rage today?
                    </Typography>

                    <TextField
                        fullWidth
                        label="I'm so annoyed by..."
                        id="fullWidth"
                        multiline
                        maxRows={4}
                        placeholder="Let it all out..."
                    />

                    {open ? (
                        <Button
                            variant="contained"
                            onClick={handleClose}
                            size="large"
                            sx={{
                                height: 50,
                            }}
                        >
                            <CircularProgress color="inherit" />
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleOpen}
                            endIcon={<SendIcon />}
                            size="large"
                            sx={{
                                height: 50,
                            }}
                        >
                            Send Rage
                        </Button>
                    )}
                </Stack>
            </Box>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    Thank you for your rage
                </Alert>
            </Snackbar>
        </>
    )
}
