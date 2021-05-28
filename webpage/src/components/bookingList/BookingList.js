import React, { useEffect, useState } from 'react';
import '../../styles/BookingList.css';

import * as api from '../../api';
import dayjs from 'dayjs';

import Dropdown from '../dropdowns/Dropdown';
import PrintBookingList from './PrintBookingList';

import { routeFormatter } from '../../helpers/text-formatters';

function BookingList() {
    let [routes, setRoutes] = useState([]);
    let [dates, setDates] = useState([]);
    let [hours, setHours] = useState([]);

    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedDate, setSelectedDate] = useState();
    let [selectedHour, setSelectedHour] = useState();

    let [bookinglist, setBookingList] = useState([]);

    useEffect(() => {
        api.getAllRoutes()
            .then((routes) => setRoutes(routes))
            .catch(api.toastifyError);

        setDays();
    }, []);

    useEffect(() => {        
        if(selectedRoute && selectedDate && selectedHour) {
           api.getRouteBookings(selectedRoute.id, selectedDate.split('.').reverse().join('-'), selectedHour.padStart(5, '0'))
            .then(setBookingList)
            .catch(api.toastifyError);
        }
    }, [selectedRoute, selectedDate, selectedHour]);

    useEffect(() => {
        if(selectedRoute) {
            setHours(selectedRoute.hours);
            setSelectedHour();
        }

        console.log(bookinglist);
    }, [selectedRoute]);

    function setDays() {
        let date = new Date();

        for(let i = 0; i < 7; i++) {
            setDates(prevState => [...prevState, (date.getDate() + i).toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear()])
        }
    }

    return (
        <div className="booking-list page">
            <div className="main">
                <div className="tile">
                    <h2>Szukaj kursu</h2>
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Trasa</span>
                            <Dropdown
                                items={routes}
                                textFormatter={routeFormatter}
                                placeholder="Wybierz trasę" 
                                handleChange={setSelectedRoute}    
                            />
                        </div>
                        <div className="filter-container">
                            <span>Godzina</span>
                            <Dropdown 
                                items={hours} 
                                placeholder="Wybierz godzinę"
                                handleChange={setSelectedHour}
                            />
                        </div>
                    </div>
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Data</span>
                            <Dropdown 
                                items={dates} 
                                placeholder="Wybierz datę"
                                handleChange={setSelectedDate}
                                alwaysSelected
                            />
                        </div>
                    </div>
                </div>
                <PrintBookingList 
                    bookinglist={bookinglist.length > 0 ? bookinglist : null}
                    route={selectedRoute ? selectedRoute.departureLocation + ' - ' + selectedRoute.arrivalLocation : null}
                    date={selectedDate}
                    hour={selectedHour} 
                />
            </div>
        </div>
    );
}

export default BookingList;
