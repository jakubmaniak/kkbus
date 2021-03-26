import React, { useEffect, useState, useContext } from 'react';
import '../styles/RoutesPage.css';
import Route from './Route';
import * as api from '../api';
import UserContext from '../contexts/User';
import { ModalLoader } from './Loader';
import Modal from './Modal';
import { fromValue } from '../helpers/from-value';

function RoutesPage() {
    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();

    let [routes, setRoutes] = useState([]);
    let [modalVisibility, setModalVisibility] = useState(false);
    let { role } = useContext(UserContext).user;

    let [departureLocation, setDepartureLocation] = useState('');
    let [arrivalLocation, setArrivalLocation] = useState('');
    let [hours, setHours] = useState('');
    let [prices, setPrices] = useState([]);
    let [stops, setStops] = useState([]);
    
    useEffect(() => {
        api.getAllRoutes()
        .then((routes) => {
            setRoutes(routes);
            setTimeout(() => {
                setLoading(false);
            }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
        });
    }, []);

    function refreshRoutes() {
        api.getAllRoutes()
        .then(setRoutes);
    }

    function deleteRoute(routeId) {
        api.deleteRoute(routeId)
        .then(() => refreshRoutes());
    }

    function addRoute() {
        if(departureLocation !== '' && arrivalLocation !== '' && stops !== '' && hours !== '' && prices !== '') {
            setModalVisibility(false);
            api.addRoute(departureLocation, arrivalLocation, stops, hours, prices, null)
            .then(() => refreshRoutes());
        }
        else {
            alert('Wypełnij wszystkie pola!');
        }
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

    return (
        <div className="routes-page">
            <ModalLoader loading={loading} />
            <div className="main">
                {role === 'owner' ? 
                    <div className="button-add-container">
                        <button onClick={() => setModalVisibility(true)}>Dodaj trasę</button>
                    </div>    
                : null}
                {routes.map((route) => (
                        <Route
                            key={route.id}
                            departureLocation={route.departureLocation}
                            arrivalLocation={route.arrivalLocation}
                            stops={route.stops.map((stop, i) => (
                                <span className="route" key={i}>
                                    <span>{stop}</span>
                                    {i < route.stops.length - 1 ? <span> - </span> : null}
                                </span>
                            ))}
                            hours={route.hours.map((hour, i) => (
                                <div key={i}>{hour}</div>
                            ))}
                            prices={[...route.stops.keys()].map((v, i, a) => a.slice(i + 1, a.length).map(w => [v, w]))
                                .flat()
                                .map(([i, j]) => (     
                                    <div className="bus-stop-price" key={i + ' ' + j}>
                                        <span className="bus-stop">{route.stops[i] + '-' + route.stops[j]}</span>
                                        <span className="price">{route.prices.slice(i, j).reduce((a, b) => a + b).toFixed(2)} zł</span>
                                        <span className="price">{(route.prices.slice(i, j).reduce((a, b) => a + b) * 0.7).toFixed(2)}zł</span>
                                    </div>
                                ))}
                            routeId={route.id}
                            allHours={route.hours}
                            stopsPrices={route.stops.reduce((a, b, i) => a.concat([route.prices[i - 1], b]), []).slice(1).join(', ')}
                            refreshRoutes={refreshRoutes}
                            deleteRoute={() => deleteRoute(route.id)}
                        />
                ))}
                <Modal visible={modalVisibility}>
                    <header>Dodawanie trasy</header>
                    <section className="content">
                        <form className="edit-route">
                            <input placeholder="Punkt startowy" onChange={fromValue(setDepartureLocation)}/>
                            <input placeholder="Punkt docelowy" onChange={fromValue(setArrivalLocation)}/>
                            <textarea placeholder="Godziny odjazdu (odzielone przecinkami)" onChange={convertHoursIntoArray}/>
                            <textarea placeholder="Przystanki (cena, przystanek, cena, przystanek...)" onChange={(ev) => convertStopsPrices(ev)}/>
                        </form>
                    </section>
                    <section className="footer">
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={addRoute}>Zapisz</button>
                    </section>
                </Modal>
            </div>
        </div>
    );
}

export default RoutesPage;