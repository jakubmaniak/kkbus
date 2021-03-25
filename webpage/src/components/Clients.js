import React, { useState } from 'react';

import * as api from '../api';
import Dropdown from './Dropdown';
import Client from './Client';

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

    function handleQueryChange(ev) {
        let searchQuery = ev.target.value;
        setSearchQuery(searchQuery);

        api.getClients(selectedSearchParam[0], searchQuery)
            .then(setClients)
            .catch(api.errorAlert);
    }

    return (
        <div className="client page">
            <div className="main">
                <div className="tile half tile-container">
                    <div className="tile">
                        <h2>Szukaj klientów</h2>
                        <form className="client-find">
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
                    { clients.map((client) => {
                        return (
                            <Client
                                name={client.firstName}
                                surname={client.lastName}
                                login={client.login}
                                email={client.email}
                                birthday={client.birthDate}
                                phone={client.phoneNumber}
                                /*reservation={client.reservation}*/
                            />
                        );
                    }) }
                </div>
               
                <div className="tile half">
                    <h2>Utwórz konto klienta</h2>
                    <form className="client-create">
                        <input placeholder="Adres email"/>
                        <input placeholder="Imię"/>
                        <input placeholder="Nazwisko"/>
                        <input placeholder="Data urodzenia"/>
                        <input placeholder="Numer telefonu"/>
                        <button className="submit">Szukaj</button>
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default Clients;
