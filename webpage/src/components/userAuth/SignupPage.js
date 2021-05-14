import React, { useState } from 'react';
import '../../styles/AuthPage.css';

import background from '../../static/background.jpg';

import { fromValue } from '../../helpers/from-value';
import * as api from '../../api';

import { Link, useHistory } from 'react-router-dom';

function SignupPage() {
    let history = useHistory();
    let [email, setEmail] = useState('');
    let [firstname, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');
    let [birthDate, setBirthDate] = useState('');
    let [phoneNumber, setPhoneNumber] = useState('');
    
    function handleSubmit(ev) {
        ev.preventDefault();

        api.register(email, firstname, lastName, birthDate, phoneNumber)
            .then(() => {
                history.replace('/');
            })
            .catch(api.toastifyError);
    }

    return (
        <div className="signup-page">
            <div className="background" style={{backgroundImage: `url('${background}')`}}></div>
            <div className="container">
                <div className="signup-panel">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    <h2>Rejestracja</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Adres email" 
                            value={email} onChange={fromValue(setEmail)} />
                        <div className="row">
                            <input type="text" placeholder="Imię" 
                                value={firstname} onChange={fromValue(setFirstName)} />
                            <input type="text" placeholder="Nazwisko" 
                                value={lastName} onChange={fromValue(setLastName)} />
                        </div>
                        <input type="date" placeholder="Data urodzenia" 
                            value={birthDate} onChange={fromValue(setBirthDate)} />
                        <input type="text" placeholder="Numer telefonu" 
                            value={phoneNumber} onChange={fromValue(setPhoneNumber)} />
                        <button className="submit">Zarejestruj</button>
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
