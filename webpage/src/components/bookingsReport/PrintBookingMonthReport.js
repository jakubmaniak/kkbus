import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import BookingReportMonthToPrint  from './BookingReportMonthToPrint';

function PrintBookingList(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
        <BookingReportMonthToPrint 
            ref={componentRef} 
            selectedMonth={props.selectedMonth}
            selectedYear={props.selectedYear} 
            handlePrint={handlePrint}
        />
  );
};

export default PrintBookingList;