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
        <tr>
            <td>{props.date}</td>
            <td>{props.hour}</td>
            <td>{props.route}</td>
            <td>{props.normalTickets}</td>
            <td>{props.reducedTickets}</td>
            <td>{props.childTickets}</td>
            <td>{checkCancelPosibility() ? <button>Anuluj</button> : null}</td>
        </tr>
    );
}

export default BookingItem;
