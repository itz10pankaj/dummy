import { GoogleMap, Marker, LoadScript, Circle } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapComponent = ({ markers, userLocation, radius }) => {
  const validMarkers = markers.filter(
    (marker) => marker.latitude && marker.longitude && !isNaN(marker.latitude) && !isNaN(marker.longitude)
  );
  const mapCenter = validMarkers.length > 0
    ? { lat: Number(validMarkers[0].latitude), lng: Number(validMarkers[0].longitude) }
    : userLocation;

  // Debugging logs
  // console.log("User Location:", userLocation);
  // console.log("Valid Markers:", validMarkers);
  // console.log("Map Center:", mapCenter);

  if (validMarkers.length === 0) {
    return <p>No locations found within the selected radius.</p>;
  }
  return (
    <LoadScript googleMapsApiKey="AIzaSyB9geEkfo2TBKcgDw_OIuZgolqe_vibqPg">
      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={12}>
        {/* Circle to represent the filter radius */}
        <Circle
          center={userLocation}
          radius={radius * 1000}
          options={{
            fillColor: "rgba(0, 150, 255, 0.2)",
            strokeColor: "#0096FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
        {/* Display only filtered markers */}
        {markers.map((marker, index) => (
          <Marker key={index} position={{ lat: Number(marker.latitude), lng: Number(marker.longitude) }} label={marker.label} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
