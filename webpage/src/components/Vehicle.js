import React, { useState, useContext } from 'react';
import '../styles/VehicleInfo.css';
import Modal from './Modal';
import UserContext from '../contexts/User';
import Dropdown from './Dropdown';
import DropdownMultiple from './DropdownMultiple';

function Vehicle(props) {
    let { role } = useContext(UserContext).user;
    let [modalDetailsVisibility, setModalDetailsVisibility] = useState(false);
    let [modalEditDataVisibility, setModalEditDataVisibility] = useState(false);
    let [modalChangeDriverVisibility, setModalChangeDriverVisibility] = useState(false);

    function editDataModal() {
        return (
            <Modal visible={modalEditDataVisibility}>
                <header>Edycja danych pojazdu</header>
                <section className="content">
                    <form className="vehicle-edit">
                        <div className="input-container"> 
                            <input placeholder="Marka"/>
                            <input placeholder="Model"/>
                        </div>
                       <div className="input-container">
                            <input placeholder="Rocznik"/>
                            <input placeholder="Przebieg"/>
                       </div>
                        <div className="input-container">
                            <input placeholder="Rejestracja"/>
                            <input placeholder="Ilość miejsc"/>
                        </div>
                        <Dropdown placeholder="Miejsce stałego parkowania"/>
                        <DropdownMultiple placeholder="Dostępne trasy dla pojazdów"/>
                    </form>
                </section>
                <section className="footer">
                    <button onClick={() => setModalEditDataVisibility(false)}>Anuluj</button>
                    <button onClick={() => setModalEditDataVisibility(false)}>Zapisz</button>
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
                <h2>{props.name}</h2>
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
                            <button onClick={() => {setModalEditDataVisibility(true)}}>Edytuj dane</button>
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
                        <span>{props.vehicleRegistration}</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Ilość miejsc:</span>
                        <span>{props.seats}</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Przebieg:</span>
                        <span>{props.vehicleMileage}</span>
                    </div>
                    <div className="vehicle-info">
                        <span>Średnie spalanie:</span>
                        <span>{props.avgCombustion}</span>
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
            {/* {role === 'owner' ?
                [
                    editDataModal(), 
                    changeDriverModal()
                ]
            : null} */}
            {role === 'owner' ? editDataModal() : null}
            {role === 'owner' || role === 'office' ? changeDriverModal() : null} 
        </div>
    );
}

export default Vehicle;
