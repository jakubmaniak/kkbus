import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import RouteWeekReport from './RouteWeekReport';

function RouteWeekReportPrint() {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });
    return (
        <RouteWeekReport
            ref={componentRef}
            handlePrint={handlePrint}
        />
    );
};

export default RouteWeekReportPrint;