import React, { useEffect, useState } from 'react';
import '../styles/Dropdown.css';
import checkmark from '../static/checkmark.svg';

function DropdownMultiple(props) {
    let [selectedItems, setSelectedItems] = useState(new Set());
    let [expanded, setExpanded] = useState(false);
    let [placeholderVisible, setPlaceholderVisible] = useState(false);

    useEffect(() => {
        if (!(props.items instanceof Array)) {
            if ('placeholder' in props) {
                setPlaceholderVisible(true);
            }

            return;
        }
    }, [props.items]);

    useEffect(() => {
        if (!(props.selectedItems instanceof Array)) {
            return;
        }

        setSelectedItems(new Set(props.selectedItems));
    }, [props.selectedItems]);

    useEffect(() => {
        if (!('placeholder' in props)) {
            return;
        }

        setPlaceholderVisible(selectedItems.size == 0);
    }, [selectedItems]);


    function getLength() {
        return (props.items instanceof Array) ? props.items.length : 0;
    }

    function isItemSelected(index) {
        let item = props.items[index];

        return selectedItems.has(item);
    }

    function selectItem(index) {
        let item = props.items[index];

        if (selectedItems.add(item)) {
            setSelectedItems(new Set(selectedItems));

            if (typeof props.handleSelect === 'function') {
                props.handleSelect(item, [...selectedItems]);
            }
        }
    }

    function unselectItem(index) {
        let item = props.items[index];
        
        if (selectedItems.delete(item)) {
            setSelectedItems(new Set(selectedItems));

            if (typeof props.handleSelect === 'function') {
                props.handleUnselect(item, [...selectedItems]);
            }
        }
    }

    function toggleItemSelection(index) {
        if (isItemSelected(index)) {
            unselectItem(index);
        }
        else {
            selectItem(index);
        }
    }

    return (
        <div className={'dropdown multiple' + (expanded && getLength() ? ' expanded' : '')}>
            <div className="dropdown-container" onClick={() => setExpanded(!expanded && getLength())}>
                <div className={(placeholderVisible && !expanded) ? 'dropdown-content placeholder' : 'dropdown-content'}>
                    <span>{
                        (placeholderVisible && !expanded)
                            ? props.placeholder
                            : [...selectedItems].map((item) => item[props.textProperty]).join(', ')
                    }</span>
                </div>
                <button className="dropdown-button">&gt;</button>
            </div>
            { (expanded && props.items instanceof Array) ?
                <ul className="dropdown-list">
                    {props.items.map((item, i) => <li
                        key={i}
                        className="dropdown-list-item"
                        onClick={() => toggleItemSelection(i)}>
                            <div
                                className={'dropdown-checkbox' + (isItemSelected(i) ? ' selected' : '')}
                                style={{backgroundImage: `url(${checkmark})`}}></div>
                            <span>{
                                ('textProperty' in props)
                                    ? item[props.textProperty]
                                    : item
                            }</span>
                        </li>
                    )}
                </ul>
                : null
            }
        </div>
    );
}

export default DropdownMultiple;