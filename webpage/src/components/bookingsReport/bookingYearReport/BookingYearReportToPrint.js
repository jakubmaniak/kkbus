import React, { useEffect, useState } from 'react';
import '../../../styles/BookingReport.css';
import BookingPieChart from '../BookingPieChart';

const BookingReportYearToPrint = React.forwardRef((props, ref) => {
    let [data, setData] = useState([]);

    useEffect(() => {
        setData([
            {
                title: 'zrealizowane',
                value: 548,
                color: '#47BE61'
            },
            {
                title: 'niezrealizowane',
                value: 90,
                color: '#C73535'
            }
        ])
    }, []);

    return (
        <div className="tile booking-year" ref={ref}>
            <div className="booking-month-info">
                <h2>Raport roczny z rezerwacji</h2>
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
                <button className="print" onClick={props.handlePrint}>Drukuj</button>
            </div>
        </div>
    );
});

export default BookingReportYearToPrint;
