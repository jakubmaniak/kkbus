import React, { useEffect, useState } from 'react';
import '../../../styles/BookingReport.css';
import * as api from '../../../api';
import { ResponsiveBar } from '@nivo/bar';

const BookingReportYearToPrint = React.forwardRef((props, ref) => {  
    let [noReports, setNoReports] = useState(true);
    let months = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'];
    let [data, setData] = useState([]);

    useEffect(() => {
        api.getManyBookingReportsByYear(props.selectedYear)
            .then((results) => {
                setNoReports(false);

                let realized = new Array(12).fill(0);
                let unrealized = new Array(12).fill(0);

                for(let report of results) {
                    realized[report.month] = report.realizedCount;
                    unrealized[report.month] = report.unrealizedCount;
                }

                let reportData = [];

                for(let i = 0; i < 12; i++) {
                    reportData[i] = {'month': months[i], 'zrealizowane': realized[i + 1], 'niezrealizowane': unrealized[i + 1]}
                }

                setData(reportData);
            })
            .catch((err) => {
                if(err.message === 'not_found') {
                    setNoReports(true);
                }
                else
                    api.toastifyError(err);
            });

            
    }, [props.selectedYear]);

    return (
        <div className="tile booking-year" ref={ref}>
            <div className="booking-month-info">
                <h2>Raport roczny z rezerwacji</h2>
                <p>{props.selectedYear}</p>
            </div>
            {noReports ? 
                    <p>Nie znaleziono raportów</p>
                : 
                    <div className="pie-charts-container" style={{ height: 600 }}>
                        <ResponsiveBar
                            data={data}
                            keys={[ 'zrealizowane', 'niezrealizowane']}
                            indexBy="month"
                            margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                            padding={0.2}
                            valueScale={{ type: "symlog" }}
                            groupMode="grouped"
                            labelTextColor="#FFFFFF"
                            colors={[ '#47BE61', '#C73535' ]}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0
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
                                            fontSize: 15
                                        }
                                    }
                                },
                                labels: {
                                   text: {
                                       fontSize: 14
                                   } 
                                },
                                legends: {
                                    text: {
                                        fontSize: 14,
                                        fontFamily: 'Poppins',
                                        letterSpacing: 0
                                    }
                                }
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 70,
                                    itemsSpacing: 50,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 20,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                            isInteractive={false}
                            animate={false}
                            motionStiffness={90}
                            motionDamping={15}
                        />
                    </div>
            }
            <div className="button-container">
                <button className="print" onClick={props.handlePrint}>Drukuj</button>
            </div>
        </div>
    );
});

export default BookingReportYearToPrint;
