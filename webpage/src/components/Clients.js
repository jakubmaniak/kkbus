import React, { useState } from 'react';
import Dropdown from './Dropdown';
import Client from './Client';
import '../styles/Clients.css';

function Clients() {
    let [clients, setClients] = useState([
        {
            name: 'Anna',
            surname: 'Nowak',
            login: 'annanowak1234',
            email: 'anna.nowak@poczta.pl',
            birthday: '01.01.1999',
            phone: '111222333',
            reservation: '5/1'
        },
        {
            name: 'Anna',
            surname: 'Nowak',
            login: 'annanowak1234',
            email: 'anna.nowak@poczta.pl',
            birthday: '01.01.1999',
            phone: '111222333',
            reservation: '5/1'
        }
    ]);

    return (
        <div className="client page">
            <div className="main">
                <div className="tile half tile-container">
                    <div className="tile">
                        <h2>Szukaj klientów</h2>
                        <form className="client-find">
                            <input placeholder="Szukana fraza"/>
                            <Dropdown placeholder="Nazwisko"/>
                            <button className="submit">Szukaj</button>
                        </form>
                    </div>
                    {/* {clients.map((client) => {
                        return (
                            <Client
                                name={client.name}
                                surname={client.surname}
                                login={client.login}
                                email={client.email}
                                birthday={client.birthday}
                                phone={client.phone}
                                reservation={client.reservation}
                            />
                        );
                    })} */}
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
