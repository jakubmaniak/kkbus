import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import RouteTypeReport  from './RouteTypeReport';

function RouteTypeReportPrint(props) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
        <RouteTypeReport 
            ref={componentRef} 
            type={props.type} 
            route={props.route}
            vehicle={props.vehicle}
            driver={props.driver}
            date={props.date}
            handlePrint={handlePrint}
        />
  );
};

export default RouteTypeReportPrint;