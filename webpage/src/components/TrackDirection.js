import React from 'react';
import '../styles/MainPage.css';

function TrackDirection(props) {
    return (
        <div className="direction">
            <span>{props.startingStop}</span>
            <span>-----&gt;</span>
            <span>{props.finalStop}</span>
        </div>
    )
}

export default TrackDirection;
