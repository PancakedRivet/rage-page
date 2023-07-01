export const DATABASE_URL = 'http://localhost:9000/'

export const SURREAL_HEADERS = {
    Accept: 'application/json',
    Authorization:
        'Basic ' +
        btoa(
            import.meta.env.VITE_SURREAL_USER_ROOT +
                ':' +
                import.meta.env.VITE_SURREAL_PASS_ROOT
        ),
    NS: 'test',
    DB: 'test',
}
