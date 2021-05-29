import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import * as api from '../../api';

const RouteTypeReport = React.forwardRef((props, ref) => {
    let [data, setData] = useState([
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
                {/* <h3>
                    <p>
                        <span>Kierowca: </span>
                        <span>Tomasz Rajdowiec</span>
                    </p>
                    <p>
                        <span>Pojazd: </span>
                        <span>Mercedes Benz 2015</span>  
                    </p>
                    <p>
                        <span>Trasa: </span>
                        <span>Kraków - Katowice</span> 
                    </p>
                </h3> */}
                <h3>
                    Liczba pasażerów na poszczególnych odcinkach trasy
                    
                </h3>
                <h4>
                    <span>Tomasz Rajdowiec, </span>
                    <span>Mercedes Benz 2015, </span>
                    <span>Kraków - Katowice</span>
                </h4>
                <ResponsiveBar
                    data={data}
                    keys={[ 'passengers']}
                    indexBy="przystanek"
                    margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                    padding={0.5}
                    valueScale={{ type: "linear" }}
                    groupMode="grouped"
                    labelTextColor="#FFFFFF"
                    colors={['#47BE61']}
                    axisTop={null}
                    axisRight={null}
                    axisLeft={{
                        legend: 'liczba pasażerów',
                        legendOffset: -42
                    }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'przystanek',
                        legendOffset: 42
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
                                    fontSize: 13
                                }
                            }
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
        </div>
    );
})

export default RouteTypeReport;