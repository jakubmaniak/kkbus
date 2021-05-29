import React, { useEffect, useState } from 'react';
import '../../../styles/BookingReport.css';
import { ResponsivePie } from '@nivo/pie';
import * as api from '../../../api';

const BookingReportMonthToPrint = React.forwardRef((props, ref) => {
    let [realizedCount, setRealizedCount] = useState(0);
    let [unrealizedCount, setUnRealizedCount] = useState(0);
    let [noReports, setNoReports] = useState(true);
    let [dataPercents, setDataPercents] = useState([]);

    let data = [
        {
            "id": "zrealizowane",
            "label": "zrealizowane",
            "value": realizedCount,
        },
        {
            "id": "niezrealizowane",
            "label": "niezrealizowane",
            "value": unrealizedCount,
        }
    ];

    function round(number) {
        number = Math.round(number + "e" + 2);
        return Number(number + "e" + - 2);
    }

    function dataToPercents(realizedResults, unrealizedResults) {
        let dataToPercents = [
            {
                "id": "zrealizowane",
                "label": "zrealizowane",
                "value": realizedResults,
            },
            {
                "id": "niezrealizowane",
                "label": "niezrealizowane",
                "value": unrealizedResults,
            }
        ];

        let realized = dataToPercents[0].value;
        let unrealized = dataToPercents[1].value;

        let sum = realized + unrealized;
        let realizedToPercents = round(realized / sum);
        let unrealizedToPercents = round(unrealized / sum);

        dataToPercents[0].value = realizedToPercents;
        dataToPercents[1].value = unrealizedToPercents;

        return dataToPercents;
    }

    useEffect(() => {
        api.getBookingReportByMonth(props.selectedYear, props.selectedMonthIndex)
            .then((results) => {
                setRealizedCount(results.realizedCount);
                setUnRealizedCount(results.unrealizedCount);
                setNoReports(false);
                setDataPercents(() => dataToPercents(results.realizedCount, results.unrealizedCount));
            })
            .catch((err) => {
                if(err.message === 'not_found') {
                    setNoReports(true);
                }
                else
                    api.toastifyError(err);
            });
    }, [props.selectedYear, props.selectedMonthIndex]);

    return (
        <div className="tile booking-month" ref={ref}>
            <div className="booking-month-info">
                <h2>Raport miesięczny z rezerwacji</h2>
                <p>{props.selectedMonth} {props.selectedYear}</p>
            </div>
                {noReports ? 
                    <p>Nie znaleziono raportów</p>
                : 
                <div className="pie-charts-container">
                    <div className="pie-chart-container" style={{height: '400px'}}>
                        <ResponsivePie
                            data={data}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            innerRadius={0}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                            colors={[ '#47BE61', '#C73535' ]}
                            enableArcLinkLabels={false}
                            isInteractive={false}
                            animate={false}
                            theme={{
                                fontFamily: 'Poppins',
                                labels: {
                                    text: {
                                        fontSize: 20,
                                        fill: "#FFF"
                                    }
                                },
                                legends: {
                                    text: {
                                        fontSize: 14,
                                        fontFamily: 'Poppins',
                                        letterSpacing: 0,
                                    }
                                }
                            }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 50,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#000',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 20,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </div>
                    <div className="pie-chart-container" style={{height: '400px'}}>
                    <ResponsivePie
                            data={dataPercents}
                            valueFormat=" >-.0%"
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            innerRadius={0}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
                            colors={[ '#47BE61', '#C73535' ]}
                            enableArcLinkLabels={false}
                            isInteractive={false}
                            animate={false}
                            theme={{
                                fontFamily: 'Poppins',
                                labels: {
                                    text: {
                                        fontSize: 20,
                                        fill: "#FFF"
                                    }
                                },
                                legends: {
                                    text: {
                                        fontSize: 14,
                                        fontFamily: 'Poppins',
                                        letterSpacing: 0,
                                    }
                                }
                            }}
                            legends={[
                                {
                                    anchor: 'bottom',
                                    direction: 'row',
                                    justify: false,
                                    translateX: 0,
                                    translateY: 56,
                                    itemsSpacing: 50,
                                    itemWidth: 100,
                                    itemHeight: 18,
                                    itemTextColor: '#000',
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 1,
                                    symbolSize: 20,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </div>
                </div>
            }    
            <div className="button-container">
                <button className="print" onClick={props.handlePrint}>Drukuj</button>
            </div>
        </div>
    );
});

export default BookingReportMonthToPrint;
