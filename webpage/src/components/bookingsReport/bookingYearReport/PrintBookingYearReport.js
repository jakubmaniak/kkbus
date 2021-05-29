import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import BookingYearReportToPrint  from './BookingYearReportToPrint';

function PrintBookingYearReport(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
        <BookingYearReportToPrint 
            ref={componentRef} 
            selectedYear={props.selectedYear} 
            handlePrint={handlePrint}
        />
  );
};

export default PrintBookingYearReport;