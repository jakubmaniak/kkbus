import React, {useState} from 'react';
import '../styles/MainPage.css';

function TrackHours() {
    let [hours, setHours] = useState([]);


    return (
        <div className="hours">
        <div>5:15</div>
        <div>6:00</div>
        <div>6:30</div>
        <div>7:00</div>
        <div>8:00</div>
        <div>9:00</div>
        <div>11:00</div>
        <div>12:00</div>
        <div>12:30</div>
        <div>13:30</div>
        <div>14:00</div>
        <div>14:30</div>
        <div className="booked">15:30</div>
        <div>16:00</div>
        <div>17:00</div>
        <div>18:00</div>
        <div>20:00</div>
        <div className="booked">21:00</div>
        <div>22:30</div>
        <div>23:00</div>
        <div className="dummy"></div>
    </div>
    )
}

export default TrackHours;
