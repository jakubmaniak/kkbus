import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { fromValue } from '../helpers/from-value';
import * as api from '../api';
import UserContext from '../contexts/User';
import RouteDirection from './RouteDirection';
import Modal from './Modal';
import Dropdown from './Dropdown';

import '../styles/RoutesPage.css';


function Route(props) {
    let { role } = useContext(UserContext).user;
    let [modalVisibility, setModalVisibility] = useState(false);
    let [departureLocation, setDepartureLocation] = useState(props.departureLocation);
    let [arrivalLocation, setArrivalLocation] = useState(props.arrivalLocation);
    let [dates, setDates] = useState([]);
    let [hours, setHours] = useState([]);
    let [prices, setPrices] = useState([]);
    let [stops, setStops] = useState([]);
    let [normalTickets, setNormalTickets] = useState(0);
    let [reducedTickets, setReducedTickets] = useState(0);
    let [childTickets, setChildTickets] = useState(0);

    let [selectedDate, setSelectedDate] = useState();
    let [selectedHour, setSelectedHour] = useState();
    let [selectedFirstStop, setSelectedFirstStop] = useState();
    let [selectedLastStop, setSelectedLastStop] = useState();

    let history = useHistory();

    useEffect(() => { 
        setPrices(props.stopsPrices.split(',').map((e) => e.trim()).filter((e, i) => i % 2 == 1).map(parseFloat));
        setStops(props.stopsPrices.split(',').map((e) => e.trim()).filter((e, i) => i % 2 == 0));

        setDates(new Array(8).fill(null).map((d, i) => {
            let date = new Date(new Date().getTime() + i * 24 * 3600 * 1000);
            return [date.toJSON().slice(0, 10), date.toLocaleDateString()];
        }));
    }, []);

    useEffect(() => { 
        setHours([...props.allHours]);
    }, [props.allHours]);


    function showModal() {
        setModalVisibility(true);
    }

    function updateRoute() {
        setModalVisibility(false);
        api.updateRoute(props.routeId, departureLocation, arrivalLocation, stops, hours, prices, null)
        .then(() => props.refreshRoutes());
    }

    function convertHoursIntoArray(ev) {
        let string = ev.target.value;
        let array = string.split(',').map((element) => element.trim());
        setHours(array);
    }

    function convertStopsPrices(ev) {
        let parts = ev.target.value.split(',').map((e) => e.trim());
        setStops(parts.filter((e, i) => i % 2 == 0));
        setPrices(parts.filter((e, i) => i % 2 == 1).map(parseFloat));   
    }

    function addBooking() {
        if (selectedFirstStop === selectedLastStop) {
            alert('Nie możesz wybrać takich samych przystanków');
            return;
        }

        if (!selectedDate || !selectedHour) {
            alert('Nie wybrano daty lub godziny');
            return null;
        }

        let tickets = {
            normal: normalTickets == '' ? 0 : parseInt(normalTickets),
            reduced: reducedTickets == '' ? 0 : parseInt(reducedTickets),
            child: childTickets == '' ? 0 : parseInt(childTickets)
        };

        if (isNaN(tickets.normal) || isNaN(tickets.reduced) || isNaN(tickets.child)) {
            alert('Wprowadzano niepoprawną liczbę biletów');
            return null;
        }

        console.log(props.routeId, selectedDate[0], selectedHour, tickets.normal, tickets.reduced, tickets.child, selectedFirstStop, selectedLastStop);
        api.addBooking(props.routeId, selectedDate[0], selectedHour, tickets.normal, tickets.reduced, tickets.child, selectedFirstStop, selectedLastStop);
    }

    function clientModal() {
        return (
            <Modal visible={modalVisibility}>
                <header>Rezerwacja</header>
                <section className="content">
                    <form className="book-route">
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
                        <p>Koszt rezerwacji: 200zł</p>
                    </div>
                    <div>
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={addBooking}>Zapisz</button>
                    </div>
                </section>
            </Modal>
        );
    }

    function ownerModal() {
        return (
            <Modal visible={modalVisibility}>
                <header>Edycja informacji o trasie</header>
                <section className="content">
                    <form className="edit-route">
                        <input placeholder="Punkt startowy" defaultValue={props.departureLocation} onChange={fromValue(setDepartureLocation)}/>
                        <input placeholder="Punkt docelowy" defaultValue={props.arrivalLocation} onChange={fromValue(setArrivalLocation)}/>
                        <textarea placeholder="Godziny odjazdu (odzielone przecinkami)" 
                            defaultValue={props.allHours.join(', ')}
                            onChange={convertHoursIntoArray}
                        />
                        <textarea placeholder="Przystanki (cena, przystanek, cena, przystanek...)"
                            defaultValue={props.stopsPrices}
                            onChange={convertStopsPrices}
                        />
                    </form>
                </section>
                <section className="footer">
                    <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                    <button onClick={updateRoute}>Zapisz</button>
                </section>
            </Modal>
        );
    }

    return (
        <>
            { role === 'client' ? clientModal()
            : role === 'owner'  ? ownerModal()
            : null
            }
            <div className="tile half tile-container">
                <div className="tile">
                    <div className="route-header">
                        <div className="route-info">
                            <RouteDirection 
                                departureLocation={props.departureLocation}
                                arrivalLocation={props.arrivalLocation}
                            />
                            {props.stops}
                        </div>
                        <div className="book">
                        {(role === 'owner') ? 
                            <div className="button-container">
                                <button className="btn-book" onClick={showModal}>Edytuj</button>
                                <button className="delete" onClick={props.deleteRoute}>Usuń</button>
                            </div> 
                        : (role === 'client') ?
                            <button className="btn-book" onClick={showModal}>Rezerwuj</button>
                        : (role === 'guest') ?
                            <button className="btn-book" onClick={() => history.push('/logowanie')}>Rezerwuj</button>
                        : null}
                        </div>
                    </div>
                    <div className="hours">
                        {props.hours}
                    </div>
                </div>
                <div className="tile tile-container inside">
                    <div className="tile-price">
                        <div className="price-list">
                            <div className="header">
                                <span>Normalny</span>
                                <span>Ulgowy*</span>
                            </div>
                                {props.prices}
                        </div>
                    </div>
                        <div className="tile-price">
                            <div className="note">
                                <p>*uczniowie i studenci</p>
                                <p>dzieci do lat 5: przejazd bezpłatny</p>
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
}

export default Route;
