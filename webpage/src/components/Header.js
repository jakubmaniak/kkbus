import React, { useEffect, useState } from 'react';
import '../styles/Header.css';
import { Link, useHistory } from 'react-router-dom';
import * as api from '../api';

function Header() {
    let [isLogged, setIsLogged] = useState(false);
    let [role, setRole] = useState('guest');
    let history = useHistory();

    useEffect(() => {
        const CURRENT_PAGE = window.location.pathname;
        let items = document.querySelectorAll('.item');

        for(let i = 0; i < items.length; i++) {
            if(items[i].innerHTML === 'Trasy' && CURRENT_PAGE === '/') {
                items[i].classList.add('selected');
            }
            else if(items[i].innerHTML === 'Program lojalnościowy' 
                    && CURRENT_PAGE === '/program-lojalnosciowy') {
                items[i].classList.add('selected');
            }
            else if (items[i].innerHTML.toLowerCase() === CURRENT_PAGE.replace('/', '')) {
                items[i].classList.add('selected');
            }
        }

        if(document.cookie) {
            setIsLogged(true);
            
            api.getUserInfo()
            .then((data) => {
                setRole(data.role);
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
                            <Link to ="/profil">Profil</Link>
                            <p onClick={signout}>Wyloguj</p>
                        </div>
                    :
                        <div className="header-action-signout">
                            <Link to ="/rejestracja">Rejestracja</Link>
                            <Link to ="/logowanie">Logowanie</Link>
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
                            <Link to="/"className="item">Grafik kursów</Link>
                            <Link to="/program-lojalnosciowy" className="item">Grafik pracy</Link>
                            <Link to="/kontakt" className="item">Pojazdy</Link>
                        </div>
                    : (role === 'client') ?
                        <div className="nav-action">
                            <Link to="/"className="item">Trasy</Link>
                            <Link to="/program-lojalnosciowy" className="item">Program lojalnościowy</Link>
                            <Link to="/kontakt" className="item">Kontakt</Link>
                        </div>
                    : 
                        <div className="nav-action">
                            <Link to="/"className="item">Trasy</Link>
                            <Link to="/program-lojalnosciowy" className="item">Program lojalnościowy</Link>
                            <Link to="/kontakt" className="item">Kontakt</Link>
                        </div>
                }
            </nav>
        </div>
    );
}

export default Header;
