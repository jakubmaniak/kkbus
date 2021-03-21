import React, { useState } from 'react';
import Dropdown from './Dropdown';
import BookingListItem from './BookingListItem';
import '../styles/BookingList.css';

function BookingList() {
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

    return (
        <div className="booking-list page">
            <div className="main">
                <div className="tile">
                    <h2>Szukaj kursu</h2>
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Trasa</span>
                            <Dropdown placeholder="Kraków - Katowice"/>
                        </div>
                        <div className="filter-container">
                            <span>Kierunek</span>
                            <Dropdown placeholder="Kraków -> Katowice"/>
                        </div>
                    </div>
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Data</span>
                            <Dropdown placeholder="dzisiaj"/>
                        </div>
                        <div className="filter-container">
                            <span>Godzina</span>
                            <Dropdown placeholder="aktualna"/>
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="find">Szukaj</button>
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
