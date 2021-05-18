import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTable, useExpanded } from 'react-table';
import '../../styles/WorkSchedule.css';

import * as api from '../../api';

import Loader from '../Loader';

function Table({ columns, data }) {
    const {
        getTableProps,
        prepareRow,
        headerGroups,
        rows,
        state: { expanded },
        toggleAllRowsExpanded,
    } = useTable({ columns, data }, useExpanded);

    useEffect(() => {
        toggleAllRowsExpanded?.(true);
    }, [toggleAllRowsExpanded, data]);

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr>
                            {row.cells.map((cell) => {
                                return <td>{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

function WorkSchedule() {
    let [loading, setLoading] = useState(false);
    let [day, setDay] = useState(dayjs());

    let hourHeaders = [...new Array(24).keys()].map((i) => {
        return {
            Header: i.toString().padStart(2, '0') + ':00',
            accessor: 'h' + i
        };
    });
    
    useEffect(() => {
        api.getDriverNames()
            .then((results) => setLoading(false))
            .catch(api.toastifyError);
    }, []);    

    let nameCellRenderer = ({row}) => {
        if (row.canExpand) {
            return (
                <span
                    className="role-parent"
                    onClick={() => row.toggleRowExpanded()}
                >
                    <span className="role-parent__arrow">{row.isExpanded ? '▼' : '►'}</span>
                    {row.values.name}
                </span>
            );
        }
        
        return <span>{row.values.name}</span>;
    };

    let data = useMemo(() =>
        [
            {
                name: 'Jan Kowalski',
                h0: ['12:30', <strong>A</strong>],
                h6: 'X'
            },
            {
                name: 'Kierowcy',
                subRows: [
                    { name: 'Tomasz Rajdowiec', h4: 'B', h6: 'Y' },
                    { name: 'Kazimierz Rajdowiec', h2: 'CCC', h8: 'Z' }
                ]
            }
        ]
    );

    return (
        <div className="work-schedule page">
            <div className="main">
                <Table
                    columns={[
                        {
                            Header: '',
                            accessor: 'name',
                            Cell: nameCellRenderer
                        },
                        { Header: day.format('DD.MM.YYYY'), columns: hourHeaders }
                    ]}
                    data={data}
                />
            </div>
        </div>
    );
}

export default WorkSchedule;