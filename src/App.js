import "./App.css";
import React, { useState, useEffect } from "react";
import { downloadPDF } from "./services/pdfServices";
import scanIcon from "./assets/ubicacion.svg";
import rutasIcon from "./assets/rutas.svg";
import ciIcon from "./assets/identidad.svg";
import logoPinlet from "./assets/logo-pinlet.png";
import GoogleMapComponent from "./components/googleMaps/GoogleMaps.jsx";
import { obtenerDatos } from "./services/dataServices";
import { ImageModal } from "./components/imageModal/ImageModal.jsx";
import Form from "./components/inputs/GeneratorForm.jsx";
import imgLgarProvisional from "./assets/lugar.svg";

function App() {
  const [dataMarcacion, setDataMarcacion] = useState(null);
  const [dataLugar, setDataLugar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [parametros, setParametros] = useState("");
  const [parametrosArray, setParametrosArray] = useState([]);

  let tipoMarcacion = "";
  let iconTipo = "";

  const getParams = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id"); // extrae el parámetro "id"
    const type = params.get("type"); // extrae el parámetro "typ"
    return { id, type }; // devuelve un objeto con ambos parámetros
  };

  const { id, type } = getParams();

  if (type === "A") {
    iconTipo = scanIcon;
    tipoMarcacion = "Check In"
  } else if (type === "H") {
    tipoMarcacion = "Scan"
    iconTipo = ciIcon;
  } else {
    iconTipo = rutasIcon;
    tipoMarcacion = "Rutas"
  }

  //consulta a /getMarcacion_residenteLugar
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        console.log(type);
        const payload = {
          id_marcacion_residente: id,
          tipo: type,
        };
        const resultMarcacion = await obtenerDatos(
          "getMarcacion_residenteLugar",
          payload
        );
        setDataMarcacion(resultMarcacion);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // consulta a getLugar
  useEffect(() => {
    const fetchData = async () => {
      if (dataMarcacion && dataMarcacion.id_lugar) {
        try {
          const payload = {
            id_lugar: dataMarcacion?.id_lugar,
          };
          const resultLugar = await obtenerDatos("getLugar", payload);
          setDataLugar(resultLugar);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dataMarcacion]);

  useEffect(() => {
    if (dataMarcacion?.parametros) {
      setParametros(dataMarcacion.parametros);
    }
  }, [dataMarcacion]);

  useEffect(() => {
    if (parametros) {
      try {
        setParametrosArray(JSON.parse(parametros));
      } catch (error) {
        console.error("Error al parsear JSON de parámetros", error);
      }
    }
  }, [parametros]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar los datos...</p>;

  const imagenes = dataMarcacion?.imagenes || [];

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
            {dataLugar?.imagen ? (
              <img
                id="iconLugar"
                src={`/Lugar/${dataLugar.imagen}`}
                alt="Lugar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = imgLgarProvisional;
                }}
              />
            ) : (
              <img src={imgLgarProvisional} alt="Lugar"></img> // O puedes mostrar una imagen por defecto aquí
            )}
          </div>
          <div className="titulo">
            <h2>Reporte</h2>
            <h1>Ingreso de usuario</h1>
            <div className="tipo">
              <img src={iconTipo} alt="icono de scan}" />
              <h1>{tipoMarcacion}</h1>
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
                <p>{dataMarcacion?.nombres_residente}</p>
              </div>
              <div className="columna">
                <p>Apellidos:</p>
                <p>{dataMarcacion?.apellidos_residente}</p>
              </div>
              <div className="columna">
                <p>Cédula:</p>
                <p>{dataMarcacion?.cedula_residente}</p>
              </div>
              <div className="columna">
                <p>Celular:</p>
                <p>{dataMarcacion?.celular_residente}</p>
              </div>
              <div className="columna">
                <p>Correo:</p>
                <p>{dataMarcacion?.correo_residente}</p>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="data lugar">
              <h2 className="subtitulo">Lugar</h2>
              <div className="columna">
                <p>Nombre: </p>
                <p>{dataLugar?.nombre}</p>
              </div>
              <div className="columna">
                <p>Pais: </p>
                <p>{dataLugar?.pais}</p>
              </div>
              <div className="columna">
                <p>Ciudad: </p>
                <p>{dataLugar?.ciudad}</p>
              </div>
              <div className="columna">
                <p>Tipo:</p>
                <p>{dataLugar?.tipo}</p>
              </div>
            </div>
            <div className="data detalle">
              <h2 className="subtitulo">Detalles</h2>
              <div className="columna">
                <p>Fecha de marcación:</p>
                <p>{dataMarcacion.fecha_creacion}</p>
              </div>
              <div className="columna">
                <p>Tipo:</p>
                <p>{dataMarcacion?.tipo}</p>
              </div>
              <div className="columna">
                <p>Descripción:</p>
                <p>{dataMarcacion?.descripcion}</p>
              </div>
              <div className="columna">
                <p>Calificación:</p>
                <p>{dataMarcacion?.calificacion}</p>
              </div>
              <div className="columna">
                <p>Distancia:</p>
                <p>{dataMarcacion?.distancia}</p>
              </div>
              <div className="columna">
                <p>{`${dataLugar?.primario}:`}</p>
                <p>{dataMarcacion?.primario_residente}</p>
              </div>
              <div className="columna">
                <p>{`${dataLugar?.secundario}:`}</p>
                <p>{dataMarcacion?.secundario_residente}</p>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="data texto">
              <h2 className="subtitulo">Ubicación</h2>
              <div className="columna">
                <p>Dirección:</p>
                <p>{dataMarcacion?.direccion}</p>
              </div>
              <div className="columna">
                <p>Latitud:</p>
                <p>{dataMarcacion?.latitud}</p>
              </div>
              <div className="columna">
                <p>Longitud:</p>
                <p>{dataMarcacion?.longitud}</p>
              </div>
            </div>
            <div className="data ubicaion">
              <GoogleMapComponent
                latitud={dataMarcacion?.latitud}
                longitud={dataMarcacion?.longitud}
              />
            </div>
          </div>
          <div className="group">
            <div className="data formulario">
              <h2 className="subtitulo">formulario de marcación</h2>
              <Form parametros={parametrosArray} />
            </div>
          </div>

          <div className="imagenes">
            <h2>Imagenes</h2>
            <div className="containerImagenes">
              {!imagenes || imagenes.length === 0 ? (
                <p>No hay imágenes disponibles...</p>
              ) : (
                imagenes.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    onClick={() => openModal(url)}
                  />
                ))
              )}
            </div>
          </div>
          <div id="descargarPDF">
            <button id="btnDescargarPdf" onClick={downloadPDF}>
              DESCARGAR
            </button>
          </div>
        </div>
      </main>
      <ImageModal
        active={modalOpen}
        onClose={closeModal}
        imgSrc={currentImage}
      />
      <footer>© Pinlet. 2024</footer>
    </div>
  );
}

export default App;
