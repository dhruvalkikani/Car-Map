import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import carData from './locations.json';  // Import the Car Data
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Hook to change map center (only triggered once when user location is fetched)
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]); // Only recenter when 'center' changes (user location update)
  return null;
};

const CarMap = () => {
  const [userLocation, setUserLocation] = useState(null); // Initialize with null
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [mapCenter, setMapCenter] = useState(null); // Map center

  useEffect(() => {
    // Load car data from JSON file
    const carsFromData = carData.placemarks;
    setCars(carsFromData);

    // Set the map center to the first car's coordinates initially
    if (carsFromData.length > 0) {
      const firstCarCoordinates = [carsFromData[0].coordinates[1], carsFromData[0].coordinates[0]];
      setMapCenter(firstCarCoordinates);
    }

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userCoords);
        setMapCenter(userCoords); // Update center to user's location
      },
      (error) => {
        console.error("Error fetching location:", error);
      }
    );
  }, []);

  // Custom marker icon for user location
  const userIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64421.png', // User icon URL
    iconSize: [30, 30],
  });

  // Custom marker icon for cars
  const carIcon = L.icon({
    iconUrl: 'https://img.icons8.com/?size=100&id=12684&format=png&color=000000', // Custom car icon URL
    iconSize: [30, 30],
  });

  return (
    <div style={{ height: '500px' }}>
      {mapCenter && (
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Recenter the map only when user location is fetched */}
          {userLocation && <RecenterMap center={userLocation} />}

          {/* User Location Marker (only show if available) */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {/* Car Markers */}
          {cars.map((car, index) => {
            // Show all cars if no car is selected, or show only the selected car
            if (selectedCar === null || selectedCar === car.vin) {
              return (
                <Marker
                  key={index}
                  position={[car.coordinates[1], car.coordinates[0]]}
                  icon={carIcon}
                  eventHandlers={{
                    click: () => {
                      // Toggle selected car when clicked
                      setSelectedCar(selectedCar === car.vin ? null : car.vin);
                    },
                  }}
                >
                  {/* Popup with car details */}
                  <Popup>
                    <div>
                      <h4>{car.name}</h4>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      )}
    </div>
  );
};

export default CarMap;
