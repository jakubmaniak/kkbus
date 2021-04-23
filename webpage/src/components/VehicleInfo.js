import React, { useEffect, useState } from 'react';

import * as api from '../api';
import Vehicle from './Vehicle';
import { fromValue } from '../helpers/from-value';
import { routeFormatter } from '../helpers/text-formatters';

import '../styles/VehicleInfo.css';
import Modal from './Modal';
import DropdownMultiple from './DropdownMultiple';
import Dropdown from './Dropdown';
import { ModalLoader } from './Loader';

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

    let [selectedState, setSelectedState] = useState('');
    let [selectedParking, setSelectedParking] = useState('');
    let [selectedRoutes, setSelectedRoutes] = useState('');

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
        .catch(api.errorAlert);

        api.getAllRoutes()
        .then((results) => {
            setRoutes(results);
        })
        .catch(api.errorAlert);
    }

    function deleteVehicle(vehicleId) {
        console.log(vehicleId);
        api.deleteVehicle(vehicleId)
        .then(() => {
            updateVehicle();
        })
        .catch(api.errorAlert);;
    }

    function addVehicle() {
        if(brand !== '' && model !== '' && year !== '' && plate !== '' && mileage !== '' && seats !== '' 
            && selectedState !== '' && selectedParking !== '' && selectedRoutes !== '') {
            if(!isNaN(parseInt(year)) && !isNaN(parseInt(seats)) && !isNaN(parseInt(mileage))) {
                setModalAddVehicleVisibility(false);
                
                let currentRoutes = [];
                currentRoutes = selectedRoutes.map((route) => route.id);

                api.addVehicle(brand, model, parseInt(year), parseInt(seats), plate, parseInt(mileage), selectedState, selectedParking, currentRoutes)
                .then(() => {
                    updateVehicle();
                })
                .catch(api.errorAlert);
            }
            else {
                alert('Nieprawidłowy typ danych');
            }
        }
        else {
            alert('Wypełnij wszystkie pola');
        }
    }

    return (
        <div className="vehicle-info-page page">
            <ModalLoader loading={loading} />
            <div className="main">
                <div className="button-add-container">
                    <button onClick={() => setModalAddVehicleVisibility(true)}>Dodaj pojazd</button>
                </div>
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
                            routeIds={vehicle.routeIds}
                            mileage={vehicle.mileage}
                            combustion={vehicle.combustion}
                            updateVehicle={updateVehicle}
                            deleteVehicle={() => deleteVehicle(vehicle.id)}
                            // currentDriver={vehicle.currentDriver}
                        />
                    );
                })}
            </div>
            <Modal visible={modalAddVehicleVisibility}>
                <header>Dodawanie pojazdu</header>
                <section className="content">
                    <form className="vehicle-edit">
                        <div className="input-container"> 
                            <input placeholder="Marka" onChange={fromValue(setBrand)}/>
                            <input placeholder="Model" onChange={fromValue(setModel)}/>
                        </div>
                       <div className="input-container">
                            <input placeholder="Rocznik" onChange={fromValue(setYear)}/>
                            <input placeholder="Przebieg" onChange={fromValue(setMileage)}/>
                       </div>
                        <div className="input-container">
                            <input placeholder="Rejestracja" onChange={fromValue(setPlate)}/>
                            <input placeholder="Ilość miejsc" onChange={fromValue(setSeats)}/>
                        </div>
                        <Dropdown 
                            placeholder="Aktualny stan pojazdu"
                            items={state}
                            handleChange={setSelectedState}
                        />
                        <Dropdown 
                            placeholder="Miejsce stałego parkowania"
                            items={parking}
                            handleChange={setSelectedParking}
                        />
                        <DropdownMultiple 
                            placeholder="Dostępne trasy dla pojazdów"
                            items={routes}
                            selectedItems={selectedRoutes}
                            textFormatter={routeFormatter}
                            handleSelect={(item, items) => console.log('select', items)}
                            handleUnselect={(item, items) => console.log('unselect', items)}
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
