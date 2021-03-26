import React from 'react';
import '../styles/MainPage.css';

function TrackDirection(props) {
    return (
        <div className="direction">
            <span>{props.departureLocation}</span>
            <span>-----&gt;</span>
            <span>{props.arrivalLocation}</span>
        </div>
    )
}

export default TrackDirection;
