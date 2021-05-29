import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import RouteYearReport from './RouteYearReport';

function RouteYearReportPrint() {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });
    return (
        <RouteYearReport
            ref={componentRef}
            handlePrint={handlePrint}
        />
    );
};

export default RouteYearReportPrint;