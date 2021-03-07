import React from 'react';
import background from '../static/background.jpg';
import '../styles/AuthPage.css';

import { Link } from 'react-router-dom';

 function LoginPage() {
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
                    <form>
                        <input type="text" placeholder="Adres email lub login" />
                        <input type="password" placeholder="Hasło" />
                        <button className="submit">Zaloguj</button>
                    </form>
                    <div className="action">
                        <Link to="/rejestracja">Chcę się zarejestrować</Link>
                        <Link to="/">Nie pamiętam hasła</Link>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default LoginPage;
