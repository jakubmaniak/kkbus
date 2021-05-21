import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import '../../styles/AuthPage.css';
import background from '../../static/background.jpg';

import * as api from '../../api';
import Loader from '../Loader';

function PostActivation() {
    let history = useHistory();
    let { activationCode } = useParams();
    let [activated, setActivated] = useState();

    useEffect(() => {
        api.activateUserAccount(activationCode)
            .then(() => {
                setActivated(true);
                setTimeout(() => {
                    history.replace('/');
                }, 5000);
            })
            .catch(() => setActivated(false));
    }, []);

    return (
        <div className="post-activation-page">
            <div className="background" style={{backgroundImage: `url('${background}')`}}></div>
            <div className="container">
                <div className="post-activation">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    {activated === undefined && <>
                        <Loader/>
                    </>}
                    {activated === true && <>
                        <p>Konto zostało aktywowane.</p>
                        <p>Login i hasło zostały wysłane na Twoją skrzynkę e-mail.</p>
                        <p>Za chwilę nastąpi przekierowanie...</p>
                    </>}
                    {activated === false && <>
                        <p>Wystąpił błąd aktywacji konta.</p>
                        <p>Link aktywacyjny jest niepoprawny</p>
                    </>}
                </div> 
            </div>
        </div>
    );
}

export default PostActivation;
