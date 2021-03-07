import React from 'react';
import '../styles/AuthPage.css';
import background from '../static/background.jpg';

import { Link } from 'react-router-dom';

function SignupPage() {
    return (
        <div className="signup-page">
            <div className="background">
                <img src={background} alt="background"></img>
            </div>
            <div className="container">
                <div className="signup-panel">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    <h2>Rejestracja</h2>
                    <form>
                        <input type="text" placeholder="Adres email" />
                        <div>
                            <input type="text" placeholder="Imię" />
                            <input type="text" placeholder="Nazwisko" />
                        </div>
                        <input type="password" placeholder="Hasło" />
                        <input type="date" placeholder="Data urodzenia" />
                        <input type="text" placeholder="Numer telefonu" />
                        <button className="submit">Zaloguj</button>
                    </form>
                    <div className="action">
                        <Link to="/logowanie">Mam już konto</Link>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default SignupPage;
