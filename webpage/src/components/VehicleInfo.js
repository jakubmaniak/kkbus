import React from 'react';
import '../styles/VehicleInfo.css';
import Header from './Header';
import Vehicle from './Vehicle';

function VehicleInfo() {
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
            <Header />
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
