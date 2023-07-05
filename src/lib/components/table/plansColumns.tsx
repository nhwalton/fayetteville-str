"use client"

import { type ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Plan } from "~/types/plan";

export const plansColumns: ColumnDef<Plan>[] = [
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "link",
        header: "Permit",
        cell: ({ row }) => (
            <a className="underline" href={row.getValue<string>("link")} target="_blank" rel="noreferrer">
                Link
            </a>
        )
    }
]