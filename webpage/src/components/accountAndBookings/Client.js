import React, { useState, useEffect } from 'react';
import '../../styles/Clients.css';
import '../../styles/Person.css';

import * as api from '../../api';

import Dropdown from '../dropdowns/Dropdown';
import Modal from '../modals/Modal';
import Person from '../profile/Person';

import { fromValue } from '../../helpers/from-value';
import { routeFormatter } from '../../helpers/text-formatters';
import toast from '../../helpers/toast';

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
        .then(setRoutes)
        .catch(api.toastifyError);
    }, []);

    useEffect(() => {
        if(selectedRoute !== undefined) {
            let currentPrice = calculatePrice(selectedRoute, selectedFirstStop, selectedLastStop, normalTickets, reducedTickets);
            setPrice((isNaN(currentPrice) || currentPrice === null) ? 0 : currentPrice.toFixed(2));
        }
    }, [normalTickets, reducedTickets, selectedFirstStop, selectedLastStop]);

    useEffect(() => {
        if (selectedRoute !== undefined) {
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
                    <form className="book-route" onSubmit={(ev) => {ev.preventDefault(); addBookingToUser()}}>
                        <Dropdown 
                            placeholder="Wybierz tras??"
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
                        <input placeholder="Liczba os??b obj??tych biletem normalnym" value={normalTickets} onChange={fromValue(setNormalTickets)}/>
                        <input placeholder="Liczba os??b obj??tych biletem ulgowym" value={reducedTickets} onChange={fromValue(setReducedTickets)}/>
                        <input placeholder="Liczba dzieci do lat 5" value={childTickets} onChange={fromValue(setChildTickets)}/>
                        <Dropdown 
                            placeholder="Przystanek pocz??tkowy"
                            items={stops}
                            handleChange={setSelectedFirstStop}
                        />
                        <Dropdown 
                            placeholder="Przystanek ko??cowy"
                            items={stops}
                            handleChange={setSelectedLastStop}
                        />
                    </form>
                </section>
                <section className="footer reserve">
                    <div>
                        <p>Koszt rezerwacji: {price}z??</p>
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
            toast.error('Nie mo??esz wybra?? takich samych przystank??w');
            return;
        }

        if (!selectedDate || !selectedHour) {
            toast.error('Nie wybrano daty lub godziny');
            return null;
        }

        let tickets = {
            normal: normalTickets === '' ? 0 : parseInt(normalTickets),
            reduced: reducedTickets === '' ? 0 : parseInt(reducedTickets),
            child: childTickets === '' ? 0 : parseInt(childTickets)
        };

        if (isNaN(tickets.normal) || isNaN(tickets.reduced) || isNaN(tickets.child)) {
            toast.error('Wprowadzano niepoprawn?? liczb?? bilet??w');
            return null;
        }

        api.addBookingToUser(props.userId, selectedRoute.id, selectedDate[0], selectedHour, tickets.normal, tickets.reduced, tickets.child, selectedFirstStop, selectedLastStop)
        .then(() => {
            toast.success('Dodano rezerwacj??');
        })
        .catch(api.toastifyError);

        setModalVisibility(false);
    }

    return (
        <div className="tile client">
            <Person 
                firstName={props.firstName}
                lastName={props.lastName}
                login={props.login}
                email={props.email}
                birthday={props.birthday}
                phoneNumber={props.phoneNumber}
                reservation={props.reservation}
                client={true}
                unrealizedBookings={props.unrealizedBookings}
            />
            <div className="client-new-reservation">
                <button onClick={() => setModalVisibility(true)}>Nowa rezerwacja</button>
            </div>
            {bookingModal()}
        </div>
    );
}

export default Client;
