/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

import { LIGHT, DARK } from './theme'

import { ResponsiveLine } from '@nivo/line'
import { useOrdinalColorScale } from '@nivo/colors'
import { Datum } from '@nivo/legends/dist/types/types'

import { useTheme } from '@mui/material/styles'
import { NivoGraph } from '../../helpers/helpers'

type Series = {
    id: string | number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    color?: string | undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NivoLine = ({ data }: any) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'light' ? false : true

    const [hiddenIds, setHiddenIds] = React.useState<string[]>([])
    const [highlightedId, setHighlightedId] = React.useState<
        string | number | null
    >(null)
    const [filteredData, setFilteredData] = React.useState([])

    const colors = useOrdinalColorScale({ scheme: 'category10' }, 'id')

    React.useEffect(() => {
        const filteredData = data.filter(
            (item: NivoGraph) => !hiddenIds.includes(item.id)
        )
        setFilteredData(filteredData)
    }, [data, hiddenIds])

    return (
        <div className="nivo">
            <ResponsiveLine
                data={filteredData}
                // data={exampleLineData}
                theme={isDarkMode ? DARK : LIGHT}
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
                colors={(d) => colors(d)}
                useMesh={true}
                enableSlices="x"
                legends={[
                    {
                        anchor: 'bottom-right',
                        data: data.map((item: NivoGraph) => {
                            const color = colors(item)
                            return {
                                color: hiddenIds.includes(item.id)
                                    ? 'rgba(1, 1, 1, .1)'
                                    : color,
                                id: item.id,
                                label: item.id,
                            }
                        }),
                        direction: 'column',
                        onClick: (datum) => {
                            setHiddenIds((state) =>
                                changeDisplayedSeries(state, datum, data.length)
                            )
                        },
                        onMouseEnter: (datum) => {
                            setHighlightedId(datum.id)
                        },
                        onMouseLeave: () => {
                            setHighlightedId(null)
                        },
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
                layers={[
                    'grid',
                    'markers',
                    'areas',
                    'mesh',
                    'points',
                    'axes',
                    'legends',
                    'crosshair',
                    'slices',
                    // 'lines',
                    ({ series, lineGenerator, xScale, yScale }) =>
                        HighlightLine(
                            { series, lineGenerator, xScale, yScale },
                            highlightedId
                        ), // Custom lines layer
                ]}
            />
        </div>
    )
}

export default NivoLine

// function to determine whether to show or hide a series clicked on in the legend
function changeDisplayedSeries(
    state: string[],
    datum: Datum,
    graphDataCount: number
) {
    let newState = state
    // returns true if the hiddenIds includes datum
    const datumExists = state.includes(String(datum.id))

    const MINIMUM_GRAPHS_TO_SHOW = 1 // Always keep one graph displayed (Chrome tab crashes when displaying 0 graphs)
    const futureHiddenIdCount = state.length + MINIMUM_GRAPHS_TO_SHOW

    if (datumExists) {
        newState = state.filter((item) => item !== datum.id)
    } else if (!datumExists) {
        if (futureHiddenIdCount < graphDataCount) {
            newState = [...state, String(datum.id)]
        } else {
            console.warn(
                'Cannot hide all graphs. Please leave at least one graph selected.'
            )
        }
    }
    return newState
}

const HighlightLine = (
    {
        series,
        lineGenerator,
        xScale,
        yScale,
    }: {
        series: Series[]
        lineGenerator: (
            data:
                | Iterable<{ x: number; y: number }>
                | { x: number; y: number }[]
        ) => any
        xScale: (x: number | string) => any
        yScale: (y: number | string) => any
    },
    // thing,
    highlightedId: string | number | null
) => {
    const calculateOpacity = (id: string | number) => {
        if (!highlightedId) {
            return 1
        }
        if (id !== highlightedId) {
            return 0.3
        }
        return 1
    }

    return series.map(({ id, data, color }) => (
        <path
            key={id}
            d={lineGenerator(
                data.map((d: any) => ({
                    x: xScale(d.data.x),
                    y: yScale(d.data.y),
                }))
            )}
            fill="none"
            stroke={color}
            style={{
                strokeWidth: id === highlightedId ? 4 : 3,
                strokeOpacity: calculateOpacity(id),
            }}
        />
    ))
}
