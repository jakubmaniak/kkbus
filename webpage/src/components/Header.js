import React, { useEffect, useState } from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

function Header() {
    let [isLogged, setIsLogged] = useState(false);

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
        }

    }, []);

    return (
        <div className="header-bar">
            <header>
                <div className="header-container">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    {isLogged ? 
                        <div className="header-action">
                            <Link to ="/profil">Profil</Link>
                            <Link to ="/">Wyloguj</Link>
                        </div>
                    :
                        <div className="header-action">
                            <Link to ="/rejestracja">Rejestracja</Link>
                            <Link to ="/logowanie">Logowanie</Link>
                        </div>
                    }
                </div>
            </header>
            <nav>
                <div className="nav-action">
                    <Link to="/"className="item">Trasy</Link>
                    <Link to="/program-lojalnosciowy" className="item">Program lojalnościowy</Link>
                    <Link to="/kontakt" className="item">Kontakt</Link>
                </div>
            </nav>
        </div>
    );
}

export default Header;
