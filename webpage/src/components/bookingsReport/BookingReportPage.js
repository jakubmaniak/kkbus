import React, { useEffect, useState } from 'react';
import PrintBookingMonthReport from './bookingMonthReport/PrintBookingMonthReport';
import PrintBookingYearReport from './bookingYearReport/PrintBookingYearReport';
import Dropdown from '../dropdowns/Dropdown';

function BookingReportPage() {
    let date = new Date();

    let months = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
    let [selectedMonth, setSelectedMonth] = useState(months[date.getMonth()]);

    let years = [];
    years[0] = date.getFullYear();
    for(let i = 1; i < 10; i++) {
        years[i] = years[0] + i;
    }
    let [selectedYear, setSelectedYear] = useState(date.getFullYear());

    useEffect(() => {
        console.log(selectedMonth, selectedYear);
    }, [selectedYear, selectedMonth]);

    return (
        <div className="booking-report page">
            <div className="main">
                <div className="tile">
                    <div className="row-filter-container">
                        <div className="filter-container">
                            <span>Miesiąc:</span>
                            <Dropdown
                                placeholder="Wybierz miesiąc" 
                                items={months}
                                selectedIndex={months.indexOf(selectedMonth)}
                                handleChange={setSelectedMonth}
                            />
                        </div>
                        <div className="filter-container">
                            <span>Rok:</span>
                            <Dropdown
                                placeholder="Wybierz rok" 
                                items={years}
                                selectedIndex={years.indexOf(selectedYear)}
                                handleChange={setSelectedYear}
                            />
                        </div>
                    </div>
                </div>
                <PrintBookingMonthReport 
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />
                <PrintBookingYearReport 
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />
            </div>
        </div>
    );
}

export default BookingReportPage;
