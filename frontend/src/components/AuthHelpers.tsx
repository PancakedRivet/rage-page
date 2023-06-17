import React, { useRef } from 'react'

import { useAuth } from './contexts/AuthContext'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import LoginIcon from '@mui/icons-material/Login'

import { useNavigate, useLocation, Navigate } from 'react-router-dom'

export function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const auth = useAuth()

    const valueRef = useRef('')

    const from = location.state?.from?.pathname || '/'

    const [isPasswordError, setIsPasswordError] = React.useState<boolean>(false)

    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault()
    }

    const handleSubmitLogin = () => {
        const submittedPassword = valueRef.current.value
        if (submittedPassword === import.meta.env.VITE_ADMIN_PASSWORD) {
            auth.signin(() => {
                // Send them back to the page they tried to visit when they were
                // redirected to the login page. Use { replace: true } so we don't create
                // another entry in the history stack for the login page.  This means that
                // when they get to the protected page and click the back button, they
                // won't end up back on the login page, which is also really nice for the
                // user experience.
                navigate(from, { replace: true })
            })
        } else {
            setIsPasswordError(true)
        }
    }

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <Typography variant="h4" gutterBottom>
                You must log in to view the page at {from}
            </Typography>
            <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                    Password
                </InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                    error={isPasswordError}
                    inputRef={valueRef}
                />
                <Button
                    onClick={handleSubmitLogin}
                    variant="contained"
                    endIcon={<LoginIcon />}
                >
                    Login
                </Button>
            </FormControl>
        </Box>
    )
}

export function RequireAuth({ children }: { children: JSX.Element }) {
    const auth = useAuth()
    const location = useLocation()

    if (!auth.isLoggedIn) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}
