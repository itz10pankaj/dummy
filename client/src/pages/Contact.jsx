import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MapComponent from "../components/MapComponent";

import Chat from "../components/Chat";
import { getLocations } from "../services/apiServices";


const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const Contact = ({ initialUser }) => {
    const user = useSelector((state) => state.auth.user);
    const [radius, setRadius] = useState(5);
    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const [locations, setLocations] = useState([]);

    let RoleAdmin = initialUser?.role === "admin" ? true : false;
    useEffect(() => {
        const fetchLoactions = async () => {
            const locationsData = await getLocations();
            // console.log("Locations Data:", locationsData);
            setLocations(locationsData);
            // console.log("Locations:", locations);
        };

        fetchLoactions();
    }, []);
    useEffect(() => {
        if (!user?.latitude || !user?.longitude) return; // Check if user exists

        const newMarkers = locations.filter((marker) => {
            const distance = getDistance(user.latitude, user.longitude, marker.latitude, marker.longitude);
            return distance <= radius;
            // return true;
        });

        setFilteredMarkers(newMarkers);
    }, [radius, user, locations]);

    // Default location if user location is not available
    const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Example: New Delhi
    const userLocation = user?.latitude && user?.longitude
        ? { lat: Number(user.latitude), lng: Number(user.longitude) }
        : defaultLocation;

    return (
        <div>
            <div className="w-full flex flex-col md:flex-row gap-8 p-8 items-start justify-between">
                {/* Left - About Company */}
                <div className="md:w-1/2">

                    <h2 className="text-2xl font-bold mb-4">About Our Company</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Welcome to our company! We are committed to delivering top-notch tech solutions and innovative products.
                    </p>
                    <div className="mt-4">
                        <label className="font-bold mr-2">Filter by Radius:</label>
                        <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="border p-2 rounded">
                            <option value={2}>2 km</option>
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                        </select>
                    </div>

                    {/* Display Filtered Locations */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Filtered Locations:</h3>
                        {filteredMarkers.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {filteredMarkers.map((marker, index) => (
                                    <li key={index}>{marker.label}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No locations found within the selected radius.</p>
                        )}
                    </div>

                    {/* Right - Google Map and Filtered Locations */}

                </div>
                <div className="md:w-1/2">
                    <h2 className="text-2xl font-bold mb-4">Get Directions</h2>
                    <MapComponent userLocation={userLocation} markers={filteredMarkers} radius={radius} />
                </div>
            </div>
            <div className=" p-8 flex flex-col  ">
                <div>
                    <Chat initialUser={initialUser} isAdmin={RoleAdmin} />
                </div>
            </div>
        </div>
    );
};

export default Contact;
