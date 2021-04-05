import React, { useEffect, useState } from 'react';
import Dropdown from './Dropdown';
import '../styles/Timetable.css';
import TimetableFilterDays from './TimetableFilterDays';
import TimetableItem from './TimetableItem';
import * as api from '../api';


function Timetable() {
    let [timetable, setTimetable] = useState([]); 

    useEffect(() => {
        api.getTimetable().then(setTimetable);
    }, []);

    let d = new Date('2021-04-03'); //data pozyskana z filtru
    let filterDays = [];
    let availableTileWidth = 115;
    let availableTileMargin = 15;

    function setFilterDays() {
        for(let i = 0; i < 7; i++) {
            let weekDay = (['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'])[(d.getDay() + i) % 7];   
            let monthDay = (d.getDate() + i).toString().padStart(2, '0');
            let month = (d.getMonth() + 1).toString().padStart(2, '0');
            let displayText = `${weekDay}, ${monthDay}.${month}`; 
            filterDays[i] = displayText;
        }

        return filterDays;
    }

   function compareDate(filterResult) {
    let weekAvailable = [null, null, null, null, null, null, null]; 
    
    filterResult.items.map((item, i) => {
        let comparer = item.startDate.slice(5).split('-').reverse().join('.');
        let days = item.days;
        let range = item.ranges;
        let available = item.available;

        filterDays.map((filterDay, i) => {
            if(filterDay.includes(comparer)) {
                weekAvailable[i] = {
                    range, 
                    width: availableTileWidth * days + availableTileMargin * (days - 1),
                    available
                };

                if(days > 1) {
                    for(let j = 1; j < days; j++) {
                        weekAvailable[i + j] = 'occupied';
                    }
                }
            }
        });
    }); 
    return weekAvailable;
   }


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
                    children={setFilterDays().map((filterDay, i) => {
                        return (
                            <span key={i}>{filterDay}</span>
                        )
                    })}
               />
               <div className="timetable-item-container">
                {timetable.map((filterResult, i) => {
                    return (
                            <TimetableItem key={i}
                                name={filterResult.name}
                                role={filterResult.role}
                                children={compareDate(filterResult).map((item, i) => {
                                    if(item !== null && item !== 'occupied') {
                                        return (
                                            <div className={item.available ? 'available' : 'unavailable'} key={i} style={{width: item.width + "px"}}>
                                                <span>{item.available ? 'Dostępność' : 'Niedyspozycja'}</span>
                                                    {item.range.map((range, j) => {
                                                        return (
                                                            <span key={j}>{range}</span>
                                                        );
                                                    })}
                                            </div>                                            
                                        );
                                    }
                                    else if(item === null) {
                                        return (
                                            <span style={{width: availableTileWidth + 'px'}}></span>
                                        );
                                    }
                                })}
                            />
                    );
                })}
               </div>
            </div>
        </div>
    );
}

export default Timetable;
