export const DATABASE_URL = 'http://localhost:9000/'

export type Complaint = {
    id: string
    complaint: string
    submissionTime: Date
    tags: string[]
}
