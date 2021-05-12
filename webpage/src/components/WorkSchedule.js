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
    let [items, setItems] = useState([]);
    let [groups, setGroups] = useState([]);

    const defaultTimeStart = moment().startOf("day").toDate();
    const defaultTimeEnd = moment().startOf("day").add(1, "day").toDate();

    useEffect(() => {
        setGroups([
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
                title: 'Jan Doświadczony',
                height: 40
            },
            { 
                id: 6,
                title: 'Marek Poprawny',
                height: 40
            },
            { 
                id: 7,
                title: 'Zuzanna Konkretna',
                height: 40
            }
        ]);
        setItems([
            {
                id: 1,
                group: 2,
                title: 'item 1',
                start: moment().add(1, 'hour'),
                end: moment().add(2, 'hour')
            },
            {
                id: 2,
                group: 3,
                title: 'item 2',
                start: moment().add(2, 'hour'),
                end: moment().add(3, 'hour')
            }
        ]);    
    }, []);
    

    let keys = {
        groupIdKey: "id",
        groupTitleKey: "title",
        groupRightTitleKey: "rightTitle",
        itemIdKey: "id",
        itemTitleKey: "title",
        itemDivTitleKey: "title",
        itemGroupKey: "group",
        itemTimeStartKey: "start",
        itemTimeEndKey: "end",
        groupLabelKey: "title"
      };

    let groupRenderer = ({ group }) => {
        let className = group.title.includes('Kierowcy') ? 'section' : 'group';
        return <div className={className}>{group.title}</div>;
      };

    let handleItemMove = (itemId, dragTime, newGroupOrder) => {    
        const group = groups[newGroupOrder];
    
        setItems(items.map((item) => item.id === itemId
                ? Object.assign({}, item, {
                    start: dragTime,
                    end: dragTime + (item.end - item.start),
                    group: group.id
                })
                : item
            )
        );
    
        console.log("Moved", itemId, dragTime, newGroupOrder, items);
      };

    return (
        <div className="work-schedule page">
            <div className="main">
                <Timeline
                    groups={groups}
                    groupRenderer={groupRenderer}
                    items={items}
                    keys={keys}
                    canMove={true}
                    itemHeightRatio={0.9}
                    canResize={false}
                    defaultTimeStart={defaultTimeStart}
                    defaultTimeEnd={defaultTimeEnd}
                    onItemMove={handleItemMove}
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
