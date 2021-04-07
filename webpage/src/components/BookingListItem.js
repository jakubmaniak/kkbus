import React from 'react';
import '../styles/BookingList.css';

function BookingListItem(props) {
    return (
        <div className="booking-list-item">
            <div className="booking-item-row">
                <span>{props.id} </span>
                <span>{props.firstName} {props.lastName}</span>
            </div>
            <div className="booking-item-row">
                {props.normalTickets > 0 ?  <span>{props.normalTickets} normalne, </span> : null}
                {props.reducedTickets > 0 ? <span>{props.reducedTickets} ulgowe, </span> : null}
                {props.childTickets > 0 ? <span>{props.childTickets} dzieci do lat 5</span> : null} 
            </div>
        </div>
    );
}

export default BookingListItem;
