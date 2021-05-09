import React from 'react';
import BookingReportMonth from './BookingReportMonth';
import BookingReportYear from './BookingReportYear';

function BookingReportPage() {
    return (
        <div className="booking-report page">
            <div className="main">
                <BookingReportMonth />
                <BookingReportYear />
            </div>
        </div>
    );
}

export default BookingReportPage;
