import React from 'react'

interface AuthContextType {
    isLoggedIn: boolean
    signin: (callback: VoidFunction) => void
    signout: (callback: VoidFunction) => void
}

const AuthContext = React.createContext<AuthContextType>(null!)

export function useAuth() {
    return React.useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false)

    const signin = (callback: VoidFunction) => {
        setIsLoggedIn(true)
        return callback()
    }

    const signout = (callback: VoidFunction) => {
        setIsLoggedIn(false)
        return callback()
    }

    const value = { isLoggedIn, signin, signout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
