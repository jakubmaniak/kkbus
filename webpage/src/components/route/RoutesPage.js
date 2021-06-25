import React, { useEffect, useState, useContext } from 'react';
import '../../styles/RoutesPage.css';

import * as api from '../../api';

import UserContext from '../../contexts/User';
import { fromValue } from '../../helpers/from-value';
import toast from '../../helpers/toast';

import { ModalLoader } from '../Loader';
import Modal from '../modals/Modal';
import Route from './Route';


function RoutesPage() {
    let [loading, setLoading] = useState(true);
    let [modalVisibility, setModalVisibility] = useState(false);

    let [routes, setRoutes] = useState([]);
    let [departureLocation, setDepartureLocation] = useState('');
    let [arrivalLocation, setArrivalLocation] = useState('');
    let [hours, setHours] = useState([]);
    let [prices, setPrices] = useState([]);
    let [stops, setStops] = useState([]);
    let [distances, setDistances] = useState([]);

    let { role } = useContext(UserContext).user;
    
    useEffect(() => {
        api.getAllRoutes()
            .then((routes) => {
                setRoutes(routes);
                setLoading(false);
            })
            .catch(api.toastifyError);
    }, []);

    function refreshRoutes() {
        api.getAllRoutes()
            .then(setRoutes)
            .catch(api.toastifyError);
    }

    function deleteRoute(routeId) {
        api.deleteRoute(routeId)
            .then(() => {
                refreshRoutes();
                toast.success('Usunięto trasę');
            })
            .catch(api.toastifyError);
    }

    function addRoute() {
        if(departureLocation !== '' && arrivalLocation !== '') {
            setModalVisibility(false);

            api.addRoute(departureLocation, arrivalLocation, stops, hours, prices, distances, null)
                .then(() => {
                    toast.success('Dodano trasę');
                    refreshRoutes();
                })
                .catch(api.toastifyError);
        }
        else {
            toast.error('Wybierz punkt początkowy i końcowy!');
        }
    }

    function convertHoursIntoArray(ev) {
        let text = ev.target.value;

        if (text.trim() === '') {
            return setHours([]);
        }

        setHours(text.split(',').map((e) => e.trim()));
    }

    function convertStopsPrices(ev) {
        let parts = ev.target.value.split(',').map((e) => e.trim());

        setStops(parts.filter((e, i) => i % 2 === 0));
        setPrices(parts.filter((e, i) => i % 2 === 1).map(parseFloat));   
    }

    function convertStopsDistances(ev) {
        let text = ev.target.value;

        if (text.trim() === '') {
            return setDistances([]);
        }

        setDistances(text.split(',').map((e) => parseFloat(e.trim())));
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
                            route={route}
                            departureLocation={route.departureLocation}
                            arrivalLocation={route.arrivalLocation}
                            stops={route.stops.map((stop, i) => (
                                <span className="stop" key={i}>
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
                            stopsDistances={route.distances}
                            refreshRoutes={refreshRoutes}
                            deleteRoute={() => deleteRoute(route.id)}
                        />
                ))}
                <div className="note">
                    <p>* uczniowie i studenci</p>
                    <p>dzieci do lat 5: przejazd bezpłatny</p>
                </div>
                <Modal visible={modalVisibility}>
                    <header>Dodawanie trasy</header>
                    <section className="content">
                        <form className="edit-route" onSubmit={(ev) => {ev.preventDefault(); addRoute()}}>
                            <input placeholder="Punkt startowy" value={departureLocation} onChange={fromValue(setDepartureLocation)}/>
                            <input placeholder="Punkt docelowy" value={arrivalLocation} onChange={fromValue(setArrivalLocation)}/>
                            <textarea placeholder="Godziny odjazdu (odzielone przecinkami)" onChange={convertHoursIntoArray}/>
                            <textarea
                                placeholder="Przystanki (cena, przystanek, cena, przystanek...)"
                                onChange={convertStopsPrices}
                            />
                            <textarea
                                placeholder="Odległości między przystankami (oddzielone przecinkami)"
                                onChange={convertStopsDistances}
                            />
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