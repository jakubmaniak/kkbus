import React, { useEffect, useState } from 'react';
import '../styles/Dropdown.css';

function Dropdown(props) {
    let [selectedItem, setSelectedItem] = useState('');
    let [expanded, setExpanded] = useState(false);
    let [placeholderVisible, setPlaceholderVisible] = useState(false);

    useEffect(() => {
        if (!(props.items instanceof Array)) {
            setPlaceholderVisible(true);
            setSelectedItem(props.placeholder);

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
            setSelectedItem(props.placeholder);
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

    return (
        <div className={(expanded && getLength()) ? 'dropdown expanded' : 'dropdown'}>
            <div className="dropdown-container" onClick={() => setExpanded(!expanded && getLength())}>
                <div className={placeholderVisible ? 'dropdown-content placeholder' : 'dropdown-content'}>{
                    ('textProperty' in props && typeof selectedItem === 'object')
                        ? selectedItem[props.textProperty]
                        : selectedItem
                }</div>
                <button className="dropdown-button">&gt;</button>
            </div>
            { (expanded && props.items instanceof Array) ?
                <div className="dropdown-list">
                    {props.items.map((item, i) => <div
                        key={i}
                        className="dropdown-list-item"
                        onClick={() => selectItem(i)}>{
                            ('textProperty' in props)
                                ? item[props.textProperty]
                                : item
                        }</div>
                    )}
                </div>
                : null
            }
        </div>
    );
}

export default Dropdown;