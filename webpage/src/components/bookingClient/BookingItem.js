import React from 'react';

function BookingItem(props) {
    function checkCancelPosibility() {
        let bookingTime = new Date(props.date.split('.').reverse().join('.') + ' ' + props.hour).getTime();
        let currentTime = Date.now();   

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
                {checkCancelPosibility() ? <td><button onClick={props.deleteBooking}>Odwołaj</button></td> : null}
            </tr>
            
    );
}

export default BookingItem;
