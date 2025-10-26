import React, { useEffect, useRef, useState } from 'react';
import { busService } from '../services/busService';
import { CITY_LAT_LNG } from '../constants';
import { City } from '../types';

// Fix: Add google to window type to avoid TypeScript errors
declare global {
  interface Window {
    google: any;
  }
}

interface RouteMapProps {
    busId: string;
    source: City;
    destination: City;
}

const RouteMap: React.FC<RouteMapProps> = ({ busId, source, destination }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const route = busService.getRouteForBus(busId);
        if (!route) {
            setError("Route data not found.");
            setIsLoading(false);
            return;
        }

        const sourceIndex = route.stops.indexOf(source);
        const destIndex = route.stops.indexOf(destination);

        const initMap = async () => {
            try {
                await (window as any).googleMapsApiLoaded;
                if (!mapRef.current) return;

                const map = new window.google.maps.Map(mapRef.current, {
                    center: CITY_LAT_LNG[source],
                    zoom: 6,
                    disableDefaultUI: true,
                    zoomControl: true,
                });
                
                const directionsService = new window.google.maps.DirectionsService();
                
                const waypoints = route.stops
                    .slice(sourceIndex + 1, destIndex)
                    .map(stop => ({
                        location: CITY_LAT_LNG[stop],
                        stopover: true,
                    }));

                // Fix: Removed explicit type annotation to resolve namespace error.
                // The type will be inferred, and functionality remains the same.
                const request = {
                    origin: CITY_LAT_LNG[source],
                    destination: CITY_LAT_LNG[destination],
                    waypoints,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                };
                
                directionsService.route(request, (result, status) => {
                    if (status === 'OK' && result) {
                        const polyline = new window.google.maps.Polyline({
                            path: result.routes[0].overview_path,
                            strokeColor: '#2563eb', // Blue
                            strokeOpacity: 0.8,
                            strokeWeight: 6,
                        });
                        polyline.setMap(map);

                        // Fit map to bounds of the polyline
                        const bounds = new window.google.maps.LatLngBounds();
                        result.routes[0].overview_path.forEach(latlng => bounds.extend(latlng));
                        map.fitBounds(bounds);

                    } else {
                        console.error(`Directions request failed due to ${status}`);
                        setError(`Could not calculate route. Status: ${status}`);
                    }
                });

                // Add markers for all stops
                route.stops.forEach((stop, index) => {
                    let iconUrl: string;
                    if (stop === source || stop === destination) {
                        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'; // User's journey start/end
                    } else if (index > sourceIndex && index < destIndex) {
                        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'; // Intermediate stops in user's journey
                    } else {
                        iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'; // Other stops on the route
                    }

                    new window.google.maps.Marker({
                        position: CITY_LAT_LNG[stop],
                        map: map,
                        title: stop,
                        icon: {
                            url: iconUrl,
                        },
                    });
                });


                setIsLoading(false);
            } catch (err) {
                console.error("Error loading Google Maps:", err);
                setError("Failed to load Google Maps. Please check your API key and network connection.");
                setIsLoading(false);
            }
        };

        initMap();

    }, [busId, source, destination]);

    if (isLoading) {
        return (
            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-700 font-semibold">Loading Route Map...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
         return <div className="absolute inset-0 bg-red-50 flex items-center justify-center p-4"><p className="text-red-600 text-center">{error}</p></div>;
    }

    return <div ref={mapRef} className="w-full h-full" />;
};

export default RouteMap;