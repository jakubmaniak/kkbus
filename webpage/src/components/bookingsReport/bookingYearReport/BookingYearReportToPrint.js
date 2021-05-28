import React, { useEffect, useState } from 'react';
import '../../../styles/BookingReport.css';
import ReactApexChart from 'react-apexcharts';
import * as api from '../../../api';

const BookingReportYearToPrint = React.forwardRef((props, ref) => {  
    let [noReports, setNoReports] = useState(true);
    let [realizedCount, setRealizedCount] = useState([]);
    let [unrealizedCount, setUnRealizedCount] = useState([]);

    let data = {
        series: [
            {
                name: 'zrealizowane',
                data: realizedCount
            },
            {
                name: 'niezrealizowane',
                data: unrealizedCount
            }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            colors: ['#47BE61', '#C73535'],
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    horizontal: false,
                    columnWidth: '60%',
                },
            },
            xaxis: {
                categories:
                    [
                        'STY', 
                        'LUT', 
                        'MAR', 
                        'KWI',
                        'MAJ', 
                        'CZE',
                        'LIP',
                        'SIE',
                        'WRZ',
                        'PAŹ',
                        'LIS',
                        'GRU'
                    ],
            },
            legend: {
                position: 'right',
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        },
    }

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

                setRealizedCount(realized);
                setUnRealizedCount(unrealized);
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
                    <div className="pie-charts-container">
                        <ReactApexChart options={data.options} series={data.series} type="bar" height={350} width={800} />
                    </div>
            }
            <div className="button-container">
                <button className="print" onClick={props.handlePrint}>Drukuj</button>
            </div>
        </div>
    );
});

export default BookingReportYearToPrint;
