import React from 'react';

function FuelUsageChart(props) {
    let width = 446;
    let height = 156;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" />
                    <stop offset="100%"/>
                </linearGradient>
            </defs>
            <polyline
                className="fill"
                points={
                    `0,${height} ` +
                    props.values.map((entity, i, array) =>
                        (i * (width / (array.length - 1))) +
                        ',' +
                        (entity - 30) * 10
                    ) +
                    ` ${width},${height}`
                } />
            <polyline
                className="stroke"
                points={
                    props.values.map((entity, i, array) =>
                        (i * (width / (array.length - 1))) +
                        ',' +
                        (entity - 30) * 10
                    )
                } />
        </svg>
    );
}

export default FuelUsageChart;