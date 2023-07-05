/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CaretSortIcon, CheckIcon, MixIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import type { Plan } from "~/types/plan";
import GoogleMapComponent from '../lib/components/googleMap';
import { LoadingSpinner } from "../lib/components/loading";
import { plansColumns } from "../lib/components/table/plansColumns";
import { DataTable } from "../lib/components/table/plansTable";

const types = [
    { id: 1, name: 'Conditional Use Permits', value: 'cup' },
    { id: 2, name: 'STR Licenses - Type 1', value: 'str1' },
    { id: 3, name: 'STR Licenses - Type 2', value: 'str2' },
]

interface Timeframe {
    id: number
    name: string
    value: string
}

const timeframes = [
    { id: 1, name: 'Last 30 Days', value: 'l30' },
    { id: 2, name: 'This Year', value: 'ty' },
    { id: 3, name: 'Last Year', value: 'ly' },
    { id: 4, name: 'All Time', value: 'at' },
]

const statuses = [
    { id: 1, type: "cup", name: "Approval Expired" },
    { id: 2, type: "cup", name: "Approved" },
    { id: 3, type: "cup", name: "Conditional Approval" },
    { id: 4, type: "cup", name: "Denied" },
    { id: 5, type: "cup", name: "Fees Due" },
    { id: 6, type: "cup", name: "Fees Paid" },
    { id: 7, type: "cup", name: "In Appeal Period" },
    { id: 8, type: "cup", name: "In Review" },
    { id: 9, type: "cup", name: "On Hold" },
    { id: 10, type: "cup", name: "Review Expired" },
    { id: 11, type: "cup", name: "Submitted" },
    { id: 12, type: "cup", name: "Submitted - Online" },
    { id: 13, type: "cup", name: "Tabled" },
    { id: 14, type: "cup", name: "Void" },
    { id: 15, type: "cup", name: "Withdrawn" },
    { id: 16, type: "str", name: "Denied" },
    { id: 17, type: "str", name: "Expired" },
    { id: 18, type: "str", name: "Fees Due" },
    { id: 19, type: "str", name: "Fees Paid" },
    { id: 20, type: "str", name: "In Review" },
    { id: 21, type: "str", name: "Issued" },
    { id: 22, type: "str", name: "Non Renewable" },
    { id: 23, type: "str", name: "On Hold" },
    { id: 24, type: "str", name: "Hold" },
    { id: 25, type: "str", name: "Renewed" },
    { id: 26, type: "str", name: "Revoked" },
    { id: 27, type: "str", name: "Submitted" },
    { id: 28, type: "str", name: "Submitted - Online" },
    { id: 29, type: "str", name: "Void" },
]

