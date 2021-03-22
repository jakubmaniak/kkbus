import React, { useEffect, useState } from 'react';

import * as api from '../api';
import Vehicle from './Vehicle';
import { useValue as fromValue} from '../helpers/use-value';

import '../styles/VehicleInfo.css';
import Modal from './Modal';
import DropdownMultiple from './DropdownMultiple';
import Dropdown from './Dropdown';

function VehicleInfo() {    
    let [vehicles, setVehicles] = useState([]);
    let [modalAddVehicleVisibility, setModalAddVehicleVisibility] = useState(false);

    let [brand, setBrand] = useState('');
    let [model, setModel] = useState('');
    let [year, setYear] = useState('');
    let [mileage, setMileage] = useState('');
    let [plate, setPlate] = useState('');
    let [seats, setSeats] = useState('');

    useEffect(() => {
        updateVehicle();
        console.log(vehicles);
    }, []);

    function updateVehicle() {
        api.getAllVehicles()
        .then(setVehicles);
    }

    function deleteVehicle(vehicleId) {
        let vehicle = vehicles.find(({id}) => id === vehicleId);
        let index = vehicles.indexOf(vehicle);  

        api.deleteVehicle(vehicleId);

        vehicles.splice(index, 1);
        setVehicles(vehicles);
        
        updateVehicle();
    }

    function addVehicle() {
        if(brand !== '' && model !== '' && year !== '' && plate !== '' && mileage !== '' && seats !== '') {
            if(!isNaN(parseInt(year)) && !isNaN(parseInt(seats)) && !isNaN(parseInt(mileage))) {
                api.addVehicle(brand, model, parseInt(year), plate, parseInt(mileage), parseInt(seats))
                .then((id) => {
                    setVehicles([
                        ...vehicles,
                        {
                            id,
                            brand,
                            model,
                            year: parseInt(year),
                            plate,
                            mileage,
                            seats: parseInt(seats),
                            state: null,
                            parking: null,
                            ab : null, 
                            ba: null,
                            driver: null
                        }
                    ]);
                    setModalAddVehicleVisibility(false);
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
            <div className="main">
                <div className="button-add-container">
                    <button onClick={() => setModalAddVehicleVisibility(true)}>Dodaj przystanek</button>
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
                            oneWayTrack={vehicle.ab}
                            returnTrack={vehicle.ba}
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
                        <Dropdown placeholder="Miejsce stałego parkowania"/>
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
