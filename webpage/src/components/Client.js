import React, { useState, useEffect } from 'react';
import '../styles/Clients.css';
import * as api from '../api';
import Dropdown from './Dropdown';
import Modal from './Modal';
import { fromValue } from '../helpers/from-value';
import { routeFormatter } from '../helpers/text-formatters';

function Client(props) {
    let [modalVisibility, setModalVisibility] = useState(false);

    let [routes, setRoutes] = useState([]);

    let [dates, setDates] = useState([]);
    let [hours, setHours] = useState([]);
    let [stops, setStops] = useState([]);
    let [normalTickets, setNormalTickets] = useState(0);
    let [reducedTickets, setReducedTickets] = useState(0);
    let [childTickets, setChildTickets] = useState(0);

    let [selectedDate, setSelectedDate] = useState();
    let [selectedHour, setSelectedHour] = useState();
    let [selectedFirstStop, setSelectedFirstStop] = useState();
    let [selectedLastStop, setSelectedLastStop] = useState();
    let [selectedRoute, setSelectedRoute] = useState();

    let [price, setPrice] = useState(0);

    useEffect(() => {
        api.getAllRoutes()
        .then((routes) => {
            setRoutes(routes);
            console.log(routes);
        });
    }, []);

    useEffect(() => {
        if(typeof selectedRoute !== 'undefined') {
            let currentPrice = calculatePrice(selectedRoute, selectedFirstStop, selectedLastStop, normalTickets, reducedTickets);
            setPrice((isNaN(currentPrice) || currentPrice === null) ? 0 : currentPrice.toFixed(2));
        }
    }, [normalTickets, reducedTickets, selectedFirstStop, selectedLastStop]);

    useEffect(() => {
        if(typeof selectedRoute !== 'undefined') {
            console.log(selectedRoute);
            setData(selectedRoute);
        }
    }, [selectedRoute])

    useEffect(() => {
        setStops([]);
        setDates([]);
        setHours([]);

        setSelectedDate(null);
        setSelectedHour(null);
        setNormalTickets(null);
        setChildTickets(null);
        setReducedTickets(null);
        setSelectedFirstStop(null);
        setSelectedLastStop(null); 
    }, [modalVisibility]);

    function setData(route) {
        setStops(route.stops);
        setHours(route.hours);
        setDates(new Array(8).fill(null).map((d, i) => {
            let date = new Date(new Date().getTime() + i * 24 * 3600 * 1000);
            return [date.toJSON().slice(0, 10), date.toLocaleDateString()];
        }));
    }

    function calculatePrice(route, firstStop, lastStop) {
        let tickets = {
            normal: normalTickets === '' || isNaN(normalTickets) || normalTickets === null ? 0 : parseInt(normalTickets),
            reduced: reducedTickets === '' || isNaN(reducedTickets) || reducedTickets === null ? 0 : parseInt(reducedTickets),
        };

        let stops = route.stops;
        let prices = route.prices;

        let firstStopIndex = stops.indexOf(firstStop);
        let lastStopIndex = stops.indexOf(lastStop);

        if(firstStopIndex === -1 || lastStopIndex === -1 || firstStopIndex >= lastStopIndex) {
            return null;
        }

        let multiplier = tickets.normal + tickets.reduced * 0.7;

        return multiplier * prices
            .slice(firstStopIndex, lastStopIndex)
            .reduce((a, b) => a + b);
    }

    function bookingModal() {
        return (
            <Modal visible={modalVisibility}>
                <header>Rezerwacja</header>
                <section className="content">
                    <form className="book-route">
                        <Dropdown 
                            placeholder="Wybierz trasę"
                            textFormatter={routeFormatter}
                            items={routes}
                            handleChange={setSelectedRoute} 
                        />
                        <Dropdown 
                            placeholder="Data"
                            items={dates}
                            textProperty="1"
                            handleChange={setSelectedDate} 
                        />
                        <Dropdown 
                            placeholder="Godzina"
                            items={hours}
                            handleChange={setSelectedHour} 
                        />
                        <input placeholder="Liczba osób objętych biletem normalnym" onChange={fromValue(setNormalTickets)}/>
                        <input placeholder="Liczba osób objętych biletem ulgowym" onChange={fromValue(setReducedTickets)}/>
                        <input placeholder="Liczba dzieci do lat 5" onChange={fromValue(setChildTickets)}/>
                        <Dropdown 
                            placeholder="Przystanek początkowy"
                            items={stops}
                            handleChange={setSelectedFirstStop}
                        />
                        <Dropdown 
                            placeholder="Przystanek końcowy"
                            items={stops}
                            handleChange={setSelectedLastStop}
                        />
                    </form>
                </section>
                <section className="footer reserve">
                    <div>
                        <p>Koszt rezerwacji: {price}zł</p>
                    </div>
                    <div>
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={addBookingToUser}>Zapisz</button>
                    </div>
                </section>
            </Modal>
        );
    }
    
    function addBookingToUser() {
        if (selectedFirstStop === selectedLastStop) {
            alert('Nie możesz wybrać takich samych przystanków');
            return;
        }

        if (!selectedDate || !selectedHour) {
            alert('Nie wybrano daty lub godziny');
            return null;
        }

        let tickets = {
            normal: normalTickets === '' ? 0 : parseInt(normalTickets),
            reduced: reducedTickets === '' ? 0 : parseInt(reducedTickets),
            child: childTickets === '' ? 0 : parseInt(childTickets)
        };

        if (isNaN(tickets.normal) || isNaN(tickets.reduced) || isNaN(tickets.child)) {
            alert('Wprowadzano niepoprawną liczbę biletów');
            return null;
        }

        api.addBookingToUser(props.userId, selectedRoute.id, selectedDate[0], selectedHour, tickets.normal, tickets.reduced, tickets.child, selectedFirstStop, selectedLastStop)
        .then(() => {
            alert('Dodano rezerwacje');
        })
        .catch(api.errorAlert);

        setModalVisibility(false);
    }

    return (
        <div className="tile client">
            <div className="client-data">
                <span>Imię</span>
                <span>{props.name}</span>
            </div>
            <div className="client-data">
                <span>Nazwisko</span>
                <span>{props.surname}</span>
            </div>
            <div className="client-data">
                <span>Login</span>
                <span>{props.login}</span>
            </div>
            <div className="client-data">
                <span>Adres email</span>
                <span>{props.email}</span>
            </div>
            <div className="client-data">
                <span>Data urodzenia</span>
                <span>{props.birthday}</span>
            </div>
            <div className="client-data">
                <span>Numer telefonu</span>
                <span>{props.phone}</span>
            </div>
            <div className="client-data">
                <span>Liczba rezerwacji zrealizowanych/niezrealizowanych</span>
                <span>{props.reservation}</span>
            </div>
            <div className="client-new-reservation">
                <button onClick={() => setModalVisibility(true)}>Nowa rezerwację</button>
            </div>
            {bookingModal()}
        </div>
    );
}

export default Client;
