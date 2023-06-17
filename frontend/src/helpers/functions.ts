import { NivoGraph, SurrealGraphQuery, SurrealTagFilter } from './types'

function getDaysArray(start: Date, end: Date, increment: number) {
    const arr = []
    for (
        let dt = new Date(start);
        dt <= new Date(end);
        dt.setDate(dt.getDate() + increment)
    ) {
        arr.push(dt.toDateString())
    }
    return arr
}

export function convertSurrealQueryToNivoLine(
    surrealQueryData: SurrealGraphQuery
) {
    const lineDataForTag = new Map()

    const daylist = getDaysArray(
        new Date(surrealQueryData.metadata.time.minDateTime),
        new Date(surrealQueryData.metadata.time.maxDateTime),
        1
    )

    // Intially setting each date to 0 total
    surrealQueryData.metadata.tagList.map((tag) => {
        const key = tag.tag ? tag.tag : 'Not tagged'

        const zeroDataMap = new Map()

        daylist.map((date) => {
            zeroDataMap.set(date, 0)
        })

        lineDataForTag.set(key, zeroDataMap)
    })

    // Update the date to reflect the correct totals
    surrealQueryData.graphData.line.map((item: SurrealTagFilter) => {
        const key = item.tag ? item.tag : 'Not tagged'
        // Get the map for a specific tag
        const dataMap = lineDataForTag.get(key)

        // Update the new total for the specific timebucket
        const dateString = new Date(item.timeBucket)
        dataMap.set(dateString.toDateString(), item.total)

        // Update the map with the new total (as it was 0 and each item has a unique timeBucket and tag combination
        lineDataForTag.set(key, dataMap)
    })

    const returnedDataForNivoLine: NivoGraph[] = []

    // Shape the data into an array for returning
    lineDataForTag.forEach((dataMap, tagName) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataArray = Array.from(dataMap, function (entry: any) {
            return { x: new Date(entry[0]), y: entry[1] }
        })
        returnedDataForNivoLine.push({
            id: tagName,
            data: dataArray,
        })
    })

    return returnedDataForNivoLine
}
