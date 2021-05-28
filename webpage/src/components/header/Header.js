import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../../styles/Header.css';

import menuIcon from '../../static/menu.svg';
import menuActiveIcon from '../../static/menu_active.svg';

import * as api from '../../api';

import HeaderItem from './HeaderItem';
import UserContext from '../../contexts/User';

function Header() {
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
                    user.id = data.id;
                    user.loaded = true;
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    
                    setUser({ ...user });
                })
                .catch(api.toastifyError);
        }
        
        handlePageResize();
        window.addEventListener('resize', handlePageResize);

        return () => window.removeEventListener('resize', handlePageResize);
    }, []);


    function signout() {
        api.logout()
            .then(() => {
                setUser({ loggedIn: false, role: 'guest' });
                history.replace('/');
            })
            .catch(api.toastifyError);
    }

    function handlePageResize() {
        if (menuExpanded && window.innerWidth <= 1780) {
            menuExpanded = false;
            setMenuExpanded(menuExpanded);
        }
        else if (!menuExpanded && window.innerWidth > 1780) {
            menuExpanded = true;
            setMenuExpanded(menuExpanded);
        }
    }

    function handleMenuClick(ev) {
        if (window.innerWidth <= 1780) {
            setMenuExpanded(false);
        }
    }

    function toggleMenu() {
        setMenuExpanded(!menuExpanded);
    }

    function ownerNav() {
        return (
            <nav className={ menuExpanded ? 'side' : 'side collapsed' }>
                <div className="nav-action" onClick={handleMenuClick}>
                    <HeaderItem path="/">Grafik kursów</HeaderItem>
                    <HeaderItem path="/grafik-pracy">Grafik pracy</HeaderItem>
                    <HeaderItem path="/dyspozycyjnosc">Dyspozycyjność</HeaderItem>
                    <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                    <HeaderItem path="/raporty-z-rezerwacji">Raporty z rezerwacji</HeaderItem>
                    <HeaderItem path="/konta-i-rezerwacje-klientow">Konta i rezerwacje klientów</HeaderItem>
                    <HeaderItem path="/zloz-raport-z-kursu">Złóż raport z kursu</HeaderItem>
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
                <div className="nav-action" onClick={handleMenuClick}>
                    <HeaderItem path="/">Grafik kursów</HeaderItem>
                    <HeaderItem path="/grafik-pracy">Grafik pracy</HeaderItem>
                    <HeaderItem path="/dyspozycyjnosc">Dyspozycyjność</HeaderItem>
                    <HeaderItem path="/raporty-z-rezerwacji">Raporty z rezerwacji</HeaderItem>
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
                    <HeaderItem path="/dyspozycyjnosc">Dyspozycyjność</HeaderItem>
                    <HeaderItem path="#">Lista pasażerów</HeaderItem>
                    <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                    <HeaderItem path="/pojazdy">Pojazdy</HeaderItem>
                    <HeaderItem path="/zloz-raport-z-kursu">Złóż raport z kursu</HeaderItem>
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
                    {role === 'client' ? <HeaderItem path="/rezerwacje">Rezerwacje</HeaderItem> : null}
                    <HeaderItem path="/program-lojalnosciowy">Program lojalnościowy</HeaderItem>
                    <HeaderItem path="/kontakt">Kontakt</HeaderItem>
                </div>
            </nav>
        );
    }

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
                    <h1 className="logo" onClick={() => history.push('/')}>
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    {loggedIn ? 
                        <div className="header-action-signin">
                            <Link to ="/profil">{user.firstName} {user.lastName}</Link>
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
