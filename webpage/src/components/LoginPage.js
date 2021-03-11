import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useValue } from '../helpers/use-value';
import * as api from '../api';

import background from '../static/background.jpg';
import '../styles/AuthPage.css';



function LoginPage() {
    let [userLogin, setUserLogin] = useState('');
    let [userPassword, setUserPassword] = useState('');

    function handleSubmit(ev) {
        ev.preventDefault();

        alert(userLogin + ':' + userPassword);
        
        api.login(userLogin, userPassword)
        .then((data) => {
            alert('ok');
        })
        .catch((err) => {
            alert('Błąd: ' + err);
        });
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
                            value={userLogin} onChange={useValue(setUserLogin)} />
                        <input type="password" placeholder="Hasło"
                            value={userPassword} onChange={useValue(setUserPassword)} />
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
