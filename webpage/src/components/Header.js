import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../styles/Header.css';

import * as api from '../api';
import HeaderItem from './HeaderItem';
import UserContext from '../contexts/User';

function Header() {
    let [name, setName] = useState('');

    let { user, setUser } = useContext(UserContext);
    let { role, loggedIn } = user;

    let history = useHistory();

    useEffect(() => {
        if(document.cookie.includes('session')) {
            user.loggedIn = true;
            setUser({ ...user });

            api.getUserInfo()
            .then((data) => {
                user.role = data.role;
                
                setUser({ ...user });
                setName(data.firstName + ' ' + data.lastName);
            });
        }
    }, []);

    function signout() {
        api.logout()
        .then(() => {
            setUser({ loggedIn: false, role: 'guest' });
            history.replace('/');
        });
    }

    function ownerNav() {
        return (
            <nav className="side">
                <div className="nav-action">
                    <HeaderItem path="/">Grafik kursów</HeaderItem>
                    <HeaderItem path="/grafik-pracy">Grafik pracy</HeaderItem>
                    <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                    <HeaderItem path="#">Raporty</HeaderItem>
                    <HeaderItem path="/konta-i-rezerwacje-klientow">Konta i rezerwacje klientów</HeaderItem>
                    <HeaderItem path="/raport-z-kursu">Raport z kursu</HeaderItem>
                    <HeaderItem path="/pojazdy">Pojazdy</HeaderItem>
                    <HeaderItem path="/paliwo">Paliwo</HeaderItem>
                    <HeaderItem path="/lista-rezerwacji">Lista rezerwacji</HeaderItem>
                    <HeaderItem path="/kontakt">Kontakt</HeaderItem>
                </div>
            </nav>
        );
    }

    function officeNav() {
        return (
            <nav className="side">
                <div className="nav-action">
                    <HeaderItem path="/">Grafik kursów</HeaderItem>
                    <HeaderItem path="/grafik-pracy">Grafik pracy</HeaderItem>
                    <HeaderItem path="#">Raporty</HeaderItem>
                    <HeaderItem path="/konta-i-rezerwacje-klientow">Konta i rezerwacje klientów</HeaderItem>
                    <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                    <HeaderItem path="/pojazdy">Pojazdy</HeaderItem>
                    <HeaderItem path="/paliwo">Paliwo</HeaderItem>
                    <HeaderItem path="/kontakt">Kontakt</HeaderItem>
                </div>
            </nav>
        );
    }

    function driverNav() {
        return (
            <nav>
                <div className="nav-action">
                    <HeaderItem path="/">Grafik kursów</HeaderItem>
                    <HeaderItem path="/grafik-pracy">Grafik pracy</HeaderItem>
                    <HeaderItem path="#">Lista pasażerów</HeaderItem>
                    <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                    <HeaderItem path="/pojazdy">Pojazdy</HeaderItem>
                    <HeaderItem path="/raport-z-kursu">Raport z kursu</HeaderItem>
                    <HeaderItem path="/paliwo">Paliwo</HeaderItem>
                    <HeaderItem path="/lista-rezerwacji">Lista rezerwacji</HeaderItem>
                    <HeaderItem path="/kontakt">Kontakt</HeaderItem>
                </div>
            </nav>
        );
    }

    function clientGuestNav() {
        return (
            <nav>
                <div className="nav-action">
                    <HeaderItem path="/">Grafik kursów</HeaderItem>
                    <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                    <HeaderItem path="/kontakt">Kontakt</HeaderItem>
                </div>
            </nav>
        );
    }


    return (
        <div className="header-bar">
            <header>
                <div className="header-container">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    {loggedIn ? 
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
            {
                (role === 'owner') ? 
                    ownerNav()
                : (role === 'office') ? 
                    officeNav()
                : (role === 'driver') ?
                    driverNav()
                : 
                    clientGuestNav()
            }
        </div>
    );
}

export default Header;
