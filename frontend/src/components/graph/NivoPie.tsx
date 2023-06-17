/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOrdinalColorScale } from '@nivo/colors'
import { ResponsivePie } from '@nivo/pie'
import { useTheme } from '@mui/material/styles'
import { DARK, LIGHT } from './theme'

export const NivoPie = ({ data }: any) => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === 'light' ? false : true
    const colors = useOrdinalColorScale({ scheme: 'category10' }, 'id')

    return (
        <div className="nivo">
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                theme={isDarkMode ? DARK : LIGHT}
                colors={(d) => colors(d)}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]],
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                    },
                ]}
            />
        </div>
    )
}
