import Switch from 'react-switch';
import './switch.css'


const SwitchToggle = ({ id, checked, onChange, label }) => {
    
    let booleanChecked = false;

    if(checked === "true"){
        booleanChecked = true;
    }
    return (
        <div className="switch-container">
            <label htmlFor={id}>{label}</label>
            <Switch
                id={id}
                onChange={onChange}
                checked={booleanChecked}
                offColor="#888"
                onColor="#4caf50"
                uncheckedIcon={false}
                checkedIcon={false}
            />
        </div>
    );
};

export default SwitchToggle;