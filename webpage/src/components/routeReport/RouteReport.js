import React, { useState, useEffect } from 'react';
import '../../styles/RouteReport.css';
import Dropdown from '../dropdowns/Dropdown';
import * as api from '../../api';
import RouteTypeReportPrint from './RouteTypeReportPrint';


function RouteReport() {
    let [routes, setRoutes] = useState([]);
    let [drivers, setDrivers] = useState([]);
    let [vehicles, setVehicles] = useState([]);

    let [reportTypes, setReportType] = useState(['dniowy', 'tygodniowy', 'miesięczny', 'roczny']);
    
    let d = new Date();
    let years = [];
    years[0] = 2021;
    
    for(let i = 1; years[0] > d.getFullYear(); i++) {
        years[i] = years[0] + i;
    }

    let [date, setDate] = useState(years);


    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedDriver, setSelectedDriver] = useState();
    let [selectedVehicle, setSelectedVehicle] = useState();

    let [selectedReportType, setSelectedReportType] = useState();
    let [selectedDate, setSelectedDate] = useState(' ');

    let[selectedAllOptions, setSelectedAllOptions] = useState(false);

    useEffect(() => {
        api.getAllRoutes()
            .then(setRoutes)
            .catch(api.toastifyError);
        api.getDriverNames()
            .then(setDrivers)
            .catch(api.toastifyError);
        api.getAllVehicles()
            .then(setVehicles)
            .catch(api.toastifyError);
    }, []);

    useEffect(() => {
        if(selectedRoute && selectedDriver && selectedVehicle && selectedReportType && selectedDate) {
            setSelectedAllOptions(true);
        }
        else {
            setSelectedAllOptions(false);
        }
    }, [selectedRoute, selectedDriver, selectedVehicle, selectedReportType, selectedDate]);

    useEffect(() => {
        switch(selectedReportType) {
            case 'miesięczny':
                setSelectedDate(getCurrentMonthAndYear());
                break;
            case 'tygodniowy':
                setSelectedDate(getNumberOfWeek());
                break;
            case 'dniowy':
                setSelectedDate(getCurrentData());
                break;
        }
    }, [selectedReportType]);


    function getNumberOfWeek() {
        let today = new Date();
        let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        let pastDaysOfYear = (today - firstDayOfYear) / 86400000;
        return "2021-W" + Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7 - 2);
    }

    function getCurrentMonthAndYear() {
        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        return `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
    }

    function getCurrentData(data) {
        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let currentDay = today.getDate();
        
        console.log(`${(currentDay).toString().padStart(2, '0')}.${(currentMonth + 1).toString().padStart(2, '0')}.${currentYear}`);
 
        return `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${(currentDay).toString().padStart(2, '0')}`;
    }

    return (
        <div className="route-report page">
            <div className="main">
                <div className="tile">
                    <h2>Raporty z kursów</h2>
                    <div className="row-filter-container">
                        <Dropdown 
                            placeholder='Wybierz trasę'
                            items={routes}
                            textFormatter={({ departureLocation, arrivalLocation }) => departureLocation + ' - ' + arrivalLocation}
                            handleChange={setSelectedRoute}
                        />
                        <Dropdown 
                            placeholder="Wybierz typ raportu"
                            items={reportTypes}
                            handleChange={setSelectedReportType}
                        />
                    </div>
                    <div className="row-filter-container">
                        <Dropdown 
                            placeholder="Wybierz kierowcę"
                            items={drivers}
                            textFormatter={({ firstName, lastName }) => firstName + ' ' + lastName}
                            handleChange={setSelectedDriver}
                        />
                        {
                            selectedReportType === 'roczny' ?
                                <Dropdown 
                                    placeholder="Wybierz datę"
                                    items={date}
                                    handleChange={setSelectedDate}
                                    selectedIndex={0}
                                />
                            : selectedReportType === 'miesięczny' ?
                                <input type="month" min="2021-01" max={getCurrentMonthAndYear()} value={selectedDate} onChange={(ev) => setSelectedDate(ev.target.value)}/>
                            : selectedReportType === 'tygodniowy' ?
                                <input type="week" min="2021-W1" max={getNumberOfWeek()} value={selectedDate} onChange={(ev) => setSelectedDate(ev.target.value)}/>
                            : selectedReportType === 'dniowy' ?
                                <input type="date" min="2021-01-01" max={getCurrentData()} value={selectedDate} onChange={(ev) => setSelectedDate(ev.target.value)}/>
                            : null
                        }
                    </div>
                    <div className="row-filter-container">
                        <Dropdown 
                            placeholder="Wybierz pojazd"
                            items={vehicles}
                            textFormatter={({ brand, model, year }) => brand + ' ' + model + ' ' + year}
                            handleChange={setSelectedVehicle}
                        />
                    </div>
                </div>
                {selectedAllOptions === true ? 
                    <RouteTypeReportPrint 
                        type={selectedReportType}
                        route={selectedRoute}
                        driver={selectedDriver}
                        vehicle={selectedVehicle}
                        data={selectedVehicle}
                    />    
                : null}
                
            </div>
        </div>                          
    );
}

export default RouteReport;
