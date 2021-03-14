import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import '../styles/LoyaltyProgram.css';

import UserContext from '../contexts/User';

function LoyaltyProgram() {
    let history = useHistory();

    let { role } = useContext(UserContext).user;

    return (
        <div className="loyalty-program page">
            <div className="main">
                    <div className="tile half">
                        <div className="title">
                            <h2>Sklep</h2>
                            {role === 'client' ? <h3 className="points">Punkty: 1156</h3> : null}
                        </div>
                        <div className="reward">
                            <p>Zniżka 10% (500 punktów)</p>
                            {(role === 'client') ? 
                                <button>Kup</button> 
                            : (role === 'owner') ?
                                <div className="modify">
                                    <button className="edit">Edytuj</button>
                                    <button className="delete">Usuń</button>
                                </div>
                            : null
                            }
                        </div>
                        <div className="reward">
                            <p>1 bilet (2000 punktów)</p>
                            {(role === 'client') ? 
                                <button>Kup</button>
                            : (role === 'owner') ?
                                <div className="modify">
                                    <button className="edit">Edytuj</button>
                                    <button className="delete">Usuń</button>
                                </div>
                            : null}
                        </div>
                        <div className="reward">
                            <p>2 bilety (3500 punktów)</p>
                            {role === 'client' ? 
                                <button>Kup</button>
                            : (role === 'owner') ?
                                <div className="modify">
                                    <button className="edit">Edytuj</button>
                                    <button className="delete">Usuń</button>
                                </div>
                            : null}
                        </div>
                    </div>
                {(role === 'client') ? 
                    <div className="tile half">
                        <h2>Historia zakupów</h2>
                        <p>28.01.2021 Kupiono 1 Bilet za 2000 punktów</p>
                        <p>28.01.2021 Kupiono 2 Bilety za 3500 punktów</p>
                    </div>
                : (role === 'guest') ?
                    <div className="tile half">
                        <h2>Dołącz do nas</h2>
                        <p>Załóż konto i korzystaj z nagród programu lojalnościowego.</p>
                        <div className="button-container">
                            <button className="signup" onClick={() => history.push('/rejestracja')}>Załóż konto</button>
                            <button className="login" onClick={() => history.push('/logowanie')}>Zaloguj</button>
                        </div>
                    </div>
                : (role === 'owner') ?
                    <div className="tile half">
                        <h2>Stan nagród</h2>
                        <div className="loyalty-program-container">    
                            <div className="reward">
                                <p>Zniżka 10% (500 punktów)</p>
                                <button className="edit">Edytuj</button>
                            </div>
                            <div className="reward">
                                <p>Zniżka 10% (500 punktów)</p>
                                <button className="edit">Edytuj</button>
                            </div>
                            <div className="reward">
                                <p>Zniżka 10% (500 punktów)</p>
                                <button className="edit">Edytuj</button>
                            </div>
                        </div>
                    </div>
                : null
                }
            </div>
        </div>
    );
}

export default LoyaltyProgram;
