import React, { useEffect, useState, useRef } from 'react';
import '../styles/BookingList.css';

import * as api from '../api';
import dayjs from 'dayjs';

import Dropdown from './Dropdown';
import PrintBookingList from './PrintBookingList';

import { routeFormatter } from '../helpers/text-formatters';

function BookingList() {
    let [routes, setRoutes] = useState([]);
    let [dates, setDates] = useState([]);
    let [hours] = useState(['aktualna']);

    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedDate, setSelectedDate] = useState();

    let [bookinglist, setBookingList] = useState([]);

    useEffect(() => {
        api.getAllRoutes()
            .then((routes) => setRoutes(routes))
            .catch(api.toastifyError);

        setDays();
    }, []);

    useEffect(() => {
        if(selectedRoute && selectedDate) {
           api.getRouteBookings(selectedRoute.id, dayjs(selectedDate).format('YYYY-DD-MM HH:mm:ss'), '19:00')
            .then((results) => {setBookingList(results); console.log(results)})
            .catch(api.toastifyError);
        }
    }, [selectedRoute, selectedDate]);

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
                    </div>
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Data</span>
                            <Dropdown 
                                items={dates} 
                                handleChange={setSelectedDate}
                                placeholder="Wybierz datę"
                            />
                        </div>
                        <div className="filter-container">
                            <span>Godzina</span>
                            <Dropdown items={hours} alwaysSelected />
                        </div>
                    </div>
                </div>
                <PrintBookingList 
                    bookinglist={bookinglist.length > 0 ? bookinglist : null} 
                />
            </div>
        </div>
    );
}

export default BookingList;
