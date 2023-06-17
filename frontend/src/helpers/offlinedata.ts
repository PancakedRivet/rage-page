import { SurrealGraphQuery } from './types'

export const surrealData: SurrealGraphQuery[] = [
    {
        graphData: {
            line: [
                {
                    tag: 'Adminnistration',
                    timeBucket: '2023-06-11T00:00:00Z',
                    total: 1,
                },
                {
                    tag: 'Performance',
                    timeBucket: '2023-06-11T00:00:00Z',
                    total: 1,
                },
                {
                    tag: 'Adminnistration',
                    timeBucket: '2023-06-14T00:00:00Z',
                    total: 1,
                },
                {
                    tag: 'Another Tag',
                    timeBucket: '2023-06-14T00:00:00Z',
                    total: 2,
                },
                {
                    tag: 'CloudOps',
                    timeBucket: '2023-06-14T00:00:00Z',
                    total: 1,
                },
                {
                    tag: 'Adminnistration',
                    timeBucket: '2023-06-15T00:00:00Z',
                    total: 1,
                },
                {
                    tag: 'Time Management',
                    timeBucket: '2023-06-17T00:00:00Z',
                    total: 1,
                },
            ],
            pie: 'someData',
        },
        metadata: {
            tagList: [
                {
                    tag: 'Time Management',
                },
                {
                    tag: 'Performance',
                },
                {
                    tag: 'CloudOps',
                },
                {
                    tag: 'Another Tag',
                },
                {
                    tag: 'Adminnistration',
                },
            ],
            time: {
                maxDateTime: '2023-06-18T00:00:00Z',
                minDateTime: '2023-06-11T00:00:00Z',
                timePeriod: 'day',
            },
        },
    },
]
