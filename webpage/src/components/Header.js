import React, { useEffect } from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

function Header() {
    const CURRENT_PAGE = window.location.pathname;
    
    useEffect(() => {
        let items = document.querySelectorAll('.item');
        for(let i = 0; i < items.length; i++) {
            if(items[i].innerHTML === 'Trasy') {
                if(CURRENT_PAGE === '/') {
                    items[i].classList.add('selected');
                    console.log('/trasy');
                }
            }
            if(items[i].innerHTML.toLowerCase() === CURRENT_PAGE.replace('/', '')) {
                items[i].classList.add('selected');
            }
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
                    <div className="header-action">
                        <Link to ="/rejestracja">Rejestracja</Link>
                        <Link to ="/logowanie">Logowanie</Link>
                    </div>
                </div>
            </header>
            <nav>
                <div className="nav-action">
                    <Link to="/"className="item">Trasy</Link>
                    <Link to="/program-lojalnosciowy"className="item">Program lojalnościowy</Link>
                    <Link to="/kontakt" className="item">Kontakt</Link>
                </div>
            </nav>
        </div>
    );
}

export default Header;
