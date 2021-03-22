import React from 'react';

function FuelUsageChart(props) {
    let width = 446;
    let height = 156;

    function chartPoints() {
        let min = Math.min(...props.values);
        let max = Math.max(...props.values);

        return props.values.map((entity, i, array) =>
            (i * (width / (array.length - 1))) +
            ',' +
            (height - (entity - min) / (max - min) * height)
        );
    }

    function minPoint() {
        if (props.values.length < 2) return null;

        let min = Math.min(...props.values);
        let max = Math.max(...props.values);

        let index = props.values.indexOf(min);
        let point = props.values[index];

        let x = (index / (props.values.length - 1)) * width;
        let y = (height - (point - min) / (max - min) * height);

        return (
            <p className="chart-label"
                style={{ top: Math.floor(y - 24) + 'px', left: x + 'px' }}>{point} L/100KM</p>
        );
    }

    function lastPoint() {
        if (props.values.length < 2) return null;

        let min = Math.min(...props.values);
        let max = Math.max(...props.values);
        let point = props.values[props.values.length - 1];
        let y = (height - (point - min) / (max - min) * height);

        return (
            <p className="chart-label"
                style={{ top: Math.floor(y - 24) + 'px', left: width + 'px' }}>{point} L/100KM</p>
        );
    }

    return (
        <div className="chart fuel-usage-chart">
            {lastPoint()}
            {minPoint()}
            <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" />
                        <stop offset="100%"/>
                    </linearGradient>
                </defs>
                <polyline
                    className="fill"
                    points={`0,${height} ${chartPoints()} ${width},${height}`} />
                <polyline
                    className="stroke"
                    points={chartPoints()} />
            </svg>
        </div>
    );
}

export default FuelUsageChart;