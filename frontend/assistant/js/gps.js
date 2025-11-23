// GPS and Map Handling

let map = null;
let userMarker = null;
let centerMarker = null;
let radiusCircle = null;
let userLocation = null;
let centerLocation = null;

/**
 * Initialize Leaflet map
 */
function initMap(centerLat, centerLng, radius) {
    centerLocation = { lat: centerLat, lng: centerLng };

    // Create map centered on the center location
    map = L.map('map').setView([centerLat, centerLng], 17);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add center marker (blue)
    centerMarker = L.marker([centerLat, centerLng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);
    centerMarker.bindPopup('<strong>Center Location</strong>').openPopup();

    // Draw radius circle (30m)
    radiusCircle = L.circle([centerLat, centerLng], {
        color: '#6366f1',
        fillColor: '#6366f1',
        fillOpacity: 0.2,
        radius: radius
    }).addTo(map);
}

/**
 * Update user location marker
 */
function updateUserMarker(lat, lng) {
    userLocation = { lat, lng };

    if (userMarker) {
        userMarker.setLatLng([lat, lng]);
    } else {
        userMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);
        userMarker.bindPopup('<strong>Your Location</strong>');
    }

    // Fit bounds to show both markers
    if (centerLocation) {
        const bounds = L.latLngBounds([
            [centerLocation.lat, centerLocation.lng],
            [lat, lng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Calculate distance using Haversine formula (client-side)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const toRad = (x) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Request user's GPS location
 */
function requestLocation(onSuccess, onError) {
    if (!navigator.geolocation) {
        onError('Geolocation is not supported by your browser');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            onSuccess(lat, lng);
        },
        (error) => {
            let message = 'Unable to get your location';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Location permission denied. Please enable GPS.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    message = 'Location request timed out.';
                    break;
            }
            onError(message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Make functions globally available
window.gps = {
    initMap,
    updateUserMarker,
    calculateDistance,
    requestLocation,
    getUserLocation: () => userLocation,
    getCenterLocation: () => centerLocation
};
