import React from 'react';
import Dropdown from './Dropdown';
import '../styles/Timetable.css';
import TimetableFilterDays from './TimetableFilterDays';

let filterDays = ['sb, 03.04', 'nd, 04.04', 'p, 505.04', 'wt, 06.04', 'śr, 07.04', 'cz, 08.04', 'pt, 09.04'];

function Timetable() {
    return (
        <div className="timetable page">
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="filters">
                        <div className="filter-container">
                            <span>Profesja:</span>
                            <Dropdown placeholder="kierowca, sekretariat"/>
                        </div>
                        <div className="filter-container">
                            <span>Zakres:</span>
                            <Dropdown placeholder="3.04-9.04"/>
                        </div>
                    </div>
                </div>
               <TimetableFilterDays 
                    children={filterDays.map((filterDay, i) => {
                        return (
                            <span key={i}>{filterDay}</span>
                        )
                    })}
               />
            </div>
        </div>
    );
}

export default Timetable;
