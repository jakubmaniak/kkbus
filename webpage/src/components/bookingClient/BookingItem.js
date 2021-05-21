import React from 'react';

function BookingItem(props) {
    function checkCancelPosibility() {
        let bookingTime = new Date(props.date.split('.').reverse().join('.') + ' ' + props.hour).getTime();
        let currentTime = new Date().getTime();

        if(bookingTime - currentTime >=  60 * 60 * 24 * 1000) {
            return true;
        }

        return false;
    }

    return (
        <p className="booking-item">
            <span>{props.date}</span>
            <span>{props.hour}</span>
            <span>{props.route}</span>
            <span>{props.normalTickets}</span>
            <span>{props.reducedTickets}</span>
            <span>{props.childTickets}</span>
            {checkCancelPosibility() ? <button>Anuluj</button> : null}
        </p>
    );
}

export default BookingItem;
