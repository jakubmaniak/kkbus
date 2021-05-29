import React from 'react';

const RouteTypeReport = React.forwardRef((props, ref) => {
    return (
        <div className="tile" ref={ref}>
            <h2>Raport {props.type} z kursów</h2>
        </div>
    );
})

export default RouteTypeReport;