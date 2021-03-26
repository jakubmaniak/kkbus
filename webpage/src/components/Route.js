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
    let [hours, setHours] = useState(props.hours);
    let [prices, setPrices] = useState([]);
    let [stops, setStops] = useState([]);

    let history = useHistory();

    useEffect(() => { 
        setPrices(props.stopsPrices.split(',').map((e) => e.trim()).filter((e, i) => i % 2 == 1).map(parseFloat));
        setStops(props.stopsPrices.split(',').map((e) => e.trim()).filter((e, i) => i % 2 == 0));
    }, []);


    function showModal() {
        setModalVisibility(true);
    }

    function updateRoute() {
        setModalVisibility(false);
        console.log(props.routeId, departureLocation, arrivalLocation, stops, hours, prices, null);
        api.updateRoute(props.routeId, departureLocation, arrivalLocation, stops, hours, prices, null);
        props.refreshRoutes();
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

    function clientModal() {
        return (
            <Modal visible={modalVisibility}>
                <header>Rezerwacja</header>
                <section className="content">
                    <form className="book-route">
                        <Dropdown placeholder="Godzina"/>
                        <input placeholder="Liczba osób objętych biletem normalnym"/>
                        <input placeholder="Liczba osób objętych biletem ulgowym"/>
                        <input placeholder="Liczba dzieci do lat 5"/>
                        <Dropdown placeholder="Przystanek początkowy"/>
                        <Dropdown placeholder="Przystanek końcowy"/>
                    </form>
                </section>
                <section className="footer reserve">
                    <div>
                        <p>Koszt rezerwacji: 200zł</p>
                    </div>
                    <div>
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={() => setModalVisibility(false)}>Zapisz</button>
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
