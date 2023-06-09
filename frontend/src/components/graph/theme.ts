/*
    Used as objects to pass to the Nivo Grapher to adjust asthetics like theme.
*/

export const LIGHT = {
    background: '#ffffff',
    textColor: '#333333',
    fontSize: 11,
    axis: {
        domain: {
            line: {
                stroke: '#777777',
                strokeWidth: 1,
            },
        },
        legend: {
            text: {
                fontSize: 12,
                fill: '#333333',
            },
        },
        ticks: {
            line: {
                stroke: '#777777',
                strokeWidth: 1,
            },
            text: {
                fontSize: 11,
                fill: '#333333',
            },
        },
    },
    grid: {
        line: {
            stroke: '#dddddd',
            strokeWidth: 1,
        },
    },
    legends: {
        title: {
            text: {
                fontSize: 11,
                fill: '#333333',
            },
        },
        text: {
            fontSize: 11,
            fill: '#333333',
        },
        ticks: {
            line: {},
            text: {
                fontSize: 10,
                fill: '#333333',
            },
        },
    },
    annotations: {
        text: {
            fontSize: 13,
            fill: '#333333',
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
        link: {
            stroke: '#000000',
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
        outline: {
            stroke: '#000000',
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
        symbol: {
            fill: '#000000',
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
    },
    tooltip: {
        container: {
            background: '#ffffff',
            color: '#333333',
            fontSize: 12,
        },
        basic: {},
        chip: {},
        table: {},
        tableCell: {},
        tableCellValue: {},
    },
    markerLine: '#77029e',
}

export const DARK = {
    background: '#121212', // taken from the Materia dark theme background color
    textColor: '#ffffff',
    fontSize: 11,
    axis: {
        domain: {
            line: {
                stroke: '#777777',
                strokeWidth: 1,
            },
        },
        legend: {
            text: {
                fontSize: 12,
                fill: '#ffffff',
            },
        },
        ticks: {
            line: {
                stroke: '#777777',
                strokeWidth: 1,
            },
            text: {
                fontSize: 11,
                fill: '#ffffff',
            },
        },
    },
    grid: {
        line: {
            stroke: '#dddddd',
            strokeWidth: 1,
        },
    },
    crosshair: {
        line: {
            stroke: '#ffffff',
            strokeWidth: 1,
            strokeOpacity: 0.9,
        },
    },
    legends: {
        title: {
            text: {
                fontSize: 11,
                fill: '#ffffff',
            },
        },
        text: {
            fontSize: 11,
            fill: '#ffffff',
        },
        ticks: {
            line: {},
            text: {
                fontSize: 10,
                fill: '#ffffff',
            },
        },
    },
    annotations: {
        text: {
            fontSize: 13,
            fill: '#333333',
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
        link: {
            stroke: '#000000',
            strokeWidth: 1,
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
        outline: {
            stroke: '#000000',
            strokeWidth: 2,
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
        symbol: {
            fill: '#000000',
            outlineWidth: 2,
            outlineColor: '#ffffff',
            outlineOpacity: 1,
        },
    },
    tooltip: {
        container: {
            background: '#000000',
            color: '#ffffff',
            fontSize: 12,
        },
        basic: {},
        chip: {},
        table: {},
        tableCell: {},
        tableCellValue: {},
    },
    markerLine: '#fc05f4',
}