export default function Home() {

    const [plans, setPlans] = useState<Plan[]>([])
    const [timeframe, setTimeframe] = useState<Timeframe>(timeframes[3] as Timeframe)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 36.062579, lng: -94.157426 })
    const [home, setHome] = useState<boolean>(true)

    const [selectedTypes, setSelectedTypes] = useState([types[1], types[2]])
    const [validStatuses, setValidStatuses] = useState([statuses[4], statuses[5], statuses[6], statuses[7], statuses[8], statuses[10], statuses[11], statuses[20], statuses[24]])

    const getPlans = async () => {
        setHome(false)
        setIsLoading(true)
        const offset = new Date().getTimezoneOffset()
        const startDate = new Date(Date.now() - (offset * 60 * 1000))
        const endDate = new Date(Date.now() - (offset * 60 * 1000))
        switch (timeframe.value) {
            case "l30":
                startDate.setDate(startDate.getDate() - 30)
                endDate.setDate(endDate.getDate() + 1)
                break;
            case "ty":
                startDate.setMonth(0)
                startDate.setDate(0)
                break;
            case "ly":
                startDate.setFullYear(startDate.getFullYear() - 1)
                startDate.setMonth(0)
                startDate.setDate(0)
                endDate.setFullYear(endDate.getFullYear() - 1)
                endDate.setMonth(11)
                endDate.setDate(30)
                break;
            case "at":
                startDate.setFullYear(2021)
                startDate.setMonth(4)
                startDate.setDate(1)
            default:
                break;
        }
        const start = startDate.toISOString().split('T')[0] as string
        const end = endDate.toISOString().split('T')[0] as string

        const allPlans = [] as Plan[]
        for (const callType of selectedTypes) {
            const callValue = callType?.value as string
            const plansResponse = await fetch(`/api/plans/?startDate=${start}&endDate=${end}&type=${callValue}`)
            const plans = await plansResponse.json() as Plan[];
            for (const plan of plans) {
                const statusType = callValue === 'cup' ? 'cup' : 'str'
                const validStatus = validStatuses.find(status => status && status.type === statusType && status.name === plan.status)
                if (validStatus) {
                    allPlans.push(plan)
                }
            }
            // allPlans.push(...plans)
        }
        setPlans(allPlans)
    }

    useEffect(() => {
        setIsLoading(false)
    }, [plans])

    function classNames(...classes: unknown[]) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
            <Head>
                <title>Fayetteville STRs</title>
                <meta name="description" content="Find and map short-term rental licenses in Fayetteville, AR." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-start bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7),rgba(0,0,0,0.8)),url('/background.jpg')] bg-fixed bg-black/10 bg-cover bg-center">
                <div className="container flex flex-col items-center justify-center gap-8 px-4 py-8 md:py-16">
                    <h1 className="font-extrabold tracking-tight text-white text-4xl md:text-[5rem] sm:pb-5">
                        Fayetteville <span className="text-[hsl(280,100%,70%)] text-rose-500">STRs</span>
                    </h1>
                    <div className="flex flex-col flex-grow h-full w-full md:w-3/4 items-start md:items-center">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-center w-full">
                            <div className="relative w-full md:w-[10rem]">
                                <Listbox value={timeframe} onChange={setTimeframe}>
                                    <Listbox.Button className="group bg-white/10 hover:bg-white/20 w-full text-white rounded-xl px-4 py-2 flex flex-row items-center justify-between gap-2">
                                        {timeframe.name}
                                        <CaretSortIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="z-[999999] absolute mt-4 w-[10rem] rounded-xl max-h-60 overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {timeframes.map((tf) => (
                                                <Listbox.Option
                                                    key={tf.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-rose-100 text-rose-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={tf}
                                                >
                                                    {({ selected }) => {
                                                        return (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {tf.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )
                                                    }}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </Listbox>
                            </div>
                            <div className="relative w-full md:w-[12rem]">
                                <Listbox value={selectedTypes} onChange={setSelectedTypes} multiple>
                                    <Listbox.Button className="group bg-white/10 hover:bg-white/20 w-full text-white rounded-xl px-4 py-2 flex flex-row items-center justify-between gap-2">
                                        Permit Types {selectedTypes.length > 0 ? `(${selectedTypes.length})` : null}
                                        <CaretSortIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="z-[999999] absolute mt-4 rounded-xl max-h-60 overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {types.map((type) => (
                                                <Listbox.Option
                                                    key={type.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-rose-100 text-rose-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={type}
                                                >
                                                    {({ selected }) => {
                                                        return (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {type.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )
                                                    }}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </Listbox>
                            </div>
                            <div className="relative w-full md:w-[10rem]">
                                <Listbox value={validStatuses} onChange={setValidStatuses} multiple>
                                    <Listbox.Button className="group bg-white/10 hover:bg-white/20 w-full text-white rounded-xl px-4 py-2 flex flex-row items-center justify-between gap-2">
                                        Statuses {validStatuses.length > 0 ? `(${validStatuses.length})` : null}
                                        <CaretSortIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="z-[999999] absolute mt-4 rounded-xl max-h-60 overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            <div className="ps-2 py-2 font-medium text-neutral-800">Conditional Use Permits</div>
                                            {statuses.map((status) => (
                                                status.type === "cup" &&
                                                <Listbox.Option
                                                    key={status.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-rose-100 text-rose-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={status}
                                                >
                                                    {({ selected }) => {
                                                        return (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {status.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )
                                                    }}
                                                </Listbox.Option>
                                            ))}
                                            <hr className="mt-2" />
                                            <div className="ps-2 py-2 font-medium text-neutral-800">STR Licenses</div>
                                            {statuses.map((status) => (
                                                status.type === "str" &&
                                                <Listbox.Option
                                                    key={status.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-rose-100 text-rose-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={status}
                                                >
                                                    {({ selected }) => {
                                                        return (
                                                            <>
                                                                <span
                                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                        }`}
                                                                >
                                                                    {status.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-600">
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )
                                                    }}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </Listbox>
                            </div>
                            <div className="h-full bg-rose-500 rounded-xl w-full md:w-[10rem] items-center">
                                <button
                                    className="flex flex-row w-full gap-2 items-center bg-white/20 bg-rose-500 hover:bg-white/20 text-white rounded-xl px-4 py-2 justify-center"
                                    onClick={() => void getPlans()}
                                >
                                    Go <PaperPlaneIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                    {isLoading && home && plans.length < 1 ? <div className="w-full h-12 flex items-center justify-center"><LoadingSpinner size={48} /></div> : ""}
                    <div className="w-full mx-auto py-2 text-white relative">
                        {home &&
                            <div className="flex flex-col gap-4 w-full md:w-1/2 mx-auto rounded-xl text-white">
                                <span>To begin exploring short-term rental licenses and conditional use permits, click Go.</span>
                                <span>By default, the search parameters are set to show all active short-term rental licenses.</span>
                                <span>You may change this by toggling Conditional Use Permits under Permit Types to view pending CUPs.</span>
                                <span>For a deeper dive, you may use the Statuses dropdown to view all possible permit/license statuses.</span>
                            </div>}
                        {!home && !isLoading && plans.length === 0 &&
                            <div className="rounded-xl h-[400px] md:h-[800px] w-full bg-black/50 flex items-center justify-center ring-black/80 text-center">
                                No results found. <br /> Consider expanding your search options.
                            </div>
                        }
                        {isLoading && ((plans.length > 0) || (!home && plans.length === 0)) ? <div className="absolute top-0 right-0 z-[999999] h-[400px] md:h-[800px] w-full py-2"><div className="rounded-xl h-[400px] md:h-[800px] w-full bg-black/40 flex items-center justify-center ring-black/80"><LoadingSpinner size={48} /></div></div> : ""}
                        {plans && plans.length > 0 ? <GoogleMapComponent markers={plans} center={center} /> : ""}
                    </div>
                    <div className="hidden md:visible w-full mx-auto py-2 text-white rounded-xl">
                        {plansColumns && plans && plans.length > 0 ? <DataTable columns={plansColumns} data={plans} setCenter={setCenter} /> : ""}
                    </div>
                </div>
            </main >
        </>
    );
}
