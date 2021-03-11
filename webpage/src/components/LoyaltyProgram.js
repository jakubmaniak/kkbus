import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import '../styles/LoyaltyProgram.css';

function LoyaltyProgram() {
    let [isLogged, setIsLogged] = useState(false);
    let history = useHistory();

    useEffect(() => {
        if(document.cookie) {
            setIsLogged(true);
        }
    }, [isLogged]);

    return (
        <div className="loyalty-program-page">
            <Header />
            <div className="main">
                <div className="left-side">
                    <div className="tile">
                        <div className="loyalty-program-container">
                            <h2>Sklep</h2>
                            {isLogged ? <h3>Punkty: 1156</h3> : null}
                        </div>
                        <div className="reward">
                            <p>Zniżka 10% (500 punktów)</p>
                            {isLogged ? <button>Kup</button> : null}
                        </div>
                        <div className="reward">
                            <p>1 bilet (2000 punktów)</p>
                            {isLogged ? <button>Kup</button> : null}
                        </div>
                        <div className="reward">
                            <p>2 bilety (3500 punktów)</p>
                            {isLogged ? <button>Kup</button> : null}
                        </div>
                    </div>
                </div>
                {isLogged ? 
                    <div className="right-side">
                        <h2>Historia zakupów</h2>
                        <p>28.01.2021 Kupiono 1 Bilet za 2000 punktów</p>
                        <p>28.01.2021 Kupiono 2 Bilety za 3500 punktów</p>
                    </div>
                :
                    <div className="right-side">
                        <h2>Dołącz do nas</h2>
                        <p>Załóż konto i korzystaj z nagród programu lojalnościowego.</p>
                        <div className="button-container">
                            <button className="signup" onClick={() => history.push('/rejestracja')}>Załóż konto</button>
                            <button className="login" onClick={() => history.push('/logowanie')}>Zaloguj</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default LoyaltyProgram;
