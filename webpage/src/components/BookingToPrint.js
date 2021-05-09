import React from 'react';
import BookingListItem from './BookingListItem';

const BookingToPrint = React.forwardRef((props, ref) => {
    return (
            <div className="tile" ref={ref}>
                <h2>Lista rezerwacji</h2>
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
