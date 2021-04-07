import React, { useEffect, useState } from 'react';
import '../styles/Timetable.css';
import * as api from '../api';

function TimetableItem(props) {
    let [user, setUser] = useState({});

    useEffect(() => {
        api.getUserInfo()
        .then((result) => {
            setUser(result);
        })
        .catch((err) => {
            throw err;
        });
    }, [])

    return (
        <div className="tile">
            <div className="name-proffesion-container">
                <div className="name-proffesion">
                    <p>{props.name}</p>
                    <span className="proffesion">{props.role}</span>
                </div>
                {props.id === user.id || user.role === 'owner' ? 
                        <div className="add" onClick={() => {props.onSelected(); props.addAvailability();}}>
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
