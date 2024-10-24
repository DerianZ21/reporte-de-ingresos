import React from 'react';
import './generatorForm.css'
import SwitchToggle from '../switch/Switch';
import fileIcon from '../../assets/fileIcon.svg'
import linkIcon from '../../assets/linkIcon.svg'
const Form = ({ parametros }) => {

    if (!parametros || parametros === "") {
        return null
    }

    return (
        <div className='containerInputs'>
            {parametros.map((parametro) => {
                const { id_parametro, nombre, tipo_control, tipo_ingreso, titulo, data } = parametro;

                switch (tipo_ingreso) {

                    case 'E': // Email
                    case 'N': // Numérico
                    case 'T': // Texto
                    case 'L': // Lista
                    case 'R': // Radio
                    case 'F': // Fecha
                    case 'D': // Detalle
                    case 'RF': // Rango Fecha
                        return (
                            <div className='form-component input' key={id_parametro}>
                                <label>{titulo}</label>
                                <input disabled
                                    type={
                                        tipo_ingreso === 'E' ? 'email' : // Si es tipo 'E' (Email), será de tipo 'email'
                                            tipo_ingreso === 'N' ? 'number' : // Si es tipo 'N' (Numérico), será de tipo 'number'
                                                tipo_ingreso === 'T' ? 'text' : // Si es tipo 'T' (Texto), será de tipo 'text'
                                                    'text' // Valor por defecto, por si acaso
                                    }
                                    id={`${tipo_ingreso}_${id_parametro}`}
                                    defaultValue={data[0]}
                                />
                            </div>
                        );

                    case 'LN': // Enlace
                    case 'A': // Archivo
                        return (
                            <div className='form-component input' key={id_parametro}>
                                <label>{titulo}</label>

                                <a

                                    href={data[0]}
                                    target={tipo_ingreso === 'LN' ? "_blank" : undefined}
                                    download={tipo_ingreso === 'A'}
                                    id={`enlace_archivo_${id_parametro}`}
                                >
                                    <img
                                        src={tipo_ingreso === 'LN' ? linkIcon : fileIcon} // Cambia la imagen según el tipo de dato
                                        alt={tipo_ingreso === 'LN' ? 'Enlace' : 'Archivo'}
                                        style={{ width: '20px', marginRight: '10px' }} // Ajusta el tamaño de la imagen
                                    />
                                    <hr />
                                    <p>{data[0]}</p>

                                </a>
                            </div>
                        );

                    case 'G': // Toggle (Switch or checkbox)
                        return (
                            <div key={id_parametro}>
                                <SwitchToggle
                                    id={`toggle_${id_parametro}`}
                                    label={titulo}
                                    checked={data[0]}
                                    onChange={() => { }}
                                />
                            </div>
                        );

                    case 'C': // Toggle (Switch or checkbox)
                        return (
                            <div className='form-component input' key={id_parametro}>
                                <label>{titulo}</label>
                                <div className='cbContainer'>
                                    {data[0].split('-').map((value, index) => (
                                        <div key={index}>
                                            <div className='cbElement'
                                                disabled
                                                type='text'
                                                id={`checkbox_${id_parametro}_${index}`}
                                            >{value}|
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default Form;

