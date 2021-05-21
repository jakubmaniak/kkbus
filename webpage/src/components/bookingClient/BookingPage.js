import React, { useState, useEffect } from 'react';
import '../../styles/BookingPage.css';

import * as api from '../../api';

import BookingItem from './BookingItem';
import { ModalLoader } from '../Loader';

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
                    <table className="currentBookings">
                        <tbody>
                            <tr>
                                <th>Data</th>
                                <th>Godzina</th>
                                <th>Kierunek</th>
                                <th>Normalne</th>
                                <th>Ulgowe</th>
                                <th>Dzieci do lat 5</th>
                                <th></th>
                            </tr>
                            {futureBookings.map((booking, i) => {
                                return (
                                    <BookingItem 
                                        key={i}
                                        date={new Date(booking.date).toLocaleDateString()}
                                        hour={booking.hour}
                                        route={booking.firstStop + ' - ' + booking.lastStop}
                                        normalTickets={booking.normalTickets}
                                        reducedTickets={booking.reducedTickets}
                                        childTickets={booking.childTickets}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="tile">
                    <h2>Historia</h2>
                    <table className="pastBookings">
                        <tbody>
                            <tr>
                                <th>Data</th>
                                <th>Godzina</th>
                                <th>Kierunek</th>
                                <th>Normalne</th>
                                <th>Ulgowe</th>
                                <th>Dzieci do lat 5</th>
                            </tr>
                            {pastBookings.map((booking, i) => {
                                return (
                                    <BookingItem 
                                        key={i}
                                        date={new Date(booking.date).toLocaleDateString()}
                                        hour={booking.hour}
                                        route={booking.firstStop + ' - ' + booking.lastStop}
                                        normalTickets={booking.normalTickets}
                                        reducedTickets={booking.reducedTickets}
                                        childTickets={booking.childTickets}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
