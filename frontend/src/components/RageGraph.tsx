/* eslint-disable @typescript-eslint/no-explicit-any */

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'

import RefreshIcon from '@mui/icons-material/Refresh'

import NivoLine from './graph/NivoLine'
import NivoPie from './graph/NivoPie'

interface RageGraphProps {
    lineData: any
    pieData: any
    numberOfWeeksToQuery: string
    onTimePeriodChange: (newTimePeriod: string) => void
    onGraphRefetch: () => void
}

export default function RageGraph(props: RageGraphProps) {
    const {
        lineData,
        pieData,
        numberOfWeeksToQuery,
        onTimePeriodChange,
        onGraphRefetch,
    } = props

    const handleChangeTimePeriod = (event: SelectChangeEvent) => {
        const newTimePeriod = event.target.value
        onTimePeriodChange(newTimePeriod)
    }

    const handleRefreshGraph = () => {
        onGraphRefetch()
    }

    return (
        <>
            <NivoLine data={lineData} />
            <NivoPie data={pieData} />
            <Box>
                <Stack direction="row" spacing={2}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">
                            Time Period
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={numberOfWeeksToQuery}
                            label="Time Period"
                            onChange={handleChangeTimePeriod}
                        >
                            <MenuItem value={1}>Last Week</MenuItem>
                            <MenuItem value={4}>Last Month</MenuItem>
                            <MenuItem value={12}>Last Quarter</MenuItem>
                        </Select>
                    </FormControl>
                    <IconButton color="primary" onClick={handleRefreshGraph}>
                        <RefreshIcon />
                    </IconButton>
                </Stack>
            </Box>
        </>
    )
}
