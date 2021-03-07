import React from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

function Header() {
    function setActivePage(ev) {
        let items = document.querySelectorAll('.item');
        items.forEach((item) => {
            item.classList.remove('selected');
        });
        ev.target.classList.add('selected');
    }

    return (
        <div className="header-bar">
            <header>
                <div class="header-container">
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
                    <Link to="/"className="item" onClick={(ev) => setActivePage(ev)}>Trasy</Link>
                    <Link to="/program-lojalnosciowy"className="item" onClick={(ev) => setActivePage(ev)}>Program lojalnościowy</Link>
                    <Link to="/kontakt" className="item" onClick={(ev) => setActivePage(ev)}>Kontakt</Link>
                </div>
            </nav>
        </div>
    );
}

export default Header;
