import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import '../styles/BookingList.css';

import * as api from '../api';

import Dropdown from './Dropdown';
import PrintBookingList from './PrintBookingList';

import { routeFormatter } from '../helpers/text-formatters';

function BookingList() {
    let [routes, setRoutes] = useState([]);
    let [dates] = useState(['aktualna']);
    let [hours] = useState(['aktualna']);
    let [selectedRoute, setSelectedRoute] = useState('');
    let [bookinglist, setBookingList] = useState([]);

    useEffect(() => {
        api.getAllRoutes()
            .then((routes) => setRoutes(routes))
            .catch(api.toastifyError);
    }, []);

    useEffect(() => {
        if(selectedRoute !== '') {
           api.getRouteBookings(selectedRoute.id, '2021-04-07', '15:00')
            .then((results) => setBookingList(results))
            .catch(api.toastifyError);
        }
    }, [selectedRoute]);

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
                            <Dropdown items={dates} alwaysSelected />
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
