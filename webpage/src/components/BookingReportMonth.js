import React from 'react';
import '../styles/BookingReport.css';

function BookingReportMonth() {
    return (
        <div className="tile booking-month">
            <h2>Raport miesięczny z rezerwacji</h2>
            <div className="button-container">
                <button>Drukuj</button>
            </div>
        </div>
    );
}

export default BookingReportMonth;
