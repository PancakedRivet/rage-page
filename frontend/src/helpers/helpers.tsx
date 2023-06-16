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

type NivoGraphPoint = {
    x: string | number | Date
    y: string | number
}

export type NivoGraph = {
    id: string
    data: NivoGraphPoint[]
}

type SurrealGraphMetaDataTagList = {
    tag: string | null
}

type SurrealGraphMetaData = {
    tagList: SurrealGraphMetaDataTagList[]
    time: {
        maxDateTime: string
        minDateTime: string
        timePeriod: string
    }
}

export type SurrealTagFilter = {
    tag: string | null
    timeBucket: string
    total: number
}

export type SurrealGraphQuery = {
    result: SurrealTagFilter[]
    metadata: SurrealGraphMetaData
}
