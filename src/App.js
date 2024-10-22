import "./App.css";
import React, { useState, useEffect } from "react";
import { downloadPDF } from "./services/pdfServices";
import scanIcon from "./assets/ubicacion.svg";
import rutasIcon from "./assets/rutas.svg";
import ciIcon from "./assets/identidad.svg";
import logoPinlet from "./assets/logo-pinlet.png";
import GoogleMapComponent from "./components/googleMaps";
import { obtenerDatos, getData, setData } from "./services/dataServices";
import { ImageModal } from "./components/imageModal";

function App() {
  const [data, setDataState] = useState(null);
  const [loading, setLoading] = useState([true]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  let tipoMarcacion = "checkIn";
  let iconTipo = "";

  const iconLugar = "/Lugar/143-iKoCt.webp"; //imagen de prueba de lugar

  if (tipoMarcacion === "scan") {
    iconTipo = scanIcon;
  } else if (tipoMarcacion === "checkIn") {
    iconTipo = ciIcon;
  } else {
    iconTipo = rutasIcon;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          id_marcacion_residente: "256",
          tipo: "H",
        };
        const result = await obtenerDatos(
          "getMarcacion_residenteLugar",
          payload
        );
        setDataState(result);
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const datosGlobales = getData(); // Obtener los datos de la variable global
    if (datosGlobales) {
      setDataState(datosGlobales); // Actualizar el estado si ya existen datos globales
    }
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar los datos...</p>;

  const imagenes = data?.imagenes || [];

  const openModal = (imgSrc) => {
    setCurrentImage(imgSrc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div id="pdf-content" className="App">
      <header>
        <div className="containerHeader">
          <div className="imgIcon lugar">
            <img id="iconLugar" src={iconLugar} alt="Lugar"></img>
          </div>
          <div className="titulo">
            <h2>Reporte</h2>
            <h1>Ingreso de usuario</h1>
            <hr></hr>
            <div className="tipo">
              <img src={iconTipo} alt="icono de scan}" />
              <h1>Scan</h1>
            </div>
          </div>
          <div className="imgIcon branding">
            <img id="iconPinlet" src={logoPinlet} alt="logo"></img>
          </div>
        </div>
      </header>
      <main>
        <div className="content">
          <div className="group">
            <div className="data usuario">
              <h2 className="subtitulo">Usuario</h2>
              <div className="columna">
                <p>Nombres:</p>
                <p>{data?.nombres_residente}</p>
              </div>
              <div className="columna">
                <p>Apellidos:</p>
                <p>{data?.apellidos_residente}</p>
              </div>
              <div className="columna">
                <p>Cédula:</p>
                <p>{data?.cedula_residente}</p>
              </div>
              <div className="columna">
                <p>Celular:</p>
                <p>{data?.celular_residente}</p>
              </div>
              <div className="columna">
                <p>Correo:</p>
                <p>{data?.correo_residente}</p>
              </div>
              <div className="columna">
                <p>Primario:</p>
                <p>{data?.primario_residente}</p>
              </div>
              <div className="columna">
                <p>Secundario:</p>
                <p>{data?.secundario_residente}</p>
              </div>
            </div>
            <div className="data fija">
              <h2 className="subtitulo">Información</h2>
              <div className="columna">
                <p>Fecha creación:</p>
                <p>{data.fecha_creacion}</p>
              </div>
              <div className="columna">
                <p>Tipo:</p>
                <p>{data?.fecha_creacion}</p>
              </div>
              <div className="columna">
                <p>Lugar:</p>
                <p>{data?.fecha_creacion}</p>
              </div>
              <div className="columna">
                <p>Descripción:</p>
                <p>{data?.descripcion}</p>
              </div>
              <div className="columna">
                <p>Clasificación:</p>
                <p>{data?.calificacion}</p>
              </div>
              <div className="columna">
                <p>Distancia:</p>
                <p>{data?.distancia}</p>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="data texto">
              <h2 className="subtitulo">Ubicación</h2>
              <div className="columna">
                <p>Dirección:</p>
                <p>{data?.direccion}</p>
              </div>
              <div className="columna">
                <p>Latitud::</p>
                <p>{data?.latitud}</p>
              </div>
              <div className="columna">
                <p>Longitud:</p>
                <p>{data?.longitud}</p>
              </div>
            </div>
            <div className="data ubicaion">
              <GoogleMapComponent />
            </div>
          </div>
          <div className="imagenes">
            <h2>Imagenes</h2>
            <div className="containerImagenes">
              {imagenes.map((url, index) => (
                <img key={index} src={url} alt={`Imagen ${index + 1}`}  onClick={() => openModal(url)} />
              ))}
            </div>
          </div>
          <div id="descargarPDF">
            <button id="btnDescargarPdf" onClick={downloadPDF}>
              DESCARGAR
            </button>
          </div>
        </div>
      </main>
      <ImageModal active={modalOpen} onClose={closeModal} imgSrc={currentImage} />
      <footer>© Pinlet. 2024</footer>
    </div>
  );
}

export default App;
