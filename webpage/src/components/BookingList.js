import React, { useEffect, useState } from 'react';

import * as api from '../api';

import Dropdown from './Dropdown';
import BookingListItem from './BookingListItem';
import '../styles/BookingList.css';
import { routeFormatter } from '../helpers/text-formatters';

function BookingList() {
    let [routes, setRoutes] = useState([]);
    let [dates] = useState(['aktualna']);
    let [hours] = useState(['aktualna']);
    let [bookinglist, setBookingList] = useState([
        {
            bookingNumber: 233706,
            clientName: 'Krzysztof Niebieski',
            ticket: '2 normalne, 1 ulgowy'
        },
        {
            bookingNumber: 614281,
            clientName: 'Anna Biała',
            ticket: '1 ulgowy'
        },
        {
            bookingNumber: 441899,
            clientName: 'Tomasz Czerwiński',
            ticket: '2 normalne, 1 dziecko do lat 5'
        },
        {
            bookingNumber: 280442,
            clientName: 'Jan Fioleciak',
            ticket: '1 normalny'
        },
        {
            bookingNumber: 54413,
            clientName: 'Ewa Czarna',
            ticket: '2 normalne'
        },
        {
            bookingNumber: 563149,
            clientName: 'Adam Blady',
            ticket: '2 normalne, 1 ulgowy, 2 dzieci do lat 5'
        }
    ]);

    useEffect(() => {
        api.getAllRoutes()
            .then((routes) => setRoutes(routes))
            .catch(api.errorAlert);
    }, []);

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
                                placeholder="Wybierz trasę" />
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
                    <h2>Lista rezeracji</h2>
                    <div className="booking-list-container">
                        {bookinglist.map((bookingItem) => {
                            return (
                                <BookingListItem
                                    bookingNumber={bookingItem.bookingNumber}
                                    clientName={bookingItem.clientName}
                                    ticket={bookingItem.ticket}
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
