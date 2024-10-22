import React, { useEffect, useRef } from "react";
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapId = process.env.REACT_APP_GOOGLE_MAPS_MAP_ID;

const GoogleMapComponent = () => {

    const mapRef = useRef(null);

    useEffect(() => {

        const loadMap = () => {
            const google = window.google;
            const map = new google.maps.Map(mapRef.current, {
                center: { lat: -2.054408, lng: -79.880856 }, // Ubicación inicial (céntrala según tus necesidades)
                zoom: 15, // Nivel de zoom
                mapId: mapId,
                streetViewControl: false, // Desactiva el muñequito amarillo de Street View
                mapTypeControl: false,    // Desactiva el control de tipo de mapa (satélite, etc.)
                fullscreenControl: true,
            });

            // Marcador opcional
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: -2.054408, lng: -79.880856 },
                map: map,
                title: "Ubicación",
            });
        };

        // Cargar el script de Google Maps
        if (!window.google) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=marker&v=weekly&loading=async`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            window.initMap = loadMap
        } else {
            loadMap();
        }

        return () => {
            // Limpiar el callback del mapa cuando el componente se desmonte
            window.initMap = undefined;
        };
    }, [apiKey]);

    return (
        <div style={{ justifyItems: "center" }}>
            <h2 style={{ textAlign: "center", marginTop: "0" }}>Mapa</h2>
            <div className="map-container" id="map-container" style={{ maxWidth: "600px", width: "100%", height: "400px" }}>
                <div id="map-object" ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "15px" }} />
            </div>
        </div>
    );
};

export default GoogleMapComponent;