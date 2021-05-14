import React from 'react';
import '../../styles/BookingList.css';
import plural from '../../helpers/plural';

function BookingListItem(props) {

    function getItemText(normalTickets, reducedTickets, childTickets) {
        let parts = [];

        if (normalTickets > 0) {
            parts.push(
                normalTickets + ' ' + plural(normalTickets, 'normalny', 'normalne', 'normalnych')
            );
        }
        if (reducedTickets > 0) {
            parts.push(
                reducedTickets + ' ' + plural(reducedTickets, 'ulgowy', 'ulgowe', 'ulgowych')
            );
        }
        if (childTickets > 0) {
            parts.push(
                childTickets + ' ' + plural(childTickets, 'dziecko do lat 5', 'dzieci do lat 5')
            );
        }

        return parts.join(', ');
    }

    return (
        <div className="booking-list-item">
            <div className="booking-item-row">
                <span>{props.id} </span>
                <span>{props.firstName} {props.lastName}</span>
            </div>
            <div className="booking-item-row">
                <p>{getItemText(props.normalTickets, props.reducedTickets, props.childTickets)}</p>
            </div>
        </div>
    );
}

export default BookingListItem;
