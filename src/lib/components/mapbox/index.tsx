/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mapboxgl, { type GeoJSONSource, type GeoJSONSourceRaw, type LngLat } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { type Plan } from "~/types/plan";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_MAPS_API_KEY as string;

const MapboxComponent: React.FC<{ markers: Plan[], center: LngLat }> = ({ markers, center }) => {
    // const center = { lat: 36.062579, lng: -94.157426 }

    const mapContainer = useRef(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(center.lng);
    const [lat, setLat] = useState(center.lat);
    const [zoom, setZoom] = useState(13);
    const [mapLoad, setMapLoad] = useState(false);

    const Popup = (props: { date: string, address: string, status: string, type: string, url: string }) => {
        const { date, address, status, type, url } = props
        return (
            <>
                <div className="flex flex-col gap-2 text-slate-800 w-[300px]">
                    <div className="grid grid-cols-[auto_1fr]">
                        <p className="col-span-2 font-semibold mb-2 max-w-[200px]">{address.substring(0, address.toLocaleLowerCase().indexOf(' fayetteville'))}<br />{address.substring(address.toLocaleLowerCase().indexOf('fayetteville'), address.length)}</p>
                        <p className="font-semibold me-2">Permit Type:</p><p>{type}</p>
                        <p className="font-semibold me-2">Applied:</p><p>{date}</p>
                        <p className="font-semibold me-2">Status:</p><p>{status}</p>
                        <p className="font-semibold me-2">Permit Details:</p><a className="underline" href={url} target="_blank" rel="noreferrer">Link</a>
                        <a className="me-2 font-normal text-[#1a73e8] hover:underline mt-1" href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(address)}`} target="_blank" rel="noreferrer">View on Google Maps</a>
                    </div >
                </div >
            </>
        )
    }

    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current as any,
            // style: 'mapbox://styles/mapbox/streets-v11',
            style: 'mapbox://styles/nhwalton/cljri8aof00uy01qv5a662gq2',
            center: [lng, lat],
            zoom: zoom
        });
        map.current.addControl(new mapboxgl.FullscreenControl());
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            })
        )
        map.current.addControl(new mapboxgl.NavigationControl());
        setMapLoad(true)
    }, [lat, lng, zoom]);

    useEffect(() => {
        if (!map.current) return;
        map.current.on('move', () => {
            setLng(map.current?.getCenter().lng as number);
            setLat(map.current?.getCenter().lat as number);
            if (map.current) setZoom(parseInt(map.current?.getZoom().toFixed(2)));
        });
    }, []);

    useEffect(() => {
        if (!map.current) return;
        if (!mapLoad) return;
        const markersGeoJSON: GeoJSON.FeatureCollection = ({
            type: "FeatureCollection",
            features: markers.map(marker => {
                let markerLng = marker.lng
                let markerLat = marker.lat
                if (marker.type === 'Short-Term Rental Type 1') {
                    markerLng = marker.lng + 0.00002
                    markerLat = marker.lat + 0.00002
                } else if (marker.type === 'Conditional Use Permit - General') {
                    markerLng = marker.lng - 0.00002
                    markerLat = marker.lat - 0.00002
                } else {
                    markerLng = marker.lng
                    markerLat = marker.lat
                }

                return ({
                    type: "Feature",
                    properties: {
                        date: marker.date,
                        address: marker.address,
                        status: marker.status,
                        id: marker.id,
                        type: marker.type,
                        link: marker.link,
                        color: marker.type ===
                            'Conditional Use Permit - General' ? '#2563eb'
                            : (marker.type === 'Short-Term Rental Type 1' ? "#fbbf24"
                                :
                                "#fb7185"),
                        stroke: marker.type ===
                            'Conditional Use Permit - General' ? "#2563eb"
                            : (marker.type === 'Short-Term Rental Type 1' ? "#d97706"
                                :
                                "#e11d48")
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [markerLng, markerLat]
                    }
                })
            })
        })
        if (map.current?.getSource('plans')) {
            console.log('plans loaded')
            map.current.removeLayer('unclustered-point')
            map.current.removeLayer('cluster-count')
            map.current.removeLayer('clusters')
            map.current.removeSource('plans');
        }

        map.current?.addSource('plans', {
            type: 'geojson',
            data: markersGeoJSON,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        } as GeoJSONSourceRaw)

        map.current.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'plans',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#38bdf8',
                    5,
                    '#facc15',
                    25,
                    '#f472b6',
                    100,
                    '#f87171'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    15,
                    5,
                    20,
                    25,
                    25,
                    100,
                    30
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': [
                    'step',
                    ['get', 'point_count'],
                    '#0284c7',
                    5,
                    '#ca8a04',
                    25,
                    '#db2777',
                    100,
                    '#dc2626'
                ]
            }
        });
        map.current.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'plans',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });
        map.current.addLayer({
            id: 'unclustered-point',
            type: 'symbol',
            source: 'plans',
            filter: ['!', ['has', 'point_count']],
            layout: {
                'text-line-height': 1,
                'text-padding': 0,
                'text-anchor': 'bottom',
                'text-allow-overlap': true,
                'text-field': [
                    'match',
                    ['get', 'type'],
                    'Conditional Use Permit - General',
                    String.fromCharCode(0xF024),
                    'Short-Term Rental Type 1',
                    String.fromCharCode(0xF236),
                    'Short-Term Rental Type 2',
                    String.fromCharCode(0xF015),
                    '#ffffff'
                ],
                'icon-optional': true,
                'text-font': ['Font Awesome 6 Free Solid', 'Arial Unicode MS Bold'],
                'text-size': 16,
            },
            paint: {
                'text-color': [
                    'match',
                    ['get', 'type'],
                    'Conditional Use Permit - General',
                    ['match',
                        ['get', 'status'],
                        'Approved',
                        '#38bdf8',
                        'Denied',
                        '#dc2626',
                        '#c084fc'],
                    'Short-Term Rental Type 1',
                    ['match',
                        ['get', 'status'],
                        ['Issued', 'Renewed'],
                        '#fbbf24',
                        'Denied',
                        '#dc2626',
                        '#c084fc'],
                    'Short-Term Rental Type 2',
                    ['match',
                        ['get', 'status'],
                        ['Issued', 'Renewed'],
                        '#fb7185',
                        'Denied',
                        '#dc2626',
                        '#c084fc'],
                    '#ffffff'
                ],
                'text-halo-color': [
                    'match',
                    ['get', 'type'],
                    'Conditional Use Permit - General',
                    ['match',
                        ['get', 'status'],
                        'Approved',
                        '#0369a1',
                        'Denied',
                        '#7f1d1d',
                        '#7e22ce'],
                    'Short-Term Rental Type 1',
                    ['match',
                        ['get', 'status'],
                        ['Issued', 'Renewed'],
                        '#a16207',
                        'Denied',
                        '#7f1d1d',
                        '#7e22ce'],
                    'Short-Term Rental Type 2',
                    ['match',
                        ['get', 'status'],
                        ['Issued', 'Renewed'],
                        '#be185d',
                        'Denied',
                        '#7f1d1d',
                        '#7e22ce'],
                    '#ffffff'
                ],
                'icon-opacity': 1,
                'text-halo-width': 1,
                'text-opacity': 1,
                'text-translate': [0, 0],
            }
        });
        map.current.on('click', 'clusters', function (e) {
            const features = map.current?.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            }) as GeoJSON.Feature<GeoJSON.Point>[];
            const clusterId = features[0]?.properties?.cluster_id as number;
            const plansSource = map.current?.getSource('plans') as GeoJSONSource;
            plansSource.getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;
                    map.current?.easeTo({
                        center: features[0]?.geometry?.coordinates as GeoJSON.Position as mapboxgl.LngLatLike,
                        zoom: zoom
                    });
                }
            );
        }
        );

        map.current.on('click', 'unclustered-point', function (e) {
            if (e.features) {
                const coordinates = e.features && (e.features[0]?.geometry as GeoJSON.Point).coordinates.slice() as GeoJSON.Position as mapboxgl.LngLatLike;
                const { date, address, status, type, link } = e.features[0]?.properties as Plan;
                const popupNode = document.createElement('div');
                popupNode.style.cssText = 'padding-left:0.5rem;'
                ReactDOM.createRoot(popupNode).render(
                    <Popup date={date} address={address} status={status} type={type} url={link} />
                )
                new mapboxgl.Popup({ maxWidth: "300px" })
                    .setLngLat(coordinates)
                    .setDOMContent(
                        popupNode
                    )
                    .addTo(map.current as mapboxgl.Map)
                    .setOffset([0, -15]);
            }
        });
        map.current.on('mouseenter', 'clusters', function () {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        }
        );
        map.current.on('mouseleave', 'clusters', function () {
            if (map.current) map.current.getCanvas().style.cursor = '';
        }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markers])

    return (

        <div className="rounded-xl overflow-hidden relative h-[400px] md:h-[800px] w-full text-black">
            <div className="top-0 left-0 w-full h-full absolute" ref={mapContainer} />
            {(markers.length > 0) &&
                < div className="bg-rose-500 text-white py-2 px-4 z-10 absolute top-0 left-0 m-2 rounded-xl drop-shadow-md ring-1 ring-rose-700">
                    Results: {markers.length}
                </div>
            }
        </div>
    )
}

export default MapboxComponent