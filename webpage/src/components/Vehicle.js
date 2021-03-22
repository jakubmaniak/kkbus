import React, { useState, useContext } from 'react';
import '../styles/VehicleInfo.css';
import Modal from './Modal';
import UserContext from '../contexts/User';
import Dropdown from './Dropdown';
import DropdownMultiple from './DropdownMultiple';
import { useValue as fromValue} from '../helpers/use-value';
import * as api from '../api';

function Vehicle(props) {
    let { role } = useContext(UserContext).user;
    let [modalDetailsVisibility, setModalDetailsVisibility] = useState(false);
    let [modalEditVehicleVisibility, setModalEditVehicleVisibility] = useState(false);
    let [modalChangeDriverVisibility, setModalChangeDriverVisibility] = useState(false);
    
    let [brand, setBrand] = useState(props.brand);
    let [model, setModel] = useState(props.model);
    let [year, setYear] = useState(props.year);
    let [mileage, setMileage] = useState(props.mileage);
    let [plate, setPlate] = useState(props.plate);
    let [seats, setSeats] = useState(props.seats);


    function editVehicle(vehicleId) {
        setModalEditVehicleVisibility(false);

        //!!!dopisac parking, ab, ba!!!

        //sprzwdzanie czy nie ma pustych pol
        if(brand !== '' && model !== '' && year !== '' && mileage !== '' && plate !== '' && seats !== '') {
            //sprawdzenie czy pola liczbowe sa liczbami
            if(!isNaN(parseInt(year)) && !isNaN(parseInt(seats)) && !isNaN(parseInt(mileage))) {
                if(brand !== props.brand || model !== props.model || parseInt(year) !== props.year 
                    || parseInt(mileage) !== props.mileage || parseInt(seats) !== seats) {
                    let currentYear = year !== props.year ? parseInt(year) : props.year;
                    let currentMileage = mileage !== props.mileage ? parseInt(mileage) : props.mileage;
                    let currentSeats = seats !== props.seats ? parseInt(seats) : props.seats;
                    
                    api.updateVehicle(vehicleId, brand, model, currentYear, plate, currentMileage, currentSeats)
                    .then(() => 
                        props.updateVehicle()
                    );
                } 
            }
            else {
                alert('Nieprawidłowy typ danych');
            }
        }
        else {
            alert('Wypełnij wzsystkie pola!');
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
                        <Dropdown placeholder="Miejsce stałego parkowania"/>
                        <DropdownMultiple placeholder="Dostępne trasy dla pojazdów"/>
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
                <div className="vehicle-info route-info">
                    <span>Dostępność tras</span>
                    <span>
                        <p>{props.oneWayTrack}</p> 
                        <p>{props.returnTrack}</p>
                    </span>
                </div>
                <div className="details">
                    <button onClick={() => setModalDetailsVisibility(true)}>Szczegóły</button>
                    {role === 'owner' ? 
                        <div className="vehicle-edit-button">
                            <button onClick={() => {setModalEditVehicleVisibility(true)}}>Edytuj dane</button>
                            <button onClick={() => {setModalChangeDriverVisibility(true)}}>Zmień kierowcę</button>
                            <button className="delete">Usuń</button>
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
            {role === 'owner' ? editDataModal() : null}
            {role === 'owner' || role === 'office' ? changeDriverModal() : null} 
        </div>
    );
}

export default Vehicle;
