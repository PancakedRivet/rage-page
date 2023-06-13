export const DATABASE_URL = 'http://localhost:9000/'

export type Complaint = {
    id: string
    complaint: string
    submissionTime: Date
    tags: string[]
}

type NonDataTableRow = {
    select?: string
    edit?: string
}

export type ComplaintTableRow = Complaint & NonDataTableRow

export type Tag = {
    id: string
    name: string
}
