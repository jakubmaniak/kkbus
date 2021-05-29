import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import RouteDailyReport from './RouteDailyReport';

function RouteDailyReportPrint() {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });
    return (
        <RouteDailyReport
            ref={componentRef}
            handlePrint={handlePrint}
        />
    );
};

export default RouteDailyReportPrint;
