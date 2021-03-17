import React from 'react';
import '../styles/VehicleInfo.css';
import Vehicle from './Vehicle';

function VehicleInfo() {    
    let vehicles = [
        {
            vehicleRegistration: 'KR 111 AB',
            name: 'Mercedes Sprinter 2014',
            state: 'Aktywny',
            parking: 'Parking nr 1',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków',
            seats: 22,
            vehicleMileage: 10000000,
            avgCombustion: 8.9,
            currentDriver: 'Tomasz Rajdowiec'
        },
        {
            vehicleRegistration: 'KR 124 AO',
            name: 'Ford Transit 2016',
            state: 'Aktywny',
            parking: 'Parking nr 1',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków',
            seats: 18,
            vehicleMileage: 900000,
            avgCombustion: 9,
            currentDriver: 'Kazimierz Rajdowiec'
        },
        {
            vehicleRegistration: 'KR 875 CF',
            name: 'Iveco Daily 2014',
            state: 'Aktywny',
            parking: 'Parking nr 2',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków',
            seats: 22,
            vehicleMileage: 9.5,
            avgCombustion: 80500300,
            currentDriver: 'Mirosław Szybki'
        },
        {
            vehicleRegistration: 'KR 222 KM',
            name: 'Fiat Ducato 2014',
            state: 'Aktywny',
            parking: 'Parking nr 2',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków',
            seats: 15,
            vehicleMileage: 9.4,
            avgCombustion: 10540003,
            currentDriver: 'Jan Doświadczony'
        },
        {
            vehicleRegistration: 'KR 990 JB',
            name: 'Scania Touring 2015',
            state: 'Aktywny',
            parking: 'Parking nr 2',
            oneWayTrack: 'Kraków - Katowice',
            returnTrack: 'Katowice - Kraków',
            seats: 55,
            vehicleMileage: 7.9,
            avgCombustion: 9023305,
            currentDriver: 'Marek Poprawny'
        }
    ];

    return (
        <div className="vehicle-info-page page">
            <div className="main">
                {vehicles.map((vehicle, index) => {
                    return (
                        <Vehicle key={index}
                            vehicleRegistration={vehicle.vehicleRegistration}
                            name={vehicle.name} 
                            state={vehicle.state}
                            parking={vehicle.parking}
                            seats={vehicle.seats} 
                            oneWayTrack={vehicle.oneWayTrack}
                            returnTrack={vehicle.returnTrack}
                            vehicleMileage={vehicle.vehicleMileage}
                            avgCombustion={vehicle.avgCombustion}
                            currentDriver={vehicle.currentDriver}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default VehicleInfo;
