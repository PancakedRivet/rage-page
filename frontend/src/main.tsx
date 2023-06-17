import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import SendRage from './components/SendRage.tsx'
// import SeeRage from './components/SeeRage.tsx'
import MateriaThemeProvider from './components/contexts/MateriaThemeContext.tsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './components/contexts/AuthContext.tsx'
import { LoginPage, RequireAuth } from './helpers/AuthHelpers.tsx'

const SeeRage = lazy(() => import('./components/SeeRage.tsx'))

const queryClient = new QueryClient()

// A simple laoding page while the admin page is loaded
const Loading = () => {
    return <h2>Loading...</h2>
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <SendRage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/admin',
        element: (
            <RequireAuth>
                <Suspense fallback={<Loading />}>
                    <SeeRage />
                </Suspense>
            </RequireAuth>
        ),
    },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <MateriaThemeProvider>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </MateriaThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
