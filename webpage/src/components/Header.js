import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../styles/Header.css';
import menuIcon from '../static/menu.svg';
import menuActiveIcon from '../static/menu_active.svg';

import * as api from '../api';
import HeaderItem from './HeaderItem';
import UserContext from '../contexts/User';

function Header() {
    let [name, setName] = useState('');
    let [menuExpanded, setMenuExpanded] = useState(true);

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

        if (menuExpanded && window.innerWidth <= 1780) {
            setMenuExpanded(false);
        }
        else if (menuExpanded && window.innerWidth > 1780) {
            setMenuExpanded(true);
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
            <nav className={ menuExpanded ? 'side' : 'side collapsed' }>
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
            <nav className={ menuExpanded ? 'side' : 'side collapsed' }>
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

    function toggleMenu() {
        setMenuExpanded(!menuExpanded);
    }

    window.addEventListener('resize', () => {
        if (menuExpanded && window.innerWidth <= 1780) {
            setMenuExpanded(false);
        }
        else if (menuExpanded && window.innerWidth > 1780) {
            setMenuExpanded(true);
        }
    });

    return (
        <div className="header-bar">
            <header>
                {
                    (role === 'owner' || role === 'office') &&
                    <button className={'menu-button' + (menuExpanded ? ' active' : '')}
                        style={{backgroundImage: `url(${menuExpanded ? menuActiveIcon : menuIcon})` }}
                        onClick={toggleMenu}></button>
                }
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
