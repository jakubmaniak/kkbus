import React from 'react';
import '../styles/Timetable.css';

function TimetableItem(props) {
    return (
        <div className="tile">
            <div className="name-proffesion-container">
                <div className="name-proffesion">
                    <p>{props.name}</p>
                    <span className="proffesion">{props.role}</span>
                </div>
                {props.id === props.loggedUserId ? 
                        <div className="add" onClick={props.addAvailability}>
                            <span>+</span>
                            
                        </div> 
                    : 
                        <div className="dummy"></div> 
                    }
            </div>
            {props.children}
        </div>
    )
}

export default TimetableItem
