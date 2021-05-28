import React, { useEffect, useState } from 'react';
import '../../../styles/BookingReport.css';
import BookingPieChart from '../BookingPieChart';
import * as api from '../../../api';

const BookingReportMonthToPrint = React.forwardRef((props, ref) => {
    let [realizedCount, setRealizedCount] = useState(0);
    let [unrealizedCount, setUnRealizedCount] = useState(0);
    let [noReports, setNoReports] = useState(true);

    useEffect(() => {
        api.getBookingReportByMonth(props.selectedYear, props.selectedMonthIndex)
            .then((results) => {
                setRealizedCount(results.realizedCount);
                setUnRealizedCount(results.unrealizedCount);
                setNoReports(false);
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
                    <BookingPieChart 
                        data={[
                            {
                                title: 'zrealizowane',
                                value: realizedCount,
                                color: '#47BE61'
                            },
                            {
                                title: 'niezrealizowane',
                                value: unrealizedCount,
                                color: '#C73535'
                            }
                        ]}
                        label={(props) => { return props.dataEntry.value; }}
                    />
                    <BookingPieChart 
                        data={[
                            {
                                title: 'zrealizowane',
                                value: realizedCount,
                                color: '#47BE61'
                            },
                            {
                                title: 'niezrealizowane',
                                value: unrealizedCount,
                                color: '#C73535'
                            }
                        ]}
                        label={({ dataEntry }) => { return Math.round(dataEntry.percentage) + '%'; }}
                    />
                </div>
            }    
            <div className="button-container">
                <button className="print" onClick={props.handlePrint}>Drukuj</button>
            </div>
        </div>
    );
});

export default BookingReportMonthToPrint;
