// Values that are loaded from an external environment variables file
export const ENV_VARS = {
    SURREAL_URL: import.meta.env.VITE_SURREAL_URL,
    ADMIN_PASS: import.meta.env.VITE_ADMIN_PASSWORD,
    SURREAL_NAMESPACE: import.meta.env.VITE_SURREAL_NAMESPACE,
    SURREAL_DATABASE: import.meta.env.VITE_SURREAL_DATABASE,
}
