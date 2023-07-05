import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@headlessui/react";
import { GoogleMap, MarkerClusterer, useLoadScript, MarkerF, InfoWindow } from "@react-google-maps/api";
import { use, useEffect, useState } from "react";
import { Plan } from "~/types/plan";

const GoogleMapComponent: React.FC<{ markers: Plan[], center: google.maps.LatLngLiteral }> = ({ markers, center }) => {

    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey
    });

    const containerStyle = {
        width: '100%',
        height: '800px'
    };

    const useCenter: google.maps.LatLngLiteral = center ? center : {
        lat: 36.062579,
        lng: -94.157426
    }

    const zoom = center.lat == 36.062579 && center.lng == -94.157426 ? 13 : 17

    const options = {
        imagePath:
            '/clusterer/m',
    }

    const renderMap = () => {
        return (
            <div className="rounded-xl overflow-hidden relative">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={useCenter}
                    zoom={zoom}
                >
                    <MarkerClusterer
                        options={options}
                    >
                        {clusterer => (
                            <>
                                {markers.map(marker => {
                                    if (marker.lat && marker.lng && typeof marker.lat == 'number' && typeof marker.lng == 'number') {
                                        const useLat = marker.type === "Conditional Use Permit - General" ? marker.lat + 0.000025 : marker.lat - 0.000025
                                        const useLng = marker.type === "Conditional Use Permit - General" ? marker.lng + 0.000025 : marker.lng - 0.000025
                                        return (
                                            <MarkerF
                                                key={marker.id}
                                                position={{ lat: useLat, lng: useLng }}
                                                clusterer={clusterer}
                                                icon={{
                                                    path: faLocationDot.icon[4] as string,
                                                    fillColor: marker.type == "Conditional Use Permit - General" ? "#c026d3" : "#e11d48",
                                                    fillOpacity: 1,
                                                    anchor: new google.maps.Point(
                                                        faLocationDot.icon[0] / 2, // width
                                                        faLocationDot.icon[1] // height
                                                    ),
                                                    strokeWeight: 1,
                                                    strokeColor: "#ffffff",
                                                    scale: 0.05,
                                                }}
                                            />
                                        )
                                    }
                                })}
                            </>
                        )}
                    </MarkerClusterer>
                </GoogleMap>
            </div>
        )
    }

    return isLoaded ? renderMap() : <></>
}

export default GoogleMapComponent;