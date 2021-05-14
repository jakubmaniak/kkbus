import React from 'react';

function BookingCheck(props) {
    return (
        <div className="booking-check">
            <span>{props.id}</span>
            <span>{props.firstName}</span>
            <span>{props.lastName}</span>
            <span>{props.normalTickets}</span>
            <span>{props.reducedTickets}</span>
            <span>{props.childTickets}</span>
            <span>
                <button className="delete">X</button>
            </span>
        </div>
    );
}

export default BookingCheck;
