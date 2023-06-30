/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import fs from 'fs';
import addressData from '../data/addresses.json';

import type { GeoRoot } from "../../types/geocodeResults";

export interface Address {
    id: number
    address: string
    lat: number
    lng: number
}

const addresses = addressData as Address[];

export const addressesRepo = {
    getAddresses: () => addresses,
    create,
}

async function create(address: string) {

    const newAddress = {} as Address;

    newAddress.id = addresses.length ? Math.max(...addresses.map((x: Address) => x.id)) + 1 : 1;
    newAddress.address = address;

    const geocodeApiKey = process.env.NEXT_PUBLIC_GOOGLE_GEOCODE_API_KEY as string
    console.log("creating entry for address: ", newAddress.address)
    let geocode = {} as GeoRoot;
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geocodeApiKey}`)
        geocode = await response.json() as GeoRoot;
    } catch (error) {
        console.log("error: ", error)
    }

    if (geocode.results[0]) {
        newAddress.lat = geocode.results[0].geometry.location.lat;
        newAddress.lng = geocode.results[0].geometry.location.lng;

        addresses.push(newAddress);
        saveData();
        return newAddress;
    } else {
        throw new Error("Address could not be geocoded.");
    }

}

function saveData() {
    fs.writeFileSync('src/lib/data/addresses.json', JSON.stringify(addresses, null, 4));
}
