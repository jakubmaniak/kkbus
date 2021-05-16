import React, { useEffect, useState } from 'react';
import '../../styles/WorkSchedule.css';

import * as api from '../../api';

import { routeFormatter } from '../../helpers/text-formatters';

import Dropdown from '../dropdowns/Dropdown';
import Loader from '../Loader';

function WorkSchedule() {
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        api.getDriverNames()
            .then((results) => setLoading(false))
            .catch(api.toastifyError);
    }, []);    

    return (
        <div className="work-schedule page">
            <div className="main">
               
            </div>
        </div>
    );
}

export default WorkSchedule;