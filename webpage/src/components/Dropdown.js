import React, { useEffect, useState } from 'react';
import '../styles/Dropdown.css';

function Dropdown(props) {
    let [selectedItem, setSelectedItem] = useState('');
    let [expanded, setExpanded] = useState(false);
    let [placeholderVisible, setPlaceholderVisible] = useState(false);

    useEffect(() => {
        if (!(props.items instanceof Array)) {
            setPlaceholderVisible(true);
            return;
        }

        let alwaysSelected = (props.alwaysSelected === true) || (
            typeof props.alwaysSelected === 'string' && props.alwaysSelected.toLowerCase() === 'true'
        );

        if (alwaysSelected) {
            selectItem(0);
        }
        else if ('placeholder' in props) {
            setPlaceholderVisible(true);
        }
    }, [props.items]);

    function getLength() {
        return (props.items instanceof Array) ? props.items.length : 0;
    }

    function selectItem(index) {
        let item = props.items[index];

        setPlaceholderVisible(false);
        setSelectedItem(item);
        setExpanded(false);
        
        if (typeof props.handleChange === 'function')
            props.handleChange(item);
    }

    function getItemText(item) {
        if ('textFormatter' in props) {
            return props.textFormatter(item);
        }
        if ('textProperty' in props && typeof selectedItem === 'object') {
            return item[props.textProperty];
        }
        if (typeof item !== 'object' && typeof item !== 'function') {
            return item;
        }
        
        return null;
    }

    return (
        <div className={(expanded && getLength()) ? 'dropdown expanded' : 'dropdown'}>
            <div className="dropdown-container" onClick={() => setExpanded(!expanded && getLength())}>
                <div className={placeholderVisible ? 'dropdown-content placeholder' : 'dropdown-content'}>{
                    placeholderVisible ? props.placeholder : getItemText(selectedItem)
                }</div>
                <button className="dropdown-button">&gt;</button>
            </div>
            { (expanded && props.items instanceof Array) ?
                <div className="dropdown-list">
                    {props.items.map((item, i) => <div
                        key={i}
                        className="dropdown-list-item"
                        onClick={() => selectItem(i)}>{getItemText(item)}</div>
                    )}
                </div>
                : null
            }
        </div>
    );
}

export default Dropdown;