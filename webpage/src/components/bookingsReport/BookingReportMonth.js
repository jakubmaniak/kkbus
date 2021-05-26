import React, { useEffect, useState } from 'react';
import '../../styles/BookingReport.css';
import Dropdown from '../dropdowns/Dropdown';
import BookingPieChart from './BookingPieChart';

function BookingReportMonth() {
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
            <h2>Raport miesięczny z rezerwacji</h2>
            <Dropdown />
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
