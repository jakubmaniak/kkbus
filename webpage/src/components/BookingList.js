import React, { useEffect, useState } from 'react';
import '../styles/BookingList.css';

import * as api from '../api';

import Dropdown from './Dropdown';
import BookingListItem from './BookingListItem';

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
            .catch(api.errorAlert);
    }, []);

    useEffect(() => {
        if(selectedRoute !== '') {
           api.getRouteBookings(selectedRoute.id, '2021-04-07', '15:00')
            .then((results) => setBookingList(results))
            .catch(api.errorAlert);
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
                <div className="tile">
                    <h2>Lista rezerwacji</h2>
                    <div className="booking-list-container">
                        {bookinglist.map((bookingItem) => {
                            return (
                                <BookingListItem
                                    id={bookingItem.id}
                                    firstName={bookingItem.firstName}
                                    lastName={bookingItem.lastName}
                                    childTickets={bookingItem.childTickets}
                                    normalTickets={bookingItem.normalTickets}
                                    reducedTickets={bookingItem.reducedTickets}
                                />
                            )
                        })}
                    </div>
                    <div className="button-container">
                        <button className="print">Drukuj</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingList;
