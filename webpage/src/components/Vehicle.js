import React, { useState } from 'react';
import '../styles/VehicleInfo.css';
import Modal from './Modal';

function Vehicle(props) {
    let [modalVisibility, setModalVisibility] = useState(false);

    function showModal() {
        setModalVisibility(true);
    }

    return (
        <div>
            <div className="tile">
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
                <button onClick={showModal}>Szczegóły</button>
            </div>
            <Modal visible={modalVisibility}>
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
                </section>
                <section className="footer">
                    <button onClick={() => setModalVisibility(false)}>Zamknij</button>
                </section>
            </Modal>
        </div>
    );
}

export default Vehicle;
