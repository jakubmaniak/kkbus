import React, { useState, useContext, useEffect } from 'react';

import '../styles/VehicleInfo.css';

import * as api from '../api';
import { fromValue} from '../helpers/from-value';
import { routeFormatter } from '../helpers/text-formatters';
import Modal from './Modal';
import UserContext from '../contexts/User';
import Dropdown from './Dropdown';
import DropdownMultiple from './DropdownMultiple';
import NotificationModal from './NotificationModal';

function Vehicle(props) {
    let { role } = useContext(UserContext).user;
    let [modalDetailsVisibility, setModalDetailsVisibility] = useState(false);
    let [modalEditVehicleVisibility, setModalEditVehicleVisibility] = useState(false);
    let [modalDeleteVehicleVisibility, setModalDeleteVehicleVisibility] = useState(false);
    let [modalChangeDriverVisibility, setModalChangeDriverVisibility] = useState(false);
    
    let [brand, setBrand] = useState(props.brand);
    let [model, setModel] = useState(props.model);
    let [year, setYear] = useState(props.year);
    let [mileage, setMileage] = useState(props.mileage);
    let [plate, setPlate] = useState(props.plate);
    let [seats, setSeats] = useState(props.seats);
    
    let [state, setState] = useState(['Aktywny', 'Nieaktywny', 'W naprawie']);
    let [parking, setParking] = useState(['Parking nr 1', 'Parking nr 2']);
    let [routes, setRoutes] = useState([]);
    let [departureArrivalLocations, setDepartureArrivalLocations] = useState([]);

    let [selectedState, setSelectedState] = useState(props.state);
    let [selectedParking, setSelectedParking] = useState(props.parking);
    let [selectedRoutes, setSelectedRoutes] = useState(props.route);

    useEffect(() => {
        api.getAllRoutes()
        .then((results) => {
            setRoutes(results);
            let availableRoutes = [];
            availableRoutes = props.routeIds.map((routeId) => results.find((({id}) => id === routeId)));
            setDepartureArrivalLocations(availableRoutes.map((avaibleRoute) => avaibleRoute.departureLocation + ' - ' + avaibleRoute.arrivalLocation));
        })
        .catch(api.errorAlert);
    }, [props.routeIds]);

    function editVehicle(vehicleId) {
        setModalEditVehicleVisibility(false);

        //sprzwdzanie czy nie ma pustych pol
        if(brand !== '' && model !== '' && year !== '' && mileage !== '' && plate !== '' && seats !== '') {
            //sprawdzenie czy pola liczbowe sa liczbami
            if(!isNaN(parseInt(year)) && !isNaN(parseInt(seats)) && !isNaN(parseInt(mileage))) {
                    let currentYear = year !== props.year ? parseInt(year) : props.year;
                    let currentMileage = mileage !== props.mileage ? parseInt(mileage) : props.mileage;
                    let currentSeats = seats !== props.seats ? parseInt(seats) : props.seats;
                    let currentRoutes = [];
                    currentRoutes = selectedRoutes.map((route) => route.id);

                    api.updateVehicle(
                        vehicleId,
                        brand,
                        model, 
                        currentYear, 
                        currentSeats, 
                        plate, 
                        currentMileage,
                        selectedState,
                        selectedParking,
                        currentRoutes
                        )
                    .then(() => 
                        props.updateVehicle()
                    );
            }
            else {
                alert('Nieprawidłowy typ danych');
            }
        }
        else {
            alert('Wypełnij wszystkie pola!');
        }        
    }

    function editDataModal() {
        return (
            <Modal visible={modalEditVehicleVisibility}>
                <header>Edycja danych pojazdu</header>
                <section className="content">
                    <form className="vehicle-edit">
                        <div className="input-container"> 
                            <input placeholder="Marka" defaultValue={props.brand} onChange={fromValue(setBrand)}/>
                            <input placeholder="Model" defaultValue={props.model} onChange={fromValue(setModel)}/>
                        </div>
                       <div className="input-container">
                            <input placeholder="Rocznik" defaultValue={props.year} onChange={fromValue(setYear)}/>
                            <input placeholder="Przebieg" defaultValue={props.mileage} onChange={fromValue(setMileage)}/>
                       </div>
                        <div className="input-container">
                            <input placeholder="Rejestracja" defaultValue={props.plate} onChange={fromValue(setPlate)}/>
                            <input placeholder="Ilość miejsc" defaultValue={props.seats} onChange={fromValue(setSeats)}/>
                        </div>
                        <Dropdown 
                            placeholder="Aktualny stan pojazdu"
                            items={state}
                            selectedIndex={state.indexOf(props.state)}
                            handleChange={setSelectedState}
                        />
                        <Dropdown 
                            placeholder="Miejsce stałego parkowania"
                            items={parking}
                            selectedIndex={parking.indexOf(props.parking)}
                            handleChange={setSelectedParking}
                        />
                        <DropdownMultiple 
                            placeholder="Dostępne trasy dla pojazdów"
                            selectedItems={selectedRoutes}
                            items={routes}
                            textFormatter={routeFormatter}
                            handleSelect={(item, items) => console.log('select', items)}
                            handleUnselect={(item, items) => console.log('unselect', items)}
                            handleChange={setSelectedRoutes}
                        />
                    </form>
                </section>
                <section className="footer">
                    <button onClick={() => setModalEditVehicleVisibility(false)}>Anuluj</button>
                    <button onClick={() => editVehicle(props.vehicleId)}>Zapisz</button>
                </section>
            </Modal>
        );
    }

    function changeDriverModal() {
        return (
            <Modal visible={modalChangeDriverVisibility}>
                <header>Zmiana kierowcy</header>
                <section className="content">
                        <Dropdown placeholder="Aktualny kierowca"/>
                </section>
                <section className="footer">
                    <button onClick={() => setModalChangeDriverVisibility(false)}>Anuluj</button>
                    <button onClick={() => setModalChangeDriverVisibility(false)}>Zapisz</button>
                </section>
            </Modal>
        );
    }

    
    function setDetartureArrivalLocations(routeIds) {
        
    }

    return (
        <div className="vehicle-item">
            <div className="tile half">
                <h2>{props.brand} {props.model} {props.year}</h2>
                <div className="vehicle-info">
                    <span>Stan pojazdu</span>
                    <span>{props.state}</span>
                </div>
                <div className="vehicle-info">
                    <span>Miejsce stałego parkowania</span>
                    <span>{props.parking}</span>
                </div>
                <div className="vehicle-info route-info-container">
                    <span>Dostępność tras</span>
                    <div className="available-routes-container">
                        {departureArrivalLocations.map((location, i) => {
                                return (
                                    <p key={i}>{location}</p>
                                );
                            })}
                    </div>
                </div>
                <div className="details">
                    <button onClick={() => setModalDetailsVisibility(true)}>Szczegóły</button>
                    {role === 'owner' ? 
                        <div className="vehicle-edit-button">
                            <button onClick={() => {setModalEditVehicleVisibility(true)}}>Edytuj dane</button>
                            <button onClick={() => {setModalChangeDriverVisibility(true)}}>Zmień kierowcę</button>
                            <button className="delete" onClick={() => setModalDeleteVehicleVisibility(true)}>Usuń</button>
                        </div>   
                    : role === 'office' ?
                    <div className="vehicle-edit-button">
                        <button onClick={() => {setModalChangeDriverVisibility(true)}}>Zmień kierowcę</button>
                    </div>
                    : null}
                </div>
            </div>
            <Modal visible={modalDetailsVisibility}>
                <header>Szczegóły pojazdu</header>
                <section className="content">
                    <div className="vehicle-info">
                        <span>Rejestracja:</span>
                        <span>{props.plate}</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Ilość miejsc:</span>
                        <span>{props.seats}</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Przebieg:</span>
                        <span>{props.mileage}</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Średnie spalanie:</span>
                        <span>{props.combustion}</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Aktualny kierowca:</span>
                        <span>{props.currentDriver}</span>
                    </div>
                </section>
                <section className="footer">
                    <button onClick={() => setModalDetailsVisibility(false)}>Zamknij</button>
                </section>
            </Modal>
            <NotificationModal 
                visible={modalDeleteVehicleVisibility}
                header={'Usuwanie pojazdu'}
                name={'pojazd'}
                notificationModalExit={() => setModalDeleteVehicleVisibility(false)}
                delete={() => props.deleteVehicle()}
            />
            {role === 'owner' ? editDataModal() : null}
            {role === 'owner' || role === 'office' ? changeDriverModal() : null} 
        </div>
    );
}

export default Vehicle;
