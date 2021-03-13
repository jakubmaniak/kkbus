import React from 'react';
import '../styles/WorkSchedule.css';
import WorkScheduleFilter from './WorkScheduleFilter';

function WorkSchedule() {
    let drivers = ['Tomasz Rajdowiec', 'Kazimierz Rajdowiec', 'Mirosław Szybki'];

    return (
        <div className="work-schedule-page">
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="row-container">
                        <WorkScheduleFilter label="Kierowca:">
                            <div className="list-item">{drivers[0]}</div>
                            {drivers.map((driver) => {
                                if(driver != drivers[0]) {
                                    return (
                                        <div className="list-item hidden">{driver}</div>
                                    );
                                }
                            })}
                        </WorkScheduleFilter>
                        <WorkScheduleFilter label="Trasy:"/>
                    </div>
                    <div className="row-container">
                        <WorkScheduleFilter label="Zakres dni:"/>
                        <WorkScheduleFilter label="Kierunki:"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkSchedule;
