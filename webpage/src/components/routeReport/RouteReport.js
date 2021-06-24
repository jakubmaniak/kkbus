import React, { useState, useEffect } from 'react';
import '../../styles/RouteReport.css';
import Dropdown from '../dropdowns/Dropdown';
import * as api from '../../api';
import RouteTypeReportPrint from './RouteTypeReportPrint';


function RouteReport() {
    let [routes, setRoutes] = useState([]);
    let [drivers, setDrivers] = useState([]);
    let [vehicles, setVehicles] = useState([]);

    let [reportTypes] = useState([
        ['daily', 'dniowy'], 
        ['weekly', 'tygodniowy'], 
        ['monthly', 'miesięczny'], 
        ['annual', 'roczny']
    ]);
    

    let fromYear = 2021;
    let years = new Array(new Date().getFullYear() - fromYear + 1)
        .fill(0)
        .map((_, i) => fromYear + i);

    let [date, setDate] = useState(years);

    let [selectedRoute, setSelectedRoute] = useState();
    let [selectedDriver, setSelectedDriver] = useState();
    let [selectedVehicle, setSelectedVehicle] = useState();

    let [selectedReportType, setSelectedReportType] = useState();
    let [selectedDate, setSelectedDate] = useState('');

    let [selectedAllOptions, setSelectedAllOptions] = useState(false);

    let [barChartData, setBarChartData] = useState([]);
    let [lineChartData, setLineChartData] = useState([]);

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
        if (selectedRoute && selectedDriver && selectedVehicle && selectedReportType && selectedDate) {
            setSelectedAllOptions(true);
        }
        else {
            setSelectedAllOptions(false);
        }
    }, [selectedRoute, selectedDriver, selectedVehicle, selectedReportType, selectedDate]);

    useEffect(() => {
        if (selectedAllOptions) {
            loadReports();
        }
    }, [selectedAllOptions, selectedRoute, selectedDriver, selectedVehicle, selectedDate]);

    useEffect(() => {
        switch(selectedReportType?.[0]) {
            case 'monthly':
                setSelectedDate(getCurrentMonthAndYear());
                break;
            case 'weekly':
                setSelectedDate(getNumberOfWeek());
                break;
            case 'daily':
                setSelectedDate(getCurrentDate());
                break;
        }
    }, [selectedReportType]);

    function loadReports() {
        api.getRouteReports(selectedRoute?.id, selectedVehicle?.id, selectedDriver?.id, selectedReportType?.[0], selectedDate)
            .then((report) => {
                let persons = report.map((stopReport) => ({ stop: stopReport.stop, persons: stopReport.persons }));
                let incomes = report.map((stopReport) => ({ x: stopReport.stop, y: stopReport.income }));
                
                setBarChartData(persons);
                setLineChartData([
                    { id: "przychody", data: incomes }
                ]);
            })
            .catch(api.toastifyError);
    }

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

    function getCurrentDate() {
        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let currentDay = today.getDate();
 
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
                            textProperty="1"
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
                            selectedReportType?.[0] === 'annual' ?
                                <Dropdown 
                                    placeholder="Wybierz datę"
                                    items={date}
                                    handleChange={setSelectedDate}
                                    selectedIndex={0}
                                />
                            : selectedReportType?.[0] === 'monthly' ?
                                <input type="month" min="2021-01" max={getCurrentMonthAndYear()} value={selectedDate} onChange={(ev) => setSelectedDate(ev.target.value)}/>
                            : selectedReportType?.[0] === 'weekly' ?
                                <input type="week" min="2021-W1" max={getNumberOfWeek()} value={selectedDate} onChange={(ev) => setSelectedDate(ev.target.value)}/>
                            : selectedReportType?.[0] === 'daily' ?
                                <input type="date" min="2021-01-01" max={getCurrentDate()} value={selectedDate} onChange={(ev) => setSelectedDate(ev.target.value)}/>
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
                        barChartData={barChartData}
                        lineChartData={lineChartData}
                        type={selectedReportType?.[0]}
                        typeText={selectedReportType?.[1]}
                        route={selectedRoute}
                        driver={selectedDriver}
                        vehicle={selectedVehicle}
                        date={selectedDate}
                    />    
                : null}
                
            </div>
        </div>                          
    );
}

export default RouteReport;
