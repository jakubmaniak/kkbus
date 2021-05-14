import React from 'react';
import BookingListItem from './BookingListItem';
import '../../styles/BookingList.css';

const BookingToPrint = React.forwardRef((props, ref) => {
    return (
            <div className="tile" ref={ref}>
                <div className="booking-header-info">
                    <h2>Lista rezerwacji</h2>
                    <div className="booking-info">
                        <p>{props.route}</p>
                        <p>
                            <span>{props.date} </span> 
                            <span>{props.hour}</span>
                        </p>
                    </div>
                </div>
                <div className="booking-list-container">
                    {props.bookinglist !== null ?
                        props.bookinglist.map((bookingItem) => {
                            return (
                                <BookingListItem
                                    key={bookingItem.id}
                                    id={bookingItem.id}
                                    firstName={bookingItem.firstName}
                                    lastName={bookingItem.lastName}
                                    childTickets={bookingItem.childTickets}
                                    normalTickets={bookingItem.normalTickets}
                                    reducedTickets={bookingItem.reducedTickets}
                                />
                            )
                        })
                    : null}
                </div>
                <div className="button-container">
                    <button className="print" onClick={props.handlePrint}>Drukuj</button>
                </div>
            </div>
        );
});

export default BookingToPrint;
