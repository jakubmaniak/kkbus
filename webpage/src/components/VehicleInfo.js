import React, { useState } from 'react';
import '../styles/VehicleInfo.css';
import Modal from './Modal';
import Vehicle from './Vehicle';

function VehicleInfo() {
    let [modalVisibility, setModalVisibility] = useState(true);
    let vehicles = [
        {
            name: 'Mercedes Sprinter 2014',
            state: 'Aktywny',
            parking: 'Parking nr 1',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków'
        },
        {
            name: 'Ford Transit 2016',
            state: 'Aktywny',
            parking: 'Parking nr 1',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków'
        },
        {
            name: 'Iveci Daily 2014',
            state: 'Aktywny',
            parking: 'Parking nr 1',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków'
        },
        {
            name: 'Fiat Ducato 2014',
            state: 'Aktywny',
            parking: 'Parking nr 1',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków'
        },
        {
            name: 'Scenia 2015',
            state: 'Aktywny',
            parking: 'Parking nr 1',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków'
        }
    ];

    return (
        <div className="vehicle-info-page">
            <Modal visible={modalVisibility}>
                <header>Szczegóły pojazdu</header>
                <section className="content">
                    <p>Nazwa pojazdu: Mercedes Sprinter</p>
                    <p>Przebieg: 1 393 881 km</p>
                </section>
                <section className="footer">
                    <button onClick={() => setModalVisibility(false)}>Zamknij</button>
                </section>
            </Modal>
            <div className="main">
                {vehicles.map((vehicle, index) => {
                    return (
                        <Vehicle key={index}
                            name={vehicle.name} 
                            state={vehicle.state}
                            parking={vehicle.parking} 
                            oneWayTrack={vehicle.oneWayTrack}
                            returnTrack={vehicle.returnTrack}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default VehicleInfo;
