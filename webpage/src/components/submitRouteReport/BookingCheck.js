import React, { useState } from 'react';

function BookingCheck(props) {
    let [checked, setChecked] = useState(true);

    function toggleBooking(ev) {
        setChecked(!checked);
        props.toggleBooking(ev);
    }

    return (
        <div className="booking-check">
            <span>{props.id}</span>
            <span>{props.firstName}</span>
            <span>{props.lastName}</span>
            <span>{props.normalTickets}</span>
            <span>{props.reducedTickets}</span>
            <span>{props.childTickets}</span>
            <div className="check">
                <input type="checkbox" id={props.id} name={props.id} checked={checked} onChange={toggleBooking} />
                <label htmlFor={props.id}></label>
            </div>
        </div>
    );
}

export default BookingCheck;
