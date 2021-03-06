import React, { useEffect, useRef, useState, useContext  } from 'react';
import '../../styles/VehicleInfo.css';

import * as api from '../../api';

import { fromValue } from '../../helpers/from-value';
import { routeFormatter } from '../../helpers/text-formatters';
import toast from '../../helpers/toast';
import UserContext from '../../contexts/User';

import Vehicle from './Vehicle';
import Modal from '../modals/Modal';
import DropdownMultiple from '../dropdowns/DropdownMultiple';
import Dropdown from '../dropdowns/Dropdown';
import { ModalLoader } from '../Loader';

function VehicleInfo() {
    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();
    
    let [vehicles, setVehicles] = useState([]);
    let [modalAddVehicleVisibility, setModalAddVehicleVisibility] = useState(false);

    let [brand, setBrand] = useState('');
    let [model, setModel] = useState('');
    let [year, setYear] = useState('');
    let [mileage, setMileage] = useState('');
    let [plate, setPlate] = useState('');
    let [seats, setSeats] = useState('');

    let [state, setState] = useState(['Aktywny', 'Nieaktywny', 'W naprawie']);
    let [parking, setParking] = useState(['Parking nr 1', 'Parking nr 2']);
    let [routes, setRoutes] = useState([]);

    let routesRef = useRef(routes);

    let [selectedState, setSelectedState] = useState('');
    let [selectedParking, setSelectedParking] = useState('');
    let [selectedRoutes, setSelectedRoutes] = useState('');

    let { role } = useContext(UserContext).user;

    useEffect(() => {
        updateVehicle();
    }, []);

    useEffect(() => {
        setBrand('');
        setModel('');
        setYear('');
        setPlate('');
        setMileage('');
        setSeats('');
        setSelectedState('');
        setSelectedParking('');
        setSelectedRoutes('');
    }, [modalAddVehicleVisibility]);

    function updateVehicle() {
        api.getAllVehicles()
        .then((results) => {
            setVehicles(results);

            setTimeout(() => {
                setLoading(false);
            }, Math.max(0, 1000 - (Date.now() - loadingInitTime)));
        })
        .catch(api.toastifyError);

        api.getAllRoutes()
        .then((results) => {
            setRoutes(results);
            routesRef.current = results;
        })
        .catch(api.toastifyError);
    }

    function deleteVehicle(vehicleId) {
        api.deleteVehicle(vehicleId)
        .then(() => {
            updateVehicle();
            toast.success('Usuni??to pojazd');
        })
        .catch(api.toastifyError);
    }

    function areFieldsEmpty() {
        return [brand, model, year, mileage, plate, seats]
            .some((value) => value.toString().trim() === '');
    }

    function addVehicle() {
        if (areFieldsEmpty()) {
            toast.error('Wype??nij wszystkie pola');
            return;
        }

        let currentYear = parseInt(year);
        let currentMileage = parseInt(mileage);
        let currentSeats = parseInt(seats);

        if (isNaN(currentYear) || isNaN(currentMileage) || isNaN(currentSeats)) {
            toast.error('Nieprawid??owy typ wprowadzonych danych');
            return;
        }
        
        if (currentSeats <= 0) {
            toast.error('Pojazd nie mo??e mie?? mniej ni?? 1 miejsce');
            return;
        }

        let currentRoutes = selectedRoutes.map((route) => route.id);

        api.addVehicle(brand, model, currentYear, currentSeats, plate, currentMileage, selectedState, selectedParking, currentRoutes)
        .then(() => {
            updateVehicle();
            setModalAddVehicleVisibility(false);
            toast.success('Dodano pojazd');
        })
        .catch(api.toastifyError);
    }

    return (
        <div className="vehicle-info-page page">
            <ModalLoader loading={loading} />
            <div className="main">
                {role === 'owner' ? 
                    <div className="button-add-container">
                        <button onClick={() => setModalAddVehicleVisibility(true)}>Dodaj pojazd</button>
                    </div>
                : null}
                {vehicles.map((vehicle) => {
                    return (
                        <Vehicle key={vehicle.id}
                            vehicleId={vehicle.id}
                            plate={vehicle.plate}
                            model={vehicle.model}
                            brand={vehicle.brand}
                            year={vehicle.year}
                            state={vehicle.state}
                            parking={vehicle.parking}
                            seats={vehicle.seats}
                            routes={routesRef}
                            routeIds={vehicle.routeIds}
                            mileage={vehicle.mileage}
                            combustion={vehicle.combustion}
                            updateVehicle={updateVehicle}
                            deleteVehicle={() => deleteVehicle(vehicle.id)}
                        />
                    );
                })}
            </div>
            <Modal visible={modalAddVehicleVisibility}>
                <header>Dodawanie pojazdu</header>
                <section className="content">
                    <form className="vehicle-edit" onSubmit={(ev) => {ev.preventDefault(); addVehicle()}}>
                        <div className="input-container"> 
                            <input placeholder="Marka" value={brand} onChange={fromValue(setBrand)}/>
                            <input placeholder="Model" value={model} onChange={fromValue(setModel)}/>
                        </div>
                       <div className="input-container">
                            <input placeholder="Rocznik" value={year} onChange={fromValue(setYear)}/>
                            <input placeholder="Przebieg" value={mileage} onChange={fromValue(setMileage)}/>
                       </div>
                        <div className="input-container">
                            <input placeholder="Rejestracja" value={plate} onChange={fromValue(setPlate)}/>
                            <input placeholder="Ilo???? miejsc" value={seats} onChange={fromValue(setSeats)}/>
                        </div>
                        <Dropdown 
                            placeholder="Aktualny stan pojazdu"
                            items={state}
                            handleChange={setSelectedState}
                        />
                        <Dropdown 
                            placeholder="Miejsce sta??ego parkowania"
                            items={parking}
                            handleChange={setSelectedParking}
                        />
                        <DropdownMultiple 
                            placeholder="Dost??pne trasy dla pojazd??w"
                            items={routes}
                            selectedItems={selectedRoutes}
                            textFormatter={routeFormatter}
                            handleChange={setSelectedRoutes}
                        />
                    </form>
                </section>
                <section className="footer">
                    <button onClick={() => setModalAddVehicleVisibility(false)}>Anuluj</button>
                    <button onClick={() => addVehicle()}>Zapisz</button>
                </section>
            </Modal>
        </div>
    );
}

export default VehicleInfo;
