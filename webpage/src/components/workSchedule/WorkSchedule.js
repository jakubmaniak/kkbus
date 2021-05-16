import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTable, useExpanded } from 'react-table';
import '../../styles/WorkSchedule.css';

import * as api from '../../api';

import { routeFormatter } from '../../helpers/text-formatters';

import Dropdown from '../dropdowns/Dropdown';
import Loader from '../Loader';

function Table({ columns, data }) {
    const {
        getTableProps,
        prepareRow,
        headerGroups,
        rows,
        state: { expanded }
    } = useTable({ columns, data }, useExpanded);

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

    return (
        <div className="work-schedule page">
            <div className="main">
                <Table
                    columns={[
                        {
                            Header: '',
                            accessor: 'name',
                            Cell: ({row}) => (
                                row.canExpand
                                ? (
                                    <span
                                        className="role-parent"
                                        onClick={() => row.toggleRowExpanded()}
                                    >
                                        <span className="role-parent__arrow">{row.isExpanded ? '▼' : '►'}</span>
                                        {row.values.name}
                                    </span>
                                )
                                : <span>{row.values.name}</span>
                            )
                        },
                        { Header: day.format('DD.MM.YYYY'), columns: hourHeaders }
                    ]}
                    data={[
                        { name: 'Jan Kowalski', h0: 'AAA', h6: 'X' },
                        {
                            name: 'Kierowcy',
                            subRows: [
                                { name: 'Tomasz Rajdowiec', h4: 'B', h6: 'YYY' },
                                { name: 'Kazimierz Rajdowiec', h2: 'CCC', h8: 'Z' }
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    );
}

export default WorkSchedule;