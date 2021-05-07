import React, { useState, useEffect } from 'react';

import * as api from '../api';

import BookingHistoryItem from './BookingHistoryItem';
import { ModalLoader } from './Loader';

function BookingProfile() {
    let [bookingHistory, setBookingHistory] = useState([]);
    let [previousBooking, setPreviousBooking] = useState([]);

    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();

    useEffect(() => {
        let promisePastBookings = api.getUserPastBookings()
            .then((results) => {
                setBookingHistory(results);
            });

        let promiseFutureBookings = api.getUserFutureBookings()
            .then((results) => {
                setPreviousBooking(results);
            });

            Promise.all([promisePastBookings, promiseFutureBookings])
            .then(() => {
                setTimeout(() => {
                    setLoading(false);
                }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
            })
            .catch(api.toastifyError);
    }, []);

    return (
        <div className="booking-profile page">
             <ModalLoader loading={loading} />
            <div className="main">
                <div className="tile half">
                    <h2>Historia rezerwacji</h2>
                    {bookingHistory.map((bookingHistoryItem, i) => {
                        return (
                            <BookingHistoryItem 
                                key={i}
                                date={bookingHistoryItem.date}
                                route={bookingHistoryItem.firstStop + ' ' + bookingHistoryItem.lastStop}
                                normalTickets={bookingHistoryItem.normalTickets}
                                reducedTickets={bookingHistoryItem.reducedTickets}
                                childTicekts={bookingHistoryItem.childTicekts}
                            />
                        );
                    })}
                </div>
                <div className="tile half">
                    <h2>Przeszłe rezerwacje</h2>
                    {previousBooking.map((previousBookingItem, i) => {
                        return (
                            <BookingHistoryItem 
                                key={i}
                                date={previousBookingItem.date}
                                route={previousBookingItem.firstStop + ' ' + previousBookingItem.lastStop}
                                normalTickets={previousBookingItem.normalTickets}
                                reducedTickets={previousBookingItem.reducedTickets}
                                childTicekts={previousBookingItem.childTicekts}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BookingProfile;
