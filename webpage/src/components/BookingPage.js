import React, { useState, useEffect } from 'react';

import * as api from '../api';

import BookingHistoryItem from './BookingHistoryItem';
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
                <div className="tile half">
                    <h2>Aktualne rezerwacje</h2>
                    {futureBookings.map((booking, i) => {
                        return (
                            <BookingHistoryItem 
                                key={i}
                                date={booking.date}
                                route={booking.firstStop + ' ' + booking.lastStop}
                                normalTickets={booking.normalTickets}
                                reducedTickets={booking.reducedTickets}
                                childTicekts={booking.childTicekts}
                            />
                        );
                    })}
                </div>
                <div className="tile half">
                    <h2>Historia</h2>
                    {pastBookings.map((booking, i) => {
                        return (
                            <BookingHistoryItem 
                                key={i}
                                date={booking.date}
                                route={booking.firstStop + ' ' + booking.lastStop}
                                normalTickets={booking.normalTickets}
                                reducedTickets={booking.reducedTickets}
                                childTicekts={booking.childTicekts}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BookingPage;
