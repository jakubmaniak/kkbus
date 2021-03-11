import React, { useState } from 'react';
import Header from './Header';
import '../styles/LoyaltyProgram.css';

function LoyaltyProgram() {
    let [isLogged, setIsLogged] = useState(false);

    return (
        <div className="loyalty-program-page">
            <Header isLogged={ false }/>
            <div className="main">
                <div className="left-side">
                    <div className="tile">
                        <h2>Sklep</h2>
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
                            <button className="signup">Załóż konto</button>
                            <button className="login">Zaloguj</button>
                        </div>
                    </div>
                }
            </div>
            
            
        </div>
    );
}

export default LoyaltyProgram;