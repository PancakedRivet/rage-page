import { SurrealGraphQuery } from './helpers'

export const surrealData: SurrealGraphQuery[] = [
    {
        metadata: {
            tagList: [
                {
                    tag: null,
                },
                {
                    tag: 'Cloud Ops',
                },
                {
                    tag: 'Performance',
                },
                {
                    tag: 'Test Tag',
                },
                {
                    tag: 'Test Tag 2',
                },
                {
                    tag: 'Test Tag 3',
                },
                {
                    tag: 'Test Tag 4',
                },
                {
                    tag: 'Test Tag 5',
                },
                {
                    tag: 'Another Tag',
                },
            ],
            time: {
                maxDateTime: '2023-06-16T00:00:00Z',
                minDateTime: '2023-06-09T00:00:00Z',
                timePeriod: 'day',
            },
        },
        result: [
            {
                tag: null,
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Cloud Ops',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Performance',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 2,
            },
            {
                tag: 'Test Tag 2',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 2,
            },
            {
                tag: 'Test Tag 3',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag 4',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag 5',
                timeBucket: '2023-06-09T00:00:00Z',
                total: 2,
            },
            {
                tag: 'Another Tag',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Cloud Ops',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 1,
            },
            {
                tag: 'Test Tag 2',
                timeBucket: '2023-06-13T00:00:00Z',
                total: 2,
            },
        ],
    },
]
