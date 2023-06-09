import React, { ReactNode } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface Props {
    children?: ReactNode
}

export default function MateriaThemeProvider({ children }: Props) {
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: 'light',
                },
            }),
        []
    )

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
