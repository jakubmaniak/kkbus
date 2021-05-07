import React from 'react';

function BookingItem(props) {
    return (
        <div>
            <span>{props.date} </span>
            <span>{props.route} </span>
            <span>{props.normalTickets} normalne </span>
            <span>{props.reducedTickets} ulgowe </span>
            <span>{props.childTicekts} dziecko do lat 5</span>
        </div>
    );
}

export default BookingItem;
