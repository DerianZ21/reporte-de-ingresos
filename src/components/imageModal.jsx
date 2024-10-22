export const ImageModal = ({ active, onClose, imgSrc }) => {
    if (!active) {
        return null;
    }

    return (
        <div className="modalOverlay" onclick={onclose}>
            <div className="modalContent">
                <img src={imgSrc} alt="Imagen en pantalla grande"/>
            </div>
        </div>
    )
}