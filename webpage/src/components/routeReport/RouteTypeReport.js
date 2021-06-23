import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import dayjs from 'dayjs';
import * as api from '../../api';

const RouteTypeReport = React.forwardRef((props, ref) => {
    let [lineChartData, setlineChartData] = useState(
        [
            {
              "id": "przychody",
              "data": [
                {
                  "x": "24.05.2021",
                  "y": 170
                },
                {
                  "x": "25.05.2021",
                  "y": 169
                },
                {
                  "x": "26.05.2021",
                  "y": 156
                },
                {
                  "x": "27.05.2021",
                  "y": 210
                },
                {
                  "x": "28.05.2021",
                  "y": 13
                },
                {
                  "x": "29.05.2021",
                  "y": 85
                },
                {
                  "x": "30.05.2021",
                  "y": 243
                },
              ]
            },
            {
              "id": "koszty paliwa",
              "data": [
                {
                    "x": "24.05.2021",
                    "y": 70
                },
                {
                    "x": "25.05.2021",
                    "y": 150
                },
                {
                    "x": "26.05.2021",
                    "y": 200
                },
                {
                    "x": "27.05.2021",
                    "y": 210
                },
                {
                    "x": "28.05.2021",
                    "y": 20
                },
                {
                    "x": "29.05.2021",
                    "y": 2
                },
                {
                    "x": "30.05.2021",
                    "y": 1
                },
              ]
            }
          ]
    );

    function renderDate(type, date) {
        switch (type) {
            case 'annual':
                return date;
            case 'monthly':
                return dayjs(date).format('MM.YYYY');
            case 'weekly':
                let [year, week] = date.split('-');
                week = week.substring(1);
                return dayjs(new Date(year, 0, (week * 7) - 3)).format('DD.MM.YYYY') + ' - ' + dayjs(new Date(year, 0, (week * 7) + 3)).format('DD.MM.YYYY') 
            case 'daily':
                return dayjs(date).format('DD.MM.YYYY');
            default:
                return null;
        }
    }

    return (
        <div className="tile route-report-tile" ref={ref}>
            <div className="tile-info">
                <h2>Raport {props.typeText} z kursów</h2>
                <p>{renderDate(props.type, props.date)}</p>
            </div>
            <div className="route-chart" style={{ height: '600px' }}>
                <h3>Liczba pasażerów na poszczególnych odcinkach trasy</h3>
                <h4>
                    <span>{props.driver.firstName} {props.driver.lastName}, </span>
                    <span>{props.vehicle.brand} {props.vehicle.model} {props.vehicle.year}, </span>
                    <span>{props.route.departureLocation} - {props.route.arrivalLocation}</span>
                </h4>
                { props.barChartData.reduce((acc, cur) => acc + cur.persons, 0) ?
                    <ResponsiveBar
                        data={props.barChartData}
                        keys={[ 'persons']}
                        indexBy="stop"
                        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                        padding={0.5}
                        valueScale={{ type: "linear" }}
                        groupMode="grouped"
                        labelTextColor="#FFFFFF"
                        colors={['#47BE61']}
                        axisTop={null}
                        axisRight={null}
                        axisLeft={{
                            legend: 'liczba pasażerów',
                            legendOffset: -45,
                            legendPosition: 'end'
                        }}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'przystanek',
                            legendOffset: 42,
                            legendPosition: 'end'
                        }}
                        theme={{
                            fontFamily: 'Poppins',
                            axis: {
                                ticks: {
                                    text: {
                                        fontSize: 12
                                    }
                                },
                            },
                            labels: {
                                text: {
                                    fontSize: 14
                                } 
                            }
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        isInteractive={false}
                        animate={false}
                        motionStiffness={90}
                        motionDamping={15}
                    />
                    : <div className="no-reports-placeholder">Brak raportów z tego okresu</div>
                }
            </div>
            <div className="route-chart" style={{ height: '600px' }}>
                    <h3>Przychody względem kosztów paliwa</h3>
                    <ResponsiveLine className="chart"
                        data={lineChartData}
                        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: '0', max: 'auto', stacked: false, reverse: false }}
                        colors={[ '#47BE61', '#C73535' ]}
                        axisTop={null}
                        axisRight={null}
                        axisLeft={{
                            legend: 'koszty i przychody',
                            legendOffset: -45,
                            legendPosition: 'end'
                        }}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'data',
                            legendOffset: 45,
                            legendPosition: 'end'
                        }}
                        theme={{
                            fontFamily: 'Poppins',
                            axis: {
                                ticks: {
                                    text: {
                                        fontSize: 12
                                    }
                                },
                                legend: {
                                    text: {
                                        fontSize: 12
                                    }
                                }
                            },
                            labels: {
                                text: {
                                    fontSize: 12
                                } 
                            }
                        }}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        enablePointLabel={true}
                        pointLabelYOffset={-12}
                        isInteractive={false}
                        legends={[
                            {
                                anchor: 'top',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: -25,
                                itemsSpacing: 30,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                        // animate={false}
                    />    
                </div>
            <div className="button-container">
                <button className="print" onClick={props.handlePrint}>Drukuj</button>
            </div>
        </div>
    );
})

export default RouteTypeReport;