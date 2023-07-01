export type NewComplaint = {
    complaint: string
    submissionTime: Date
    tags: string[]
}

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

export type NewTag = {
    name: string
    isPublic: boolean
}

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

export type SurrealGraphPie = {
    id: string | null
    value: number
}

type SurrealGraphList = {
    line: SurrealTagFilter[]
    pie: SurrealGraphPie[]
}

export type SurrealGraphQuery = {
    graphData: SurrealGraphList
    metadata: SurrealGraphMetaData
}
