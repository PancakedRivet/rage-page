import React from 'react'

import { DATABASE_URL, SURREAL_HEADERS } from '../helpers/constants'

import Alert, { AlertColor } from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SendIcon from '@mui/icons-material/Send'

import { useMutation } from '@tanstack/react-query'

export default function SendRage() {
    const formRef = React.useRef<HTMLFormElement>(null)

    const [snackbarIsOpen, setSnackbarIsOpen] = React.useState(false)
    const [rageText, setRageText] = React.useState('')
    const [alertSeverity, setAlertSeverity] =
        React.useState<AlertColor>('success')
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClose = () => {
        setSnackbarIsOpen(false)
        setIsLoading(false)
    }

    function handleSubmit() {
        const formRefCurrent = formRef.current as HTMLFormElement
        if (formRefCurrent.reportValidity()) {
            const complaintData = {
                complaint: rageText,
                submissionTime: new Date(),
                tags: [],
            }
            const jsonComplaintData = JSON.stringify(complaintData)
            submitRage.mutate(jsonComplaintData)
        }
    }

    const submitRage = useMutation(
        (postBody: string) =>
            fetch(DATABASE_URL + 'key/complaints', {
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
            onMutate: () => {
                setIsLoading(true)
            },
            onSuccess: () => {
                setIsLoading(false)
                setAlertSeverity('success')
                setSnackbarIsOpen(true)
                setRageText('')
            },
            onError: () => {
                setIsLoading(false)
                setAlertSeverity('error')
                setSnackbarIsOpen(true)
            },
        }
    )

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
                    <form ref={formRef}>
                        <TextField
                            fullWidth
                            id="fullWidth"
                            multiline
                            maxRows={4}
                            placeholder={'Let it all out...'}
                            value={rageText}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setRageText(event.target.value)
                            }}
                            required
                        />
                    </form>

                    {isLoading ? (
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                height: 50,
                            }}
                            disabled
                        >
                            <CircularProgress color="inherit" />
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
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

            <Snackbar
                open={snackbarIsOpen}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {alertSeverity === 'success'
                        ? 'Thank you for your rage'
                        : 'Oh no, something went wrong!'}
                </Alert>
            </Snackbar>
        </>
    )
}
