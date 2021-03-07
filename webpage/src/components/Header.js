import React from 'react';
import '../styles/Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="header-bar">
            <header>
                <h1 className="logo">
                    <span>KK</span>
                    <span>BUS</span>
                </h1>
                <div className="header-action">
                    <Link to ="/rejestracja">Rejestracja</Link>
                    <Link to ="/logowanie">Logowanie</Link>
                </div>
            </header>
            <nav>
                <div className="nav-action">
                    <Link>Trasy</Link>
                    <Link>Program lojalnościowy</Link>
                    <Link>Kontakt</Link>
                </div>
            </nav>
        </div>
    );
}

export default Header;
