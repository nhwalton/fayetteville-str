import { faBed, faHouse, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, InfoWindow, MarkerClusterer, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
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

    let zoom = center.lat == 36.062579 && center.lng == -94.157426 ? 13 : 17

    const options = {
        imagePath:
            '/clusterer/m',
        minimumClusterSize: 5,
        averageCenter: true,
    }
    const [infoOpen, setInfoOpen] = useState<unknown | null>(null);
    const handleToggle = (id: string) => {
        setInfoOpen(id)
    }

    const renderMap = () => {
        return (
            <div className="rounded-xl overflow-hidden relative h-[400px] md:h-[800px]">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={useCenter}
                    zoom={zoom}
                    onClick={() => setInfoOpen(null)}
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
                                        let fillColor = "#c026d3"
                                        let strokeColor = "#c026d3"
                                        let icon = faLocationDot
                                        switch (marker.type) {
                                            case "Conditional Use Permit - General":
                                                fillColor = "#60a5fa"
                                                strokeColor = "#2563eb"
                                                icon = faLocationDot
                                                break;
                                            case "Short-Term Rental Type 1":
                                                fillColor = "#fbbf24"
                                                strokeColor = "#d97706"
                                                icon = faBed
                                                break;
                                            case "Short-Term Rental Type 2":
                                                fillColor = "#fb7185"
                                                strokeColor = "#e11d48"
                                                icon = faHouse
                                                break;
                                            default:
                                                break;
                                        }
                                        return (
                                            <MarkerF
                                                key={marker.id}
                                                position={{ lat: useLat, lng: useLng }}
                                                clusterer={clusterer}
                                                onClick={() => handleToggle(marker.id)}
                                                icon={{
                                                    path: icon.icon[4] as string,
                                                    fillColor: fillColor,
                                                    fillOpacity: 1,
                                                    anchor: new google.maps.Point(
                                                        icon.icon[0] / 2, // width
                                                        icon.icon[1] // height
                                                    ),
                                                    strokeWeight: 1,
                                                    strokeColor: strokeColor,
                                                    scale: 0.03,
                                                }}
                                            >
                                                {infoOpen === marker.id &&
                                                    <InfoWindow
                                                        position={{ lat: marker.lat, lng: marker.lng }}
                                                        onCloseClick={() => setInfoOpen(null)}
                                                    >
                                                        <div className="flex flex-col gap-2 text-slate-800">
                                                            <div className="grid grid-cols-[auto_1fr]">
                                                                <p className="col-span-2 font-medium mb-2">{marker.address}</p>
                                                                <p className="font-medium me-2">Permit Type:</p><p>{marker.type}</p>
                                                                <p className="font-medium me-2">Applied:</p><p>{marker.date}</p>
                                                                <p className="font-medium me-2">Status:</p><p>{marker.status}</p>
                                                                <p className="font-medium me-2">Permit Details:</p><a className="underline" href={marker.link} target="_blank" rel="noreferrer">Link</a>
                                                                <a className="me-2 font-normal text-[#1a73e8] hover:underline mt-1" href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(marker.address)}`} target="_blank" rel="noreferrer">View on Google Maps</a>
                                                            </div>
                                                        </div>
                                                    </InfoWindow>
                                                }
                                            </MarkerF>
                                        )
                                    }
                                })}
                            </>
                        )}
                    </MarkerClusterer>
                </GoogleMap>
            </div >
        )
    }

    return isLoaded ? renderMap() : <></>
}

export default GoogleMapComponent;