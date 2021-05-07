import React, { useState, useEffect, useContext } from 'react';
import '../styles/Profile.css';

import Person from './Person';
import { ModalLoader } from './Loader';

import UserContext from '../contexts/User';

import * as api from '../api';


function Profile() {
    let [person, setPerson] = useState([]);

    let [loading, setLoading] = useState(true);
    let { role, loaded: userInfoLoaded } = useContext(UserContext).user;

    useEffect(() => {
        if (!userInfoLoaded) return;

        api.getUserProfile()
            .then((results) => {
                setPerson(results);
                setLoading(false);
            })
            .catch(api.toastifyError);
            
    }, [userInfoLoaded]);

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
                        role={role}
                    />
                    <div className="data-change">
                        <button>Zmień hasło</button>
                        <button>Edytuj dane</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
