import React, { useEffect, useState } from 'react';
import '../../../styles/BookingReport.css';
import ReactApexChart from 'react-apexcharts';

const BookingReportYearToPrint = React.forwardRef((props, ref) => {
    // let [data, setData] = useState([]);
    //[{month: 2, id: 1, realized: 1, unrealized: 2}, {month: 2, id: 1, realized: 1, undrealized: 2}]

    let data = {
        series: [
            {
                name: 'zrealizowane',
                data: [13, 23, 20, 8, 13, 27, 44, 55, 41, 67, 22, 43]
            },
            {
                name: 'niezrealizowane',
                data: [160, 17, 15, 15, 21, 14, 44, 55, 41, 67, 22, 43]
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

    }, []);

    return (
        <div className="tile booking-year" ref={ref}>
            <div className="booking-month-info">
                <h2>Raport roczny z rezerwacji</h2>
                <p>{props.selectedYear}</p>
            </div>
            <div className="pie-charts-container">
                <ReactApexChart options={data.options} series={data.series} type="bar" height={350} width={800} />
            </div>
            <div className="button-container">
                <button className="print" onClick={props.handlePrint}>Drukuj</button>
            </div>
        </div>
    );
});

export default BookingReportYearToPrint;
