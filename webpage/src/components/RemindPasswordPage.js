import React from 'react';
import background from '../static/background.jpg';
import '../styles/AuthPage.css';

import { Link } from 'react-router-dom';

function RemindPasswordPage() {
    return (
        <div className="remind-password-page">
            <div className="background" style={{backgroundImage: `url('${background}')`}}></div>
            <div className="container">
                <div className="remind-password-panel">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    <h2>Przypomnienie hasła</h2>
                    <form>
                        <input type="text" placeholder="Adres email" />
                        <button className="submit">Przypomnij hasło</button>
                    </form>
                    <div className="action">
                        <Link to="/logowanie">Już pamiętam</Link>
                    </div>
                </div> 
            </div>
        </div>
    );
}

export default RemindPasswordPage;
