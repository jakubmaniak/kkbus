import React from 'react';
import '../styles/Modal.css';

function Modal(props) {

    if (!props.visible) {
        return null;
    }

    return (
        <div className="overlay">
            <div className="modal">{props.children}</div>
        </div>
    );
}

export default Modal;