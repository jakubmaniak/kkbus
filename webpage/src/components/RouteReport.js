import React, { useEffect, useState, useContext } from 'react';
import '../styles/RouteReport.css';

import * as api from '../api';
import { routeFormatter } from '../helpers/text-formatters';
import UserContext from '../contexts/User';
import toast from '../helpers/toast';
import { fromValue } from '../helpers/from-value';

import Dropdown from './Dropdown';
import BookingCheck from './BookingCheck';

function RouteReport() {
    let [routes, setRoutes] = useState([]);
    let [stops, setStops] = useState([]);
    let [hours, setHours] = useState([]);
    let [vehicles, setVehicles] = useState([]);
    let [drivers, setDrivers] = useState([]);

    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedStop, setSelectedStop] = useState();
    let [selectedHour, setSelectedHour] = useState();
    let [selectedVehicle, setSelectedVehicle] = useState();
    let [selectedDriver, setSelectedDriver] = useState(null);
    let [amount, setAmount] = useState('');

    let [bookinglist, setBookingList] = useState([]);

    let { role } = useContext(UserContext).user;

    useEffect(() => {
        api.getAllRoutes()
            .then(setRoutes)
            .catch(api.toastifyError);

        api.getAllVehicles()
            .then(setVehicles)
            .catch(api.toastifyError);
    }, []);

    useEffect(() => {
        if(role === 'owner') {
            api.getDriverNames()
                .then(setDrivers)
                .catch(api.toastifyError);
        }
    }, [role]);

    useEffect(() => {
        if(selectedRoute) {
            setHours(selectedRoute.hours);
            setSelectedHour();
        }
    }, [selectedRoute]);

    useEffect(() => {
        let date = new Date();      

        if(selectedRoute && selectedStop && selectedHour) { //(date.getDate()).toString().padStart(2, '0') + '.' + (date.getMonth() + 1).toString().padStart(2, '0') + '.' + date.getFullYear()
            api.getRouteBookings(selectedRoute.id, '2021-05-13', selectedHour.padStart(5, '0'))
            .then((results) => setBookingList(results.filter(result => result.firstStop === selectedStop)))
            .catch(api.toastifyError);
        }
    }, [selectedRoute, selectedStop, selectedHour]);

    function handleRouteChange(route) {
        setStops(route.stops);
        setSelectedRoute(route);
    }

    function saveReport() {
        let currentAmount = parseInt(amount, 10);
        
        if(isNaN(amount) || currentAmount < 0) {
            toast.error('Wprowadzono niepoprawną liczbę osób');
            return;
        }
        if(!selectedRoute || !selectedStop || !selectedVehicle || !selectedDriver) {
            toast.error('Wprowadzone dane są niepoprawne');
            return;
        }

        api.addRouteReport(selectedRoute.id, selectedStop, selectedVehicle.id, currentAmount, selectedDriver?.id)
            .then(() => {
                setAmount('');
                toast.success('Dodano raport');
            })
            .catch(api.toastifyError);
    }

    return (
        <div className="route-report page">
            <div className="main">
                <div className="tile">
                    <h2>
                        Raport z kursu
                        {role === 'owner' ? <span style={{fontSize:"20px", color: "rgb(217 180 48)"}}> (dla kierowców)</span> : null}
                    </h2>
                    <form className="report">
                        <div className="row">
                            <Dropdown
                                items={routes}
                                textFormatter={routeFormatter}
                                placeholder="Wybierz trasę"
                                handleChange={handleRouteChange} 
                            />
                            <Dropdown
                                items={stops}
                                placeholder="Wybierz przystanek" 
                                handleChange={setSelectedStop}
                            />
                        </div>
                        <div className="row">
                            <Dropdown
                                items={hours}
                                placeholder="Wybierz godzinę" 
                                handleChange={setSelectedHour}
                            />
                            <Dropdown
                                items={vehicles}
                                textFormatter={({ brand, model, year }) => brand + ' ' + model + ' ' + year}
                                placeholder="Wybierz pojazd" 
                                handleChange={setSelectedVehicle} 
                            />
                       </div>
                       <div className="row">
                            {role === 'owner' ? 
                                <Dropdown
                                    items={drivers}
                                    textFormatter={({ firstName, lastName }) => firstName + ' ' + lastName}
                                    placeholder="Wybierz kierowcę" 
                                    handleChange={setSelectedDriver} 
                                />
                            : null}
                            <input placeholder="Liczba osób" value={amount} onChange={fromValue(setAmount)} />
                        </div>
                        <div className="submit-container">
                            <button className="submit" type="button" onClick={saveReport}>Zapisz raport</button>
                        </div>
                    </form>
                </div>
                <div className="tile">
                    <h2>Zaznacz zrealizowane rezerwacje</h2>
                    <div className="booking-check">
                        <span>Nr rezerwacji</span>
                        <span>Imię</span>
                        <span>Nazwisko</span>
                        <span>Normalne</span>
                        <span>Ulgowe</span>
                        <span>Dzieci do lat 5</span>
                        <span></span>
                    </div>
                    {bookinglist.map((booking) => {
                        return (
                            <BookingCheck 
                                id={booking.id}
                                firstName={booking.firstName}
                                lastName={booking.lastName}
                                normalTickets={booking.normalTickets}
                                reducedTickets={booking.reducedTickets}
                                childTickets={booking.childTickets}
                                toggleBooking={(ev) => console.log(ev.target.value)}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RouteReport;
