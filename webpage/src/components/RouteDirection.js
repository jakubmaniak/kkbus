import React from 'react';
import '../styles/RoutesPage.css';

function RouteDirection(props) {
    return (
        <div className="direction">
            <span>{props.departureLocation}</span>
            <span>-----&gt;</span>
            <span>{props.arrivalLocation}</span>
        </div>
    )
}

export default RouteDirection;
