import React from 'react';

function BookingItem(props) {
    return (
        <p className="booking-item">
            <span>{props.date}</span>
            <span>{props.hour}</span>
            <span>{props.route}</span>
            <span>{props.normalTickets}</span>
            <span>{props.reducedTickets}</span>
            <span>{props.childTickets}</span>
        </p>
    );
}

export default BookingItem;
