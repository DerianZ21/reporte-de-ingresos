import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const mapId = process.env.REACT_APP_GOOGLE_MAPS_MAP_ID;
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


export const downloadPDF = () => {
    const input = document.getElementById('pdf-content');
    const button = document.getElementById('btnDescargarPdf');
    const mapContainer = document.getElementById('map-container');

    const sizeContentImgMap = document.getElementById('map-container');

    let containerMapHeight = sizeContentImgMap.offsetHeight;

    input.classList.add("pdf-capture-mode");
    document.body.classList.add("no-zoom");
    const scale = 1 / window.devicePixelRatio;
    
    button.style.display = 'none';
    const originalMapContent = mapContainer.innerHTML;

    const lat = "-2.054408";
    const lng = "-79.880856";
    const zoom = 15;

    const staticMapUrl = getStaticMapUrl(lat, lng, zoom, apiKey, 500, containerMapHeight);
   

    const img = new Image();
    img.src = staticMapUrl;
    img.alt = "Mapa estático de Google";

    mapContainer.innerHTML = ''; // Limpiar el contenido actual
    mapContainer.appendChild(img); // Insertar la imagen del mapa

    img.onload = () => {
        html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('Reporte-de-usuario.pdf');
            mapContainer.innerHTML = originalMapContent;
            //restaura funciones por default del body
            document.body.classList.remove("no-zoom");
            //reinicializa el componente de google maps
            initializeGoogleMap();
            //restaurar tamaño responsivo
            input.classList.remove("pdf-capture-mode");
            //restaura visibilidad de botón de descarga
            button.style.display = 'block';

        });
    };
    img.onerror = (error) => {
        console.error("Error al cargar la imagen del mapa:", error);
    };
}

const getStaticMapUrl = (lat, lng, zoom, apiKey, containerMapWidth, containerMapHeight) => {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${containerMapWidth}x${containerMapHeight}&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
    
};


const initializeGoogleMap = () => {
    const mapRef = document.getElementById('map-object');  // Referencia al mapa
    const latLng = { lat: -2.054408, lng: -79.880856 };
    const map = new window.google.maps.Map(mapRef, {
        center: latLng,
        mapId: mapId,
        streetViewControl: false, // Desactiva el muñequito amarillo de Street View
        mapTypeControl: false,
        zoom: 15,
    });

    new window.google.maps.marker.AdvancedMarkerElement({
        position: latLng,
        map,
        title: "Ubicación",
    });
};
