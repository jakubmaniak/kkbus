import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

function BookingPieChart(props) {
    const labelStyle = {
        fontSize: '14px',
        fill: '#FFF',
    };

    return (
        <div className="pie-chart-container">
            <PieChart className="pie-chart"
                label={props.label}
                labelStyle={{ ...labelStyle }} 
                data={props.data}
            />
            <div className="legend">
                {props.data.map((element) => {
                    return (
                        <div className="legend-element">
                            <span className="label-color" style={{ backgroundColor: element.color }}></span>
                            <span className="label">{element.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default BookingPieChart;
