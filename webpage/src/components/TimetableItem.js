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
                {props.role === props.loggedUserRole && props.id === props.loggedUserId ? 
                        <div className="add">
                            <span>+</span>
                        </div> 
                    : 
                        <div className="dummy">
                            <span></span>
                        </div> 
                    }
            </div>
            {props.children}
        </div>
    )
}

export default TimetableItem
