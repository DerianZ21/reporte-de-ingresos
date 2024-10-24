import './imageModal.css'
import React, {useEffect} from 'react';

export const ImageModal = ({ active, onClose, imgSrc }) => {

    const handleOverlayClick = (e) => {
        // Si el usuario hace clic en el overlay (no en la imagen), se cierra el modal
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const disableScroll = () => {
        document.body.style.overflow = 'hidden';
    }
    
    const enableScroll = () => {
        document.body.style.overflow = 'auto';
    }

    useEffect(() => {
        if (active) {
            disableScroll();
        } else {
            enableScroll();
        }

        // Limpiar el efecto cuando se cierra el modal
        return () => enableScroll();
    }, [active]);

    if (!active) {
        return null;
    }

    return (
        <div className="modalOverlay" onClick={handleOverlayClick}>
            <div className="modalContent">
                <img src={imgSrc} alt="Imagen en pantalla grande" />
            </div>
        </div>
    );
}