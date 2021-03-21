import React from 'react';
import '../styles/BookingList.css';

function BookingListItem(props) {
    return (
        <div className="booking-list-item">
            <div className="booking-item-row">
                <span>{props.bookingNumber} </span>
                <span>{props.clientName}</span>
            </div>
            <div className="booking-item-row">
                <span>{props.ticket}</span>
            </div>
        </div>
    );
}

export default BookingListItem;
