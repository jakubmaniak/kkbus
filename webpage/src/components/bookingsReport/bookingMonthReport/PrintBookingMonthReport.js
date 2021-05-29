import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import BookingMonthReportToPrint  from './BookingMonthReportToPrint';

function PrintBookingList(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
        <BookingMonthReportToPrint 
            ref={componentRef} 
            selectedMonth={props.selectedMonth}
            selectedYear={props.selectedYear} 
            selectedMonthIndex={props.selectedMonthIndex}
            handlePrint={handlePrint}
        />
  );
};

export default PrintBookingList;