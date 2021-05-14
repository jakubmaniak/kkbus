import React from 'react';
import '../../styles/Timetable.css';

function TimetableFilterDays(props) {
    return (
    <div className="tile dark">
        <span>Nazwisko i profesja</span>
        {props.children}
    </div>
    );
}

export default TimetableFilterDays;
