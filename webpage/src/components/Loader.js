import React from 'react';
import '../styles/Loader.css';

function Loader(props) {
    return (!('loading' in props) || props.loading === true || props.loading === 'true')
        ?
            <div className="loaders-container">
                <div className="loader">
                    <div className="inside-loader"></div>
                </div>
                <div className="loader">
                    <div className="inside-loader"></div>
                </div>
            </div>
        : null;
}

export function ModalLoader(props) {
    return (!('loading' in props) || props.loading === true || props.loading === 'true')
        ?
            <div className="modal-loader">
                <Loader />
            </div>
        : null;
}

export default Loader;