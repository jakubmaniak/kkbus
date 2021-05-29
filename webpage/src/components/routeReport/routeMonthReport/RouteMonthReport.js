import React from 'react';

const RouteMonthReport = React.forwardRef((props, ref) => {
    return (
        <div className="tile" ref={ref}>
            <h2>Raport miesięczny</h2>
        </div>
    );
});

export default RouteMonthReport;
