import React, { useEffect, useState } from 'react';

import * as api from '../api';
import Vehicle from './Vehicle';
import { fromValue } from '../helpers/from-value';

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

    let [selectedState, setSelectedState] = useState('');
    let [selectedParking, setSelectedParking] = useState('');

    useEffect(() => {
        updateVehicle();
    }, []);

    function updateVehicle() {
        api.getAllVehicles()
        .then((results) => {
            setVehicles(results);
            setTimeout(() => {
                setLoading(false);
            }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
        });
    }

    function deleteVehicle(vehicleId) {
        console.log(vehicleId);
        api.deleteVehicle(vehicleId).then(() => {
            updateVehicle();
        });
    }

    function addVehicle() {
        if(brand !== '' && model !== '' && year !== '' && plate !== '' && mileage !== '' && seats !== '' && selectedState !== '' && selectedParking !== '') {
            if(!isNaN(parseInt(year)) && !isNaN(parseInt(seats)) && !isNaN(parseInt(mileage))) {
                setModalAddVehicleVisibility(false);
                api.addVehicle(brand, model, parseInt(year), parseInt(seats), plate, parseInt(mileage), selectedState, selectedParking)
                .then(() => {
                    updateVehicle();
                })
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
                            arrivalLocation={vehicle.arrivalLocation}
                            departureLocation={vehicle.departureLocation}
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
                        <DropdownMultiple placeholder="Dostępne trasy dla pojazdów"/>
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
