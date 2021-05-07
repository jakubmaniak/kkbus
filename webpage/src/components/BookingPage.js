import React, { useState, useEffect } from 'react';
import '../styles/BookingPage.css';

import * as api from '../api';

import BookingItem from './BookingItem';
import { ModalLoader } from './Loader';

function BookingPage() {
    let [pastBookings, setPastBookings] = useState([]);
    let [futureBookings, setFutureBookings] = useState([]);

    let [loading, setLoading] = useState(true);

    useEffect(() => {
        let getPastBookings = api.getUserPastBookings()
            .then(setPastBookings);

        let getFutureBookings = api.getUserFutureBookings()
            .then(setFutureBookings);

        Promise.all([getPastBookings, getFutureBookings])
            .then(() => setLoading(false))
            .catch(api.toastifyError);
    }, []);

    return (
        <div className="booking-profile page">
            <ModalLoader loading={loading} />
            <div className="main">
                <div className="tile">
                    <h2>Aktualne rezerwacje</h2>
                    <p className="booking-header">
                        <span>Data</span>
                        <span>Godzina</span>
                        <span>Kierunek</span>
                        <span>Normalne</span>
                        <span>Ulgowe</span>
                        <span>Dzieci do lat 5</span>
                    </p>
                    {console.log(futureBookings)}
                    {futureBookings.map((booking, i) => {
                        return (
                            <BookingItem 
                                key={i}
                                date={booking.date}
                                hour={booking.hour}
                                route={booking.firstStop + ' - ' + booking.lastStop}
                                normalTickets={booking.normalTickets}
                                reducedTickets={booking.reducedTickets}
                                childTickets={booking.childTickets}
                            />
                        );
                    })}
                </div>
                <div className="tile">
                    <h2>Historia</h2>
                    <p className="booking-header">
                        <span>Data</span>
                        <span>Godzina</span>
                        <span>Kierunek</span>
                        <span>Normalne</span>
                        <span>Ulgowe</span>
                        <span>Dzieci do lat 5</span>
                    </p>
                    {pastBookings.map((booking, i) => {
                        return (
                            <BookingItem 
                                key={i}
                                date={booking.date}
                                hour={booking.hour}
                                route={booking.firstStop + ' - ' + booking.lastStop}
                                normalTickets={booking.normalTickets}
                                reducedTickets={booking.reducedTickets}
                                childTickets={booking.childTickets}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
