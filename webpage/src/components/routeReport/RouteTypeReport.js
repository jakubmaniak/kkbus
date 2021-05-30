import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import * as api from '../../api';

const RouteTypeReport = React.forwardRef((props, ref) => {
    let [barChartData, setBarChartData] = useState([
        {
            'przystanek': 'Kraków - Chrzanów',
            'passengers': 11,
        },
        {
            'przystanek': 'Kraków - Jaworzno',
            'passengers': 16,
        },
        {
            'przystanek': 'Kraków - Katowice',
            'passengers': 22,
        },
        {
            'przystanek': 'Chrzanów - Jaworzno',
            'passengers': 9,
        },
        {
            'przystanek': 'Chrzanów - Katowice',
            'passengers': 5,
        },
        {
            'przystanek': 'Jaworzno - Katowice',
            'passengers': 3,
        }
    ]);

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
    // switch(props.type) {
    //     case 'dniowy':
    //         api.getDailyReport(props.routeId, props.vehicleId, props.driverId, props.date)
    //             .then(setData)
    //             .catch(api.tostifyError)
    //     break;  
    // }

    return (
        <div className="tile route-report-tile" ref={ref}>
            <div className="tile-info">
                <h2>Raport {props.type} z kursów</h2>
                <p>21.05.2021</p>
            </div>
            <div className="route-chart" style={{ height: '600px' }}>
                <h3>Liczba pasażerów na poszczególnych odcinkach trasy</h3>
                <h4>
                    <span>{props.driver.firstName} {props.driver.lastName}, </span>
                    <span>{props.vehicle.brand} {props.vehicle.model} {props.vehicle.year}, </span>
                    <span>{props.route.departureLocation} - {props.route.arrivalLocation}</span>
                </h4>
                <ResponsiveBar
                    data={barChartData}
                    keys={[ 'passengers']}
                    indexBy="przystanek"
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