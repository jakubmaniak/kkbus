import React, { useEffect, useState } from 'react';
import '../../styles/BookingReport.css';
import BookingPieChart from './BookingPieChart';

function BookingReportMonth(props) {
    let [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                title: 'zrealizowane',
                value: 22,
                color: '#47BE61'
            },
            {
                title: 'niezrealizowane',
                value: 12,
                color: '#C73535'
            }
        ])
    }, []);

    return (
        <div className="tile booking-month">
            <div className="booking-month-info">
                <h2>Raport miesięczny z rezerwacji</h2>
                <p>{props.selectedMonth} {props.selectedYear}</p>
            </div>
            <div className="pie-charts-container">
                <BookingPieChart 
                    data={data}
                    label={(props) => { return props.dataEntry.value; }}
                />
                <BookingPieChart 
                    data={data}
                    label={({ dataEntry }) => { return Math.round(dataEntry.percentage) + '%'; }}
                />
            </div>
            <div className="button-container">
                <button>Drukuj</button>
            </div>
        </div>
    );
}

export default BookingReportMonth;
