import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Rage from './components/Rage.tsx'
import MateriaThemeProvider from './components/MateriaThemeContext.tsx'
import './index.css'

import { QueryClient, QueryClientProvider } from 'react-query'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: '/',
        element: <Rage />,
    },
    {
        path: '/app',
        element: <App />,
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
