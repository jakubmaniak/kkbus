import React from 'react';

const RouteDailyReport = React.forwardRef((props, ref) => {
    return (
        <div className="tile" ref={ref}>
            <h2>Raport dniowy</h2>
        </div>
    );
})

export default RouteDailyReport;
