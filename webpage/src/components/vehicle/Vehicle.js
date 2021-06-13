import React, { useState, useContext, useEffect } from 'react';
import '../../styles/VehicleInfo.css';

import * as api from '../../api';

import { fromValue} from '../../helpers/from-value';
import { routeFormatter } from '../../helpers/text-formatters';
import toast from '../../helpers/toast';

import Modal from '../modals/Modal';
import UserContext from '../../contexts/User';
import Dropdown from '../dropdowns/Dropdown';
import DropdownMultiple from '../dropdowns/DropdownMultiple';
import NotificationModal from '../modals/NotificationModal';

function Vehicle(props) {
    let { role } = useContext(UserContext).user;
    let [modalDetailsVisibility, setModalDetailsVisibility] = useState(false);
    let [modalEditVehicleVisibility, setModalEditVehicleVisibility] = useState(false);
    let [modalDeleteVehicleVisibility, setModalDeleteVehicleVisibility] = useState(false);
    
    let [brand, setBrand] = useState(props.brand);
    let [model, setModel] = useState(props.model);
    let [year, setYear] = useState(props.year);
    let [mileage, setMileage] = useState(props.mileage);
    let [plate, setPlate] = useState(props.plate);
    let [seats, setSeats] = useState(props.seats);

    let [state, setState] = useState(['Aktywny', 'Nieaktywny', 'W naprawie']);
    let [parking, setParking] = useState(['Parking nr 1', 'Parking nr 2']);
    let [departureArrivalLocations, setDepartureArrivalLocations] = useState([]);

    let [selectedState, setSelectedState] = useState(props.state);
    let [selectedParking, setSelectedParking] = useState(props.parking);
    let [selectedRoutes, setSelectedRoutes] = useState([]);

    useEffect(() => {
        let routeMap = props.routes.current.reduce((a, b) => (a[b.id] = b) && a, { });
        
        setDepartureArrivalLocations(props.routeIds.map((routeId) => {
            let route = routeMap[routeId];

            if (!route) {
                return '...';
            }

            return route.arrivalLocation + ' - ' + route.departureLocation;
        }));

        setSelectedRoutes(props.routeIds.map((routeId) => routeMap[routeId]));
    }, [props.routes.current, props.routeIds]);
    
    function areFieldsEmpty() {
        return [brand, model, year, mileage, plate, seats]
            .some((value) => value.toString().trim() === '');
    }

    function editVehicle(vehicleId) {
        if (areFieldsEmpty()) {
            toast.error('Wypełnij wszystkie pola!');
            return;
        }

        let currentYear = (year !== props.year ? parseInt(year) : props.year);
        let currentMileage = (mileage !== props.mileage ? parseInt(mileage) : props.mileage);
        let currentSeats = (seats !== props.seats ? parseInt(seats) : props.seats);

        if (isNaN(currentYear) || isNaN(currentMileage) || isNaN(currentSeats)) {
            toast.error('Nieprawidłowy typ wprowadzonych danych');
            return;
        }

        if (currentSeats <= 0) {
            toast.error('Pojazd nie może mieć mniej niż 1 miejsce');
            return;
        }

        let currentRoutes = selectedRoutes.map((route) => route.id);

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
        .then(() => {
            props.updateVehicle();
            setModalEditVehicleVisibility(false);
            toast.success('Zmieniono dane pojazdu');
        })
        .catch(api.toastifyError);
    }

    function editDataModal() {
        return (
            <Modal visible={modalEditVehicleVisibility}>
                <header>Edycja danych pojazdu</header>
                <section className="content">
                    <form className="vehicle-edit" onSubmit={(ev) => {ev.preventDefault(); editVehicle(props.vehicleId);}}>
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
                            items={props.routes.current}
                            selectedItems={selectedRoutes}
                            textFormatter={routeFormatter}
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
                            <button className="delete" onClick={() => setModalDeleteVehicleVisibility(true)}>Usuń</button>
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
                        <span>{props.mileage} KM</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Średnie spalanie:</span>
                        <span>{props.combustion} L/100 KM</span>
                    </div>
                </section>
                <section className="footer">
                    <button onClick={() => setModalDetailsVisibility(false)}>Zamknij</button>
                </section>
            </Modal>
            <NotificationModal 
                visible={modalDeleteVehicleVisibility}
                header="Usuwanie pojazdu"
                name="usunąć pojazd"
                notificationModalExit={() => setModalDeleteVehicleVisibility(false)}
                delete={() => props.deleteVehicle()}
            />
            {role === 'owner' ? editDataModal() : null}
        </div>
    );
}

export default Vehicle;
