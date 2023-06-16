import React from 'react'
import ReactDOM from 'react-dom/client'
import Rage from './components/Rage.tsx'
import GetRage from './components/GetRage.tsx'
import MateriaThemeProvider from './components/MateriaThemeContext.tsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: '/',
        element: <Rage />,
    },
    {
        path: '/get',
        element: <GetRage />,
    },
    {
        path: '/admin',
        element: <div>This is the admin page</div>,
    },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MateriaThemeProvider>
                <RouterProvider router={router} />
            </MateriaThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
