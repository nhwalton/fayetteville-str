/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Storage } from '@google-cloud/storage'

import type { GeoRoot } from "../../types/geocodeResults";

export interface Address {
    id: number
    address: string
    lat: number
    lng: number
}

const storageClient = new Storage(
    {
        projectId: "dulcet-abacus-245416",
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS as string),
    }
);

async function getAddressesFromGCP(): Promise<Address[]> {
    const bucket = storageClient.bucket(process.env.GOOGLE_STORAGE_BUCKET as string);
    const file = bucket.file('addresses.json');
    const fileContents = await file.download();
    const addresses = JSON.parse(fileContents.toString()) as Address[];
    return addresses;
}

const addresses = await getAddressesFromGCP();

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
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${geocodeApiKey}`
    try {
        const response = await fetch(geocodeUrl)
        geocode = await response.json() as GeoRoot;
    } catch (error) {
        console.log("error fetching geocode: ", geocodeUrl)
        console.log("error: ", error)
    }

    if (geocode.results[0]) {
        newAddress.lat = geocode.results[0].geometry.location.lat;
        newAddress.lng = geocode.results[0].geometry.location.lng;

        addresses.push(newAddress);
        await saveData(addresses);
        return newAddress;
    } else {
        console.log(geocode)
        throw new Error("Address could not be geocoded.");
    }

}

async function saveData(addresses: Address[]) {
    // fs.writeFileSync('src/lib/data/addresses.json', JSON.stringify(addresses, null, 4));
    // write addresses to g oogle storage
    // const storageClient = new Storage();
    const bucket = storageClient.bucket(process.env.GOOGLE_STORAGE_BUCKET as string);
    const file = bucket.file('addresses.json');
    await file.save(JSON.stringify(addresses, null, 4));
}
