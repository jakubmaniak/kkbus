import React from 'react';
import Dropdown from './Dropdown';
import '../styles/Timetable.css';
import TimetableFilterDays from './TimetableFilterDays';
import TimetableItem from './TimetableItem';


function Timetable() {

    let filterResults = [
        {
            name: 'Kazimierz Rajdowiec',
            role: 'kierowca',
            items: [
                {
                    available: true,
                    startDate: '2021-04-03',
                    days: 1,
                    ranges: ['10:00 - 20:00']
                },
                {
                    available: true,
                    startDate: '2021-04-04',
                    days: 1,
                    ranges: ['10:00 - 14:00', '18:00 - 22:00']
                },
                {
                    available: true,
                    startDate: '2021-04-05',
                    days: 3,
                    ranges: ['12:00 - 20:00']
                },
                {
                    available: false,
                    startDate: '2021-04-08',
                    days: 2,
                    ranges: ['12:00 - 16:00']
                }
            ]
        },
        {
            name: 'Tomasz Rajdowiec',
            role: 'kierowca',
            items: [
                {
                    available: true,
                    startDate: '2021-04-03',
                    days: 2,
                    ranges: ['12:00 - 20:00']
                },
                {
                    available: false,
                    startDate: '2021-04-05',
                    days: 2,
                    ranges: ['12:00 - 16:00']
                },
                {
                    available: true,
                    startDate: '2021-04-07',
                    days: 3,
                    ranges: ['12:00 - 20:00']
                }
            ]
        },
        {
            name: 'Mirosław Szybki',
            role: 'kierowca',
            items: [
                {
                    available: true,
                    startDate: '2021-04-03',
                    days: 2,
                    ranges: ['10:00 - 20:00']
                },
                {
                    available: null,
                    startDate: '2021-04-05',
                    days: 5,
                    ranges: []
                }
            ]
        },
        {
            name: 'Jan Doświadczony',
            role: 'kierowca',
            items: [
                {
                    available: null,
                    startDate: '2021-04-03',
                    days: 1,
                    ranges: []
                },
                {
                    available: true,
                    startDate: '2021-04-04',
                    days: 4,
                    ranges: ['16:00 - 24:00']
                },
                {
                    available: null,
                    startDate: '2021-04-08',
                    days: 2,
                    ranges: []
                },
            ]
        }
    ];


    let d = new Date('2021-04-03'); //data pozyskana z filtru
    let filterDays = [];
    let filtersDaysToCompare = [];

    function setFilterDays() {
        for(let i = 0; i < 7; i++) {
            let weekDay = (['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'])[(d.getDay() + i) % 7];   
            let monthDay = (d.getDate() + i).toString().padStart(2, '0');
            let month = (d.getMonth() + 1).toString().padStart(2, '0');
            let displayText = `${weekDay}, ${monthDay}.${month}`; 
            filterDays[i] = displayText;
            filtersDaysToCompare[i] = d.getFullYear() + '-' + month + '-' + monthDay;
        }

        return filterDays;
    }

   function compareDate(filterResult) {
    let week = [null, null, null, null, null, null, null]; 
    
    filterResult.items.map((item, i) => {
        let comparer = item.startDate.slice(5).split('-').reverse().join('.');
        let days = item.days;
        let range = item.ranges;
        let available = item.available;

        filterDays.map((filterDay, i) => {
            if(filterDay.includes(comparer)) {
                week[i] = {
                    range, 
                    width: 115 * days + 15 * (days - 1),
                    available
                };
            }
        });
       
    }); 
    return week;
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
                {filterResults.map((filterResult, i) => {
                    return (
                            <TimetableItem key={i}
                                name={filterResult.name}
                                role={filterResult.role}
                                children={compareDate(filterResult).map((item) => {
                                    if(item != null) {
                                        return (
                                            <div className={item.available ? 'available' : item.available === null ? 'add' : 'unavailable'} style={{width: item.width + "px"}}>
                                                <span>{item.available ? 'Dostępność' : item.available === null ? '+ Dodaj' : 'Niedyspozycja'}</span>
                                                {item.range.map((range, j) => {
                                                    return (
                                                        <span key={j}>{range}</span>
                                                    );
                                                })}
                                                    
                                            </div>                                            
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
