import React from 'react';
import Dropdown from './Dropdown';
import '../styles/TrackReport.css';

function TrackReport() {
    return (
        <div className="track-report page">
            <div className="main">
                <div className="tile half">
                    <h2>Raport z kursu</h2>
                    <form className="report">
                        <Dropdown placeholder="Trasa" />
                        <Dropdown placeholder="Przystanek" />
                        <input placeholder="Liczba osób" />
                        <button className="submit">Zapis raport</button>
                    </form>
                </div>
            </div>
            
        </div>
    );
}

export default TrackReport;
