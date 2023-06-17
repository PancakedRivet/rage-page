export const DATABASE_URL = 'http://localhost:9000/'

export const SURREAL_HEADERS = {
    Accept: 'application/json',
    Authorization:
        'Basic ' +
        btoa(
            import.meta.env.VITE_SURREAL_USER +
                ':' +
                import.meta.env.VITE_SURREAL_PASS
        ),
    NS: 'test',
    DB: 'test',
}
