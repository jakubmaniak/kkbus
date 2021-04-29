import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../styles/AuthPage.css';

import { fromValue } from '../helpers/from-value';

import * as api from '../api';

import background from '../static/background.jpg';


function LoginPage() {
    let history = useHistory();

    let [userLogin, setUserLogin] = useState('');
    let [userPassword, setUserPassword] = useState('');

    function handleSubmit(ev) {
        ev.preventDefault();
        
        api.login(userLogin, userPassword)
            .then(() => {
                history.replace('/');
            })
            .catch(api.toastifyError);
    }

    return (
        <div className="login-page">
            <div className="background" style={{backgroundImage: `url('${background}')`}}></div>
            <div className="container">
                <div className="login-panel">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    <h2>Logowanie</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Adres email lub login"
                            value={userLogin} onChange={fromValue(setUserLogin)} />
                        <input type="password" placeholder="Hasło"
                            value={userPassword} onChange={fromValue(setUserPassword)} />
                        <button className="submit">Zaloguj</button>
                    </form>
                    <div className="action">
                        <Link to="/rejestracja">Chcę się zarejestrować</Link>
                        <Link to="/przypomnienie-hasla">Nie pamiętam hasła</Link>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default LoginPage;
