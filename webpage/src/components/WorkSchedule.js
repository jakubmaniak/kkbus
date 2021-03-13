import React from 'react';
import '../styles/WorkSchedule.css';
import WorkScheduleFilter from './WorkScheduleFilter';
import WorkScheduleItem from './WorkScheduleItem';

function WorkSchedule() {
    let drivers = ['Tomasz Rajdowiec', 'Kazimierz Rajdowiec', 'Mirosław Szybki'];
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
    ]

    return (
        <div className="work-schedule-page">
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="row-container">
                        <WorkScheduleFilter label="Kierowca:">
                            <div className="list-item">{drivers[0]}</div>
                            {drivers.map((driver) => {
                                if(driver !== drivers[0]) {
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
                {data.map((element) => {
                    return (
                        <WorkScheduleItem 
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
