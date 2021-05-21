import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/AuthPage.css';
import background from '../../static/background.jpg';

import * as api from '../../api';
import Loader from '../Loader';

function PostActivation() {
    let { activationCode } = useParams();
    let [activated, setActivated] = useState();

    useEffect(() => {
        api.activateUserAccount(activationCode)
            .then(() => setActivated(true))
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
                        <p>Twoje konto zostało aktywowane.</p>
                        <p>Login i hasło zostały wysłane na twój e-mail</p>
                        <button className="submit">Zaloguj</button>
                    </>}
                    {activated === false && <>
                        <p>Wystąpił błąd podczas aktywacji konta</p>
                    </>}
                </div> 
            </div>
        </div>
    );
}

export default PostActivation;
