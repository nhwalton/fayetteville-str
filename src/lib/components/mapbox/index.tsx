/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mapboxgl, { type GeoJSONSource, type GeoJSONSourceRaw } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { type Plan } from "~/types/plan";

mapboxgl.accessToken = 'pk.eyJ1Ijoibmh3YWx0b24iLCJhIjoiY2xqcmFydmVnMGRjZjNzbzY4MzN1MjdhYyJ9.IbxdyFKrDAxWo0cbBu_N_A';

const MapboxComponent: React.FC<{ markers: Plan[], center: google.maps.LatLngLiteral }> = ({ markers }) => {
    const mapContainer = useRef(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(-94.157426);
    const [lat, setLat] = useState(36.062579);
    const [zoom, setZoom] = useState(13);
    const [mapLoad, setMapLoad] = useState(false);

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
            features: markers.map(marker => ({
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
                    coordinates: [marker.lng, marker.lat]
                }
            }))
        })
        console.log('load')
        if (map.current?.isSourceLoaded('plans')) {
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
        map.current.loadImage(
            '/icons/house-solid.png',
            (error, image) => {
                if (error) throw error;
                image && map.current?.addImage('cat', image, { sdf: true });
            })
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
                'text-size': 16
            },
            paint: {
                'text-color': [
                    'match',
                    ['get', 'type'],
                    'Conditional Use Permit - General',
                    '#38bdf8',
                    'Short-Term Rental Type 1',
                    '#fbbf24',
                    'Short-Term Rental Type 2',
                    '#fb7185',
                    '#ffffff'
                ],
                'text-halo-color': [
                    'match',
                    ['get', 'type'],
                    'Conditional Use Permit - General',
                    '#0369a1',
                    'Short-Term Rental Type 1',
                    '#a16207',
                    'Short-Term Rental Type 2',
                    '#be185d',
                    '#ffffff'
                ],
                'icon-opacity': 1,
                'text-halo-width': 1,
                'text-opacity': 1,
                'text-translate': [0, 10],
            }
        });
        map.current.on('click', 'clusters', function (e) {
            const features = map.current?.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            }) as GeoJSON.Feature<GeoJSON.Point>[];
            console.log(features[0])
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
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                        `<div class="flex flex-col">
                            <div class="flex flex-row justify-between">
                                <div class="text-lg font-bold">${date}</div>
                                <div class="text-lg font-bold">${type}</div>
                            </div>
                            <div class="text-sm">${address}</div>
                            <div class="text-sm">${status}</div>
                            <div class="text-sm"><a href="${link}" target="_blank">View Plan</a></div>
                        </div>`
                    )
                    .addTo(map.current as mapboxgl.Map);
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
        <>
            <div className="top-0 left-0 w-full h-full absolute" ref={mapContainer} />
            {/* {(markers.length > 0) &&
                < div className="bg-rose-500 text-white py-2 px-4 z-10 absolute top-0 left-0 m-2 rounded-xl">
                    Results: {markers.length}
                </div>
            } */}
        </>
    )
}

export default MapboxComponent