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
            handlePrint={handlePrint}
        />
  );
};

export default PrintBookingList;
