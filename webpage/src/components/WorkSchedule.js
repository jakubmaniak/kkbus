import React, { useState } from 'react';
import '../styles/WorkSchedule.css';
import Dropdown from './Dropdown';
import WorkScheduleItem from './WorkScheduleItem';

function WorkSchedule() {
    let [drivers, setDrivers] = useState(['Tomasz Rajdowiec', 'Kazimierz Rajdowiec', 'Mirosław Szybki']);
    let ranges = ['dzisiaj', 'jutro', '7 kolejnych dni', 'ten miesiąc'];
    let courses = ['Kraków - Katowice'];
    let directions = ['obydwa', 'A -> B', 'B -> A'];

    let [results, setResults] = useState([]);

    let data = [
        {
            start: 'Kraków',
            end: 'Katowice',
            day: 'dzisiaj',
            hour: '13:30',
            vehicle: 'Mercedes Sprinter (KR 193PK)',
            parking: 'Kraków, parking Czyżyny, ',
            parkingInfo: 'początkowy'
        },
        {
            start: 'Katowice',
            end: 'Kraków',
            day: 'dzisiaj',
            hour: '15:15',
            vehicle: 'Mercedes Sprinter (KR 193PK)',
            parking: '-',
            parkingInfo: ''
        },
        {
            start: 'Kraków',
            end: 'Katowice',
            day: 'dzisiaj',
            hour: '17:00',
            vehicle: 'Mercedes Sprinter (KR 193PK)',
            parking: '-',
            parkingInfo: ''
        },
        {
            start: 'Katowice',
            end: 'Kraków',
            day: 'dzisiaj',
            hour: '18:45',
            vehicle: 'Mercedes Sprinter (KR 193PK)',
            parking: '-',
            parkingInfo: ''
        },
        {
            start: 'Kraków',
            end: 'Katowice',
            day: 'dzisiaj',
            hour: '20:30',
            vehicle: 'Mercedes Sprinter (KR 193PK)',
            parking: '-',
            parkingInfo: ''
        },
        {
            start: 'Katowice',
            end: 'Kraków',
            day: 'dzisiaj',
            hour: '22:15',
            vehicle: 'Mercedes Sprinter (KR 193PK)',
            parking: 'Kraków, parking Czyżyny, ',
            parkingInfo: 'końcowy'
        }
    ];

    function handleDriverChange(driver) {
        setResults(data);
    }

    return (
        <div className="work-schedule-page">
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="row-container">
                        <div className="filter-container">
                            <span>Kierowca:</span>
                            <Dropdown
                                items={drivers}
                                placeholder="Wybierz kierowcę"
                                handleChange={handleDriverChange} />
                        </div>
                        <div className="filter-container">
                            <span>Trasy:</span>
                            <Dropdown
                                items={courses} alwaysSelected />
                        </div>
                    </div>
                    <div className="row-container">
                        <div className="filter-container">
                            <span>Zakres dni:</span>
                            <Dropdown
                                items={ranges} alwaysSelected />
                        </div>
                        <div className="filter-container">
                            <span>Kierunki:</span>
                            <Dropdown
                                items={directions} alwaysSelected />
                        </div>
                    </div>
                </div>
                {results.map((element, i) => {
                    return (
                        <WorkScheduleItem 
                            key={i}
                            start={element.start}
                            end={element.end}
                            day={element.day}
                            hour={element.hour}
                            vehicle={element.vehicle}
                            parking={element.parking}
                            parkingInfo={element.parkingInfo}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default WorkSchedule;
