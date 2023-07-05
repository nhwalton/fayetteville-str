/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import React, { Dispatch, SetStateAction } from "react";
import { Plan } from "~/types/plan";

interface DataTableProps {
    columns: ColumnDef<Plan>[]
    data: Plan[]
    setCenter: Dispatch<SetStateAction<google.maps.LatLngLiteral>>
}

export function DataTable({
    columns,
    data,
    setCenter,
}: DataTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="rounded-xl border border-black/40 bg-black/60 text-purple-50 px-8 pt-4 backdrop-blur">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    if (cell.column.id == "address") {
                                        return (
                                            <TableCell className="text-md" key={cell.id}>
                                                <button className="flex flex-row gap-2 items-center underline" onClick={() => setCenter({ lat: Number(row.original.lat), lng: Number(row.original.lng) })}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </button>
                                            </TableCell>
                                        )
                                    } else {
                                        return (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        )
                                    }
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex flex-row justify-center gap-12 p-4">
                <button onClick={() => table.previousPage()}>Previous</button>
                <span> {data.length}</span>
                <button onClick={() => table.nextPage()}>Next</button>
            </div>
        </div>
    )
}
