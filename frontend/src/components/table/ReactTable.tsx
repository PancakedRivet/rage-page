/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComplaintTableRow } from '../../helpers/helpers'
import TablePaginationActions from './TablePaginationActions'
import './table.css'

import {
    Column,
    Table as ReactTable,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    getSortedRowModel,
} from '@tanstack/react-table'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import React from 'react'

type Props<T> = {
    data: T[]
    columns: ColumnDef<T, any>[]
    showTableState?: boolean
}

export default function ReactTable({
    data,
    columns,
    showTableState = false,
}: Props<ComplaintTableRow>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        // Pipeline
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        //
        debugTable: showTableState,
    })

    const { pageSize, pageIndex } = table.getState().pagination

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableCell
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div>
                                                    <div
                                                        {...{
                                                            className:
                                                                header.column.getCanSort()
                                                                    ? 'cursor-pointer select-none'
                                                                    : '',
                                                            onClick:
                                                                header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: ' 🔼',
                                                            desc: ' 🔽',
                                                        }[
                                                            header.column.getIsSorted() as string
                                                        ] ?? null}
                                                    </div>
                                                    {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter
                                                                column={
                                                                    header.column
                                                                }
                                                                table={table}
                                                            />
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[
                    5,
                    10,
                    25,
                    { label: 'All', value: data.length },
                ]}
                component="div"
                count={table.getFilteredRowModel().rows.length}
                rowsPerPage={pageSize}
                page={pageIndex}
                SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                }}
                onPageChange={(_, page) => {
                    table.setPageIndex(page)
                }}
                onRowsPerPageChange={(e) => {
                    const size = e.target.value ? Number(e.target.value) : 10
                    table.setPageSize(size)
                }}
                ActionsComponent={TablePaginationActions}
            />
            {showTableState && (
                <pre>
                    {JSON.stringify(table.getState().pagination, null, 2)}
                </pre>
            )}
        </Box>
    )
}

function Filter({
    column,
    table,
}: {
    column: Column<any, any>
    table: ReactTable<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    return typeof firstValue === 'number' ? (
        <div className="flex space-x-2">
            <InputBase
                type="number"
                value={(columnFilterValue as [number, number])?.[0] ?? ''}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        e.target.value,
                        old?.[1],
                    ])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
            <InputBase
                type="number"
                value={(columnFilterValue as [number, number])?.[1] ?? ''}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        old?.[0],
                        e.target.value,
                    ])
                }
                placeholder={`Max`}
                className="w-24 border shadow rounded"
                inputProps={{ 'aria-label': 'search' }}
            />
        </div>
    ) : (
        <InputBase
            value={(columnFilterValue ?? '') as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            className="w-36 border shadow rounded"
            inputProps={{ 'aria-label': 'search' }}
        />
    )
}
