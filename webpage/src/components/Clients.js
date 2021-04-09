import React, { useState } from 'react';

import * as api from '../api';
import Dropdown from './Dropdown';
import Client from './Client';
import { ModalLoader } from './Loader';
import { fromValue } from '../helpers/from-value';

import '../styles/Clients.css';

function Clients() {
    let [selectedSearchParam, setSelectedSearchParam] = useState('');
    let [searchParams] = useState([
        ['name', 'Nazwisko'],
        ['id', 'Numer identyfikacyjny'],
        ['login', 'Login'],
        ['email', 'Adres e-mail'],
        ['phone', 'Numer telefonu']
    ]);
    let [searchQuery, setSearchQuery] = useState('');
    let [clients, setClients] = useState([]);

    let [email, setEmail] = useState('');
    let [firstname, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');
    let [birthDate, setBirthDate] = useState('');
    let [phoneNumber, setPhoneNumber] = useState('');

    // let [loading, setLoading] = useState(true);
    // let loadingInitTime = Date.now();

    function handleQueryChange(ev) {
        setSearchQuery(ev.target.value);
    }

    function handleSearchSubmit(ev) {
        ev.preventDefault();

        api.getClients(selectedSearchParam[0], searchQuery)
            .then((results) => {
                setClients(results)
                // setTimeout(() => {
                //     setLoading(false);
                // }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
            })
            .catch(api.errorAlert);
    }

    function handleRegisterSubmit(ev) {
        ev.preventDefault();

        api.register(email, firstname, lastName, birthDate, phoneNumber)
        .then(() => {
            setEmail('');
            setFirstName('');
            setLastName('')
            setBirthDate('');
            setPhoneNumber('');
            alert('Dodano konto użytkowinka');
        })
        .catch((err) => {
            alert(api.errorToString(err));
        });
    }

    return (
        <div className="client page">
            {/* <ModalLoader loading={loading} /> */}
            <div className="main">
                <div className="tile half tile-container">
                    <div className="tile">
                        <h2>Szukaj klientów</h2>
                        <form className="client-find" onSubmitCapture={handleSearchSubmit}>
                            <input placeholder="Szukana fraza" value={searchQuery}
                                onChange={handleQueryChange} />
                            <Dropdown
                                items={searchParams}
                                textProperty="1"
                                handleChange={setSelectedSearchParam}
                                alwaysSelected />
                            <button className="submit">Szukaj</button>
                        </form>
                    </div>
                    {(clients.length === 0) ? <p className="no-results" style={{marginTop: '20px'}}>Brak wyników</p> : null}
                    { clients.map((client, i) => {
                        return (
                            <Client
                                key={i}
                                name={client.firstName}
                                surname={client.lastName}
                                login={client.login}
                                email={client.email}
                                birthday={(new Date(client.birthDate)).toLocaleDateString()}
                                phone={client.phoneNumber}
                                userId={client.id}
                                /*reservation={client.reservation}*/
                            />
                        );
                    }) }
                </div>       
                <div className="tile half">
                    <h2>Utwórz konto klienta</h2>
                    <form className="client-create" onSubmit={handleRegisterSubmit}>
                        <input type="text" placeholder="Adres email" 
                            value={email} onChange={fromValue(setEmail)} />
                        <input type="text" placeholder="Imię" 
                            value={firstname} onChange={fromValue(setFirstName)} />
                        <input type="text" placeholder="Nazwisko" 
                            value={lastName} onChange={fromValue(setLastName)} />
                        <input type="date" placeholder="Data urodzenia" 
                            value={birthDate} onChange={fromValue(setBirthDate)} />
                        <input type="text" placeholder="Numer telefonu" 
                            value={phoneNumber} onChange={fromValue(setPhoneNumber)} />
                        <button className="submit">Stwórz konto</button>
                    </form>
                </div>        
            </div>
        </div>
    );
}

export default Clients;
