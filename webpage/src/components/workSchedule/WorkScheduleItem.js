import React from 'react';
import '../../styles/WorkSchedule.css';

function WorkScheduleItem(props) {
    return (
        <div className="tile half">
            <div className="header-wrapper">
                <div className="direction">
                    <span>{props.start}</span>
                    <span>-----&gt;</span>
                    <span>{props.end}</span>
                </div>
                <p className="date">{props.day}, {props.hour}</p>
            </div>
            <div className="vehicle-data">
                <span>Pojazd</span>
                <span>{props.vehicle}</span>
            </div>
            <div className="vehicle-data">
                <span>Parking</span>
                <span>
                    <span className="parking">{props.parking}</span>    
                    <span className="parking-info">{props.parkingInfo}</span>
                </span>
            </div>
        </div>
    );
}

export default WorkScheduleItem;