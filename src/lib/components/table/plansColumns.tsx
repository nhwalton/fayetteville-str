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
        accessorKey: "id",
        header: "Link",
        cell: ({ row }) => {
            const baseUrl = row.getValue("type") == "Conditional User Permit"
                ? "https://egov.fayetteville-ar.gov/EnerGov_Prod/SelfService#/plan/"
                : "https://egov.fayetteville-ar.gov/EnerGov_Prod/SelfService#/businessLicense/"
            const id = row.getValue<string>("id")
            const url = `${baseUrl}${id}`
            return (
                <a href={url} target="_blank" rel="noreferrer">
                    Link
                </a>
            );
        }
    }
]