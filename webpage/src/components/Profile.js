import React, { useState, useEffect, useContext } from 'react';
import '../styles/Profile.css';

import Person from './Person';
import BookingHistoryItem from './BookingHistoryItem';
import { ModalLoader } from './Loader';

import UserContext from '../contexts/User';

import * as api from '../api';


function Profile() {
    let [person, setPerson] = useState([]);
    let [bookingHistory, setBookingHistory] = useState([]);

    let [loading, setLoading] = useState(true);
    let { role, loaded: userInfoLoaded } = useContext(UserContext).user;

    useEffect(() => {
        if (!userInfoLoaded) return;

        let userProfilePromise = api.getUserProfile()
            .then(setPerson);

        let bookingsPromise = Promise.resolve();
        
        if (role === 'client') {
            bookingsPromise = api.getUserBookings()
                .then((results) => {
                    setBookingHistory(results);
                    console.log(results);
                });
        }

        Promise.all([userProfilePromise, bookingsPromise])
            .then(() => setLoading(false))
            .catch(api.toastifyError);
    }, [userInfoLoaded, role]);

    return (
        <div className="profile-page page">
            <ModalLoader loading={loading} />
            <div className="main">
                <div className="tile half">
                    <h2>Profil</h2>
                    <Person
                        firstName={person.firstName}
                        lastName={person.lastName}
                        login={person.login}
                        email={person.email}
                        birthday={person.birthDate}
                        phoneNumber={person.phoneNumber}
                        client={role === 'client' ? true : false}
                    />
                    <div className="data-change">
                        <button>Zmień hasło</button>
                        <button>Edytuj dane</button>
                    </div>
                </div>
                {role === 'client' ?
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
                    : null    
                }
            </div>
        </div>
    );
}

export default Profile;
