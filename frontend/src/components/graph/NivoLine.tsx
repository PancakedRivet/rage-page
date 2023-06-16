// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'

const exampleData = [
    {
        id: 'japan',
        color: 'hsl(248, 70%, 50%)',
        data: [
            {
                x: 'plane',
                y: 234,
            },
            {
                x: 'helicopter',
                y: 242,
            },
            {
                x: 'boat',
                y: 231,
            },
            {
                x: 'train',
                y: 289,
            },
            {
                x: 'subway',
                y: 188,
            },
            {
                x: 'bus',
                y: 295,
            },
            {
                x: 'car',
                y: 242,
            },
            {
                x: 'moto',
                y: 208,
            },
            {
                x: 'bicycle',
                y: 216,
            },
            {
                x: 'horse',
                y: 49,
            },
            {
                x: 'skateboard',
                y: 86,
            },
            {
                x: 'others',
                y: 134,
            },
        ],
    },
    {
        id: 'france',
        color: 'hsl(217, 70%, 50%)',
        data: [
            {
                x: 'plane',
                y: 179,
            },
            {
                x: 'helicopter',
                y: 236,
            },
            {
                x: 'boat',
                y: 184,
            },
            {
                x: 'train',
                y: 164,
            },
            {
                x: 'subway',
                y: 289,
            },
            {
                x: 'bus',
                y: 221,
            },
            {
                x: 'car',
                y: 95,
            },
            {
                x: 'moto',
                y: 151,
            },
            {
                x: 'bicycle',
                y: 138,
            },
            {
                x: 'horse',
                y: 115,
            },
            {
                x: 'skateboard',
                y: 59,
            },
            {
                x: 'others',
                y: 18,
            },
        ],
    },
    {
        id: 'us',
        color: 'hsl(84, 70%, 50%)',
        data: [
            {
                x: 'plane',
                y: 236,
            },
            {
                x: 'helicopter',
                y: 57,
            },
            {
                x: 'boat',
                y: 193,
            },
            {
                x: 'train',
                y: 123,
            },
            {
                x: 'subway',
                y: 138,
            },
            {
                x: 'bus',
                y: 266,
            },
            {
                x: 'car',
                y: 124,
            },
            {
                x: 'moto',
                y: 186,
            },
            {
                x: 'bicycle',
                y: 257,
            },
            {
                x: 'horse',
                y: 62,
            },
            {
                x: 'skateboard',
                y: 44,
            },
            {
                x: 'others',
                y: 253,
            },
        ],
    },
    {
        id: 'germany',
        color: 'hsl(355, 70%, 50%)',
        data: [
            {
                x: 'plane',
                y: 24,
            },
            {
                x: 'helicopter',
                y: 267,
            },
            {
                x: 'boat',
                y: 209,
            },
            {
                x: 'train',
                y: 72,
            },
            {
                x: 'subway',
                y: 191,
            },
            {
                x: 'bus',
                y: 6,
            },
            {
                x: 'car',
                y: 136,
            },
            {
                x: 'moto',
                y: 125,
            },
            {
                x: 'bicycle',
                y: 158,
            },
            {
                x: 'horse',
                y: 284,
            },
            {
                x: 'skateboard',
                y: 18,
            },
            {
                x: 'others',
                y: 169,
            },
        ],
    },
    {
        id: 'norway',
        color: 'hsl(307, 70%, 50%)',
        data: [
            {
                x: 'plane',
                y: 294,
            },
            {
                x: 'helicopter',
                y: 114,
            },
            {
                x: 'boat',
                y: 297,
            },
            {
                x: 'train',
                y: 90,
            },
            {
                x: 'subway',
                y: 25,
            },
            {
                x: 'bus',
                y: 134,
            },
            {
                x: 'car',
                y: 185,
            },
            {
                x: 'moto',
                y: 40,
            },
            {
                x: 'bicycle',
                y: 239,
            },
            {
                x: 'horse',
                y: 186,
            },
            {
                x: 'skateboard',
                y: 98,
            },
            {
                x: 'others',
                y: 77,
            },
        ],
    },
]

const exampleLineData = [
    {
        id: 'fake corp. A',
        data: [
            { x: '2018-01-01', y: 7 },
            { x: '2018-01-02', y: 5 },
            { x: '2018-01-03', y: 11 },
            { x: '2018-01-04', y: 9 },
            { x: '2018-01-05', y: 12 },
            { x: '2018-01-06', y: 16 },
            { x: '2018-01-07', y: 13 },
            { x: '2018-01-08', y: 13 },
        ],
    },
    {
        id: 'fake corp. B',
        data: [
            { x: '2018-01-04', y: 14 },
            { x: '2018-01-05', y: 14 },
            { x: '2018-01-06', y: 15 },
            { x: '2018-01-07', y: 11 },
            { x: '2018-01-08', y: 10 },
            { x: '2018-01-09', y: 12 },
            { x: '2018-01-10', y: 9 },
            { x: '2018-01-11', y: 7 },
        ],
    },
]

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NivoLine = ({ data }: any) => (
    <div className="nivo">
        <ResponsiveLine
            data={data}
            // data={exampleLineData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                useUTC: false,
                precision: 'day',
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
                type: 'linear',
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'count',
                legendOffset: -40,
                legendPosition: 'middle',
            }}
            axisBottom={{
                format: '%b %d',
                tickValues: 'every 2 days',
                legend: 'time scale',
                legendOffset: -12,
            }}
            enablePointLabel={true}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            colors={{ scheme: 'set1' }}
            useMesh={true}
            enableSlices={false}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    </div>
)

export default NivoLine
