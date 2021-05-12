import React, { useEffect, useState } from 'react';
import '../styles/WorkSchedule.css';
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'

import * as api from '../api';

import { routeFormatter } from '../helpers/text-formatters';

import Dropdown from './Dropdown';
import Loader from './Loader';
import WorkScheduleItem from './WorkScheduleItem';
import Timeline from 'react-calendar-timeline'

function WorkSchedule() {
    let [loading, setLoading] = useState(false);

    const groups = [
        { 
            id: 1,
            height: 40,
            title: 'Kierowcy',
        },
        { 
            id: 2,
            height: 40,
            title: 'Tomasz Rajdowiec',
        },
        { 
            id: 3,
            title: 'Kazimierz Rajdowiec',
            height: 40,
        },
        { 
            id: 4,
            title: 'Mirosław Szybki',
            height: 40
        },
        { 
            id: 5,
            title: 'Mirosław Szybki',
            height: 40
        },
        { 
            id: 6,
            title: 'Jan Doświadczony',
            height: 40
        },
        { 
            id: 7,
            title: 'Marek Poprawny',
            height: 40
        },
        { 
            id: 8,
            title: 'Zuzanna Konkretna',
            height: 40
        }
    ]

    const items = [
        {
            id: 1,
            group: 2,
            title: 'item 2',
            start_time: moment().add(-0.5, 'hour'),
            end_time: moment().add(0.5, 'hour')
        },
        {
            id: 2,
            group: 1,
            title: 'item 3',
            start_time: moment().add(2, 'hour'),
            end_time: moment().add(3, 'hour')
        }
    ];    

    let groupRenderer = ({ group }) => {
        let className = group.title.includes('Kierowcy') ? 'section' : 'group';
        return <div className={className}>{group.title}</div>;
      };

    return (
        <div className="work-schedule page">
            <div className="main">
                <Timeline
                    groups={groups}
                    groupRenderer={groupRenderer}
                    items={items}
                    defaultTimeStart={moment().add(-12, 'hour')}
                    defaultTimeEnd={moment().add(12, 'hour')}
                    horizontalLineClassNamesForGroup={(group) => group.root ? ["row-root"] : []}
                    horizontalLineClassNamesForGroup={group =>
                        group.title.includes("e") ? ["highlight"] : ""
                    }
                />
            </div>
        </div>
    );
}

export default WorkSchedule;

/*
 // let [selectedDriver, setSelectedDriver] = useState();
    // let [selectedRoute, setSelectedRoute] = useState();
    // let [selectedRange, setSelectedRange] = useState();

    // let [driverNames, setDriverNames] = useState([]);
    // let [routes, setRoutes] = useState(['wszystkie']);
    // let [ranges] = useState([
    //     [0, 'dzisiaj'],
    //     [1, 'jutro'],
    //     [7, '7 kolejnych dni'],
    //     [31, 'ten miesiąc']
    // ]);

    // let [results, setResults] = useState([]);

    // useEffect(() => {
    //     api.getDriverNames()
    //         .then(setDriverNames)
    //         .catch(api.toastifyError);

    //     api.getAllRoutes()
    //         .then((routes) => setRoutes(['wszystkie'].concat(routes)))
    //         .catch(api.toastifyError);
    // }, []);

    // useEffect(() => {
    //     if (!selectedDriver) return;

    //     setResults([]);
    //     setLoading(true);

    //     let start = Date.now();

    //     let routeId = null;
    //     if (typeof selectedRoute === 'object') routeId = selectedRoute.id;

    //     api.getWorkSchedule(selectedDriver.id, selectedRange[0], routeId)
    //         .then((results) => {
    //             if (Date.now() - start > 250) {
    //                 setResults(results);
    //                 setLoading(false);
    //             }
    //             else {
    //                 setTimeout(() => {
    //                     setResults(results);
    //                     setLoading(false);
    //                 }, 500 - (Date.now() - start));
    //             }
    //         })
    //         .catch(api.toastifyError);
    // }, [selectedDriver, selectedRoute, selectedRange]);  

    // return (
    //     <div className="work-schedule page">
    //         <div className="main">
    //             <div className="tile">
    //                 <h2>Filtry</h2>
    //                 <div className="row-filter-container">
    //                     <div className="filter-container">
    //                         <span>Kierowca:</span>
    //                         <Dropdown
    //                             items={driverNames}
    //                             textFormatter={(driver) => driver.firstName + ' ' + driver.lastName}
    //                             placeholder="Wybierz kierowcę"
    //                             handleChange={setSelectedDriver} />
    //                     </div>
    //                     <div className="filter-container">
    //                         <span>Trasy:</span>
    //                         <Dropdown
    //                             items={routes}
    //                             textFormatter={routeFormatter}
    //                             alwaysSelected
    //                             handleChange={setSelectedRoute} />
    //                     </div>
    //                 </div>
    //                 <div className="row-filter-container">
    //                     <div className="filter-container">
    //                         <span>Zakres dni:</span>
    //                         <Dropdown
    //                             items={ranges}
    //                             textProperty="1"
    //                             alwaysSelected
    //                             handleChange={setSelectedRange} />
    //                     </div>
    //                 </div>
    //             </div>
    //             <Loader loading={loading} />
    //             {(!loading && results.length === 0) ? <p className="no-results">Brak wyników</p> : null}
    //             {results.map((element, i) => {
    //                 return (
    //                     <WorkScheduleItem 
    //                         key={i}
    //                         start={element.start}
    //                         end={element.end}
    //                         day={element.day}
    //                         hour={element.hour}
    //                         vehicle={element.vehicle}
    //                         parking={element.parking}
    //                         parkingInfo={element.parkingInfo}
    //                     />
    //                 );
    //             })}
    //         </div>
    //     </div>
    // );
*/
