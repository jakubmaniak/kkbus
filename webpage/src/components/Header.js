import React, { useEffect, useState } from 'react';
import '../styles/Header.css';
import { Link, useHistory } from 'react-router-dom';
import * as api from '../api';
import HeaderItem from './HeaderItem';

function Header() {
    let [isLogged, setIsLogged] = useState(false);
    let [role, setRole] = useState('guest');
    let [name, setName] = useState('');
    let history = useHistory();

    useEffect(() => {
        if(document.cookie.includes('session')) {
            setIsLogged(true);
            
            api.getUserInfo()
            .then((data) => {
                setRole(data.role);
                setName(data.firstName + ' ' + data.lastName);
            });
        }

    }, []);

    function signout() {
        api.logout()
        .then(() => {
            setIsLogged(false);
            setRole('guest');
            history.replace('/');
        });
    }

    return (
        <div className="header-bar">
            <header>
                <div className="header-container">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    {isLogged ? 
                        <div className="header-action-signin">
                            <Link to ="/profil">{name}</Link>
                            <p onClick={signout}>Wyloguj</p>
                        </div>
                    :
                        <div className="header-action-signout">
                            <Link to="/rejestracja">Rejestracja</Link>
                            <Link to="/logowanie">Logowanie</Link>
                        </div>
                    }
                </div>
            </header>
            <nav>
                {
                    (role === 'owner') ? 
                        null 
                    : (role === 'office') ? 
                        null
                    : (role === 'driver') ?
                        <div className="nav-action">
                            <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                            <HeaderItem path="/">Grafik kursów</HeaderItem>
                            <HeaderItem path="#">Grafik pracy</HeaderItem>
                            <HeaderItem path="/pojazdy">Pojazdy</HeaderItem>
                        </div>
                    : (role === 'client') ?
                        <div className="nav-action">
                            <HeaderItem path="/">Trasy</HeaderItem>
                            <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                            <HeaderItem path="/kontakt">Kontakt</HeaderItem>
                        </div>
                    : 
                        <div className="nav-action">
                            <HeaderItem path="/">Trasy</HeaderItem>
                            <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                            <HeaderItem path="/kontakt">Kontakt</HeaderItem>
                        </div>
                }
            </nav>
        </div>
    );
}

export default Header;
