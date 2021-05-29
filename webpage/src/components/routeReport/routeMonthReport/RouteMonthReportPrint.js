import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import RouteMonthReport from './RouteMonthReport';

function RouteWeekReportPrint() {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });
    return (
        <RouteMonthReport
            ref={componentRef}
            handlePrint={handlePrint}
        />
    );
};

export default RouteWeekReportPrint;