import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import BookingToPrint  from './BookingToPrint';

function PrintBookingList(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
        <BookingToPrint 
            ref={componentRef} 
            bookinglist={props.bookinglist}
            route={props.route} 
            date={props.date}
            hour={props.hour}
            handlePrint={handlePrint}
        />
  );
};

export default PrintBookingList;
