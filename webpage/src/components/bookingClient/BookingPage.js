import React, { useState, useEffect } from 'react';
import '../../styles/BookingPage.css';

import * as api from '../../api';

import BookingItem from './BookingItem';
import { ModalLoader } from '../Loader';
import NotificationModal from '../modals/NotificationModal';
import toast from '../../helpers/toast';

function BookingPage() {
    let [pastBookings, setPastBookings] = useState([]);
    let [futureBookings, setFutureBookings] = useState([]);
    let [modalDeleteBookingVisibility, setModalDeleteBookingVisibility] = useState(false);
    let [deleteBookingId, setDeleteBookingId] = useState(-1); 

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

    function deleteBooking(id) {
        api.deleteBooking(id)
        .then(() => {
            api.getUserFutureBookings()
                .then((results) => {
                    setFutureBookings(results);
                    setModalDeleteBookingVisibility(false);
                    setDeleteBookingId(-1);
                    toast.success('Odwołano rezerwację');
                })
                .catch(api.toastifyError);
        })
        .catch(api.toastifyError);
    }

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
                            {futureBookings.map((booking) => {
                                return (
                                    <BookingItem 
                                        key={booking.id}
                                        date={new Date(booking.date).toLocaleDateString()}
                                        hour={booking.hour}
                                        route={booking.firstStop + ' - ' + booking.lastStop}
                                        normalTickets={booking.normalTickets}
                                        reducedTickets={booking.reducedTickets}
                                        childTickets={booking.childTickets}
                                        deleteBooking={() => {
                                            setModalDeleteBookingVisibility(true);
                                            setDeleteBookingId(booking.id);
                                        }}
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
            <NotificationModal 
                    visible={modalDeleteBookingVisibility}
                    header={'Odwołanie rezerwacji'}
                    name={'odwołać rezerwację'}
                    buttonText={'odwołaj'}
                    notificationModalExit={() => setModalDeleteBookingVisibility(false)}
                    delete={() => deleteBooking(deleteBookingId)}
            />
        </div>
    );
}

export default BookingPage;
