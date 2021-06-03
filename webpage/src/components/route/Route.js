import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

import '../../styles/RoutesPage.css';

import { fromValue } from '../../helpers/from-value';
import toast from '../../helpers/toast';
import UserContext from '../../contexts/User';

import * as api from '../../api';

import RouteDirection from './RouteDirection';
import Modal from '../modals/Modal';
import Dropdown from '../dropdowns/Dropdown';
import NotificationModal from '../modals/NotificationModal';


function Route(props) {
    let { role } = useContext(UserContext).user;

    let [modalVisibility, setModalVisibility] = useState(false);
    let [modalDeleteRewardVisibility, setModalDeleteRewardVisibility] = useState(false);

    let [departureLocation, setDepartureLocation] = useState(props.departureLocation);
    let [arrivalLocation, setArrivalLocation] = useState(props.arrivalLocation);

    let [dates, setDates] = useState([]);
    let [hours, setHours] = useState([]);
    let [prices, setPrices] = useState([]);
    let [distances, setDistances] = useState([]);
    let [stops, setStops] = useState([]);
    let [normalTickets, setNormalTickets] = useState(0);
    let [reducedTickets, setReducedTickets] = useState(0);
    let [childTickets, setChildTickets] = useState(0);

    let [selectedDate, setSelectedDate] = useState();
    let [selectedHour, setSelectedHour] = useState();
    let [selectedFirstStop, setSelectedFirstStop] = useState();
    let [selectedLastStop, setSelectedLastStop] = useState();
    let [price, setPrice] = useState(0);

    let history = useHistory();

    useEffect(() => { 
        setDistances(props.stopsDistances);
        setPrices(props.stopsPrices.split(',').map((e) => e.trim()).filter((e, i) => i % 2 === 1).map(parseFloat));
        setStops(props.stopsPrices.split(',').map((e) => e.trim()).filter((e, i) => i % 2 === 0));
    }, []);

    useEffect(() => { 
        setHours([...props.allHours]);

        if (props.allHours.length === 0) return;

        let dates = new Array(8).fill(null).map((d, i) => {
            let date = dayjs().tz('Europe/Warsaw').startOf('minute').add(i, 'day');
            return [date.format('YYYY-MM-DD'), date.format('DD.MM.YYYY'), date];
        });

        let now = dayjs().tz('Europe/Warsaw').startOf('minute');

        let [firstHour, firstHourMinutes] = props.allHours[0].split(':');
        let firstDeparture = now
            .set('hour', parseInt(firstHour))
            .set('minute', parseInt(firstHourMinutes));

        if (firstDeparture.diff(now, 'minutes') < 120) {
            setDates(dates.slice(1));
        }
        else {
            setDates(dates);
        }
    }, [props.allHours]);

    useEffect(() => {
        setSelectedDate(null);
        setSelectedHour(null);
        setNormalTickets('');
        setChildTickets('');
        setReducedTickets('');
        setSelectedFirstStop(null);
        setSelectedLastStop(null); 
    }, [modalVisibility])

    useEffect(() => {
        let currentPrice = calculatePrice(props.route, selectedFirstStop, selectedLastStop, normalTickets, reducedTickets);
        setPrice((isNaN(currentPrice) || currentPrice === null) ? 0 : currentPrice.toFixed(2));
    }, [normalTickets, reducedTickets, selectedFirstStop, selectedLastStop]);

    function showModal() {
        setModalVisibility(true);
    }

    function updateRoute() {
        setModalVisibility(false);

        api.updateRoute(props.routeId, departureLocation, arrivalLocation, stops, hours, prices, distances, null)
            .then(() => {
                props.refreshRoutes();
                toast.success('Zmieniono dane trasy');
            })
            .catch(api.toastifyError);
    }

    function convertHoursIntoArray(ev) {
        let string = ev.target.value;
        let array = string.split(',').map((element) => element.trim());
        setHours(array);
    }

    function convertStopsPrices(ev) {
        let parts = ev.target.value.split(',').map((e) => e.trim());
        setStops(parts.filter((e, i) => i % 2 === 0));
        setPrices(parts.filter((e, i) => i % 2 === 1).map(parseFloat));   
    }

    function convertStopsDistances(ev) {
        setDistances(ev.target.value.split(',').map((e) => parseFloat(e.trim())));
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

    function addBooking() {
        if (selectedFirstStop === selectedLastStop) {
            toast.error('Nie możesz wybrać takich samych przystanków');
            return;
        }

        if (!selectedDate || !selectedHour) {
            toast.error('Nie wybrano daty lub godziny');
            return null;
        }

        let tickets = {
            normal: normalTickets.trim() === '' ? 0 : parseInt(normalTickets, 10),
            reduced: reducedTickets.trim() === '' ? 0 : parseInt(reducedTickets, 10),
            child: childTickets.trim() === '' ? 0 : parseInt(childTickets, 10)
        };

        if (isNaN(tickets.normal) || isNaN(tickets.reduced) || isNaN(tickets.child)) {
            toast.error('Wprowadzano niepoprawną liczbę biletów');
            return null;
        }

        api.addBooking(props.routeId, selectedDate[0], selectedHour, tickets.normal, tickets.reduced, tickets.child, selectedFirstStop, selectedLastStop)
        .then(() => {
            setModalVisibility(false);
            toast.success('Dodano rezerwację');
        })
        .catch((err) => {
            if (err.message === 'too_late') {
                toast.error('Nie można składać rezerwacji później niż 24 godziny przed wyjazdem');
            }
            else api.toastifyError(err);
        });
    }

    function clientModal() {
        return (
            <Modal visible={modalVisibility}>
                <header>Rezerwacja</header>
                <section className="content">
                    <form className="book-route" onSubmit={(ev) => {ev.preventDefault(); addBooking();}}>
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
                        <input placeholder="Liczba osób objętych biletem normalnym" value={normalTickets} onChange={fromValue(setNormalTickets)}/>
                        <input placeholder="Liczba osób objętych biletem ulgowym" value={reducedTickets} onChange={fromValue(setReducedTickets)}/>
                        <input placeholder="Liczba dzieci do lat 5" value={childTickets} onChange={fromValue(setChildTickets)}/>
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
                    <form className="edit-route" onSubmit={(ev) => {ev.preventDefault(); updateRoute()}}>
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
                        <textarea placeholder="Odległości między przystankami (oddzielone przecinkami)"
                            defaultValue={props.stopsDistances}
                            onChange={convertStopsDistances}
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
                            <div className="stops">
                                {props.stops}
                            </div>
                        </div>
                        <div className="book">
                        {(role === 'owner') ? 
                            <div className="button-container">
                                <button className="btn-book" onClick={showModal}>Edytuj</button>
                                <button className="delete" onClick={() => setModalDeleteRewardVisibility(true)}>Usuń</button>
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
                </div>
            </div>
            <NotificationModal 
                visible={modalDeleteRewardVisibility}
                header={'Usuwanie trasy'}
                name={'usunąć trasę'}
                notificationModalExit={() => setModalDeleteRewardVisibility(false)}
                delete={() => props.deleteRoute()}
            />
        </>
    );
}

export default Route;
