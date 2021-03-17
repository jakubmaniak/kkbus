import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import '../styles/LoyaltyProgram.css';

import UserContext from '../contexts/User';
import Reward from './Reward';

function LoyaltyProgram() {
    let history = useHistory();

    let { role } = useContext(UserContext).user;

    function clientGuestTile() {
        return (
            <div className="main">
                <div className='tile half'>
                    <div className="title">
                        <h2>Sklep</h2>
                        {role === 'client' ? <h3 className="points">Punkty: 1156</h3> : null}
                    </div>
                    <Reward 
                        role={role}
                        rewardName='Zniżka 10%'
                        rewardPoints='500 punktów'
                    />
                    <Reward 
                        role={role}
                        rewardName='1 bilet'
                        rewardPoints='2000 punktów'
                    />
                    <Reward 
                        role={role}
                        rewardName='2 bilety'
                        rewardPoints='3500 punktów'
                    />
                </div>
                {
                    (role === 'guest') ? 
                        <div className="tile half">
                            <h2>Dołącz do nas</h2>
                            <p>Załóż konto i korzystaj z nagród programu lojalnościowego.</p>
                            <div className="button-container">
                                <button className="signup" onClick={() => history.push('/rejestracja')}>Załóż konto</button>
                                <button className="login" onClick={() => history.push('/logowanie')}>Zaloguj</button>
                            </div>
                        </div>
                    : 
                        <div className="tile half">
                            <h2>Historia zakupów</h2>
                            <p>28.01.2021 Kupiono 1 Bilet za 2000 punktów</p>
                            <p>28.01.2021 Kupiono 2 Bilet za 3500 punktów</p>
                        </div>
                }
            </div>
        );
    }

    function ownerTile() {
        return (
            <div className="main">
                <div className="tile">
                    <h2>Nagrody</h2>
                    <div className="reward-header">
                        <span>Nazwa</span>
                        <span>Wymagane punkty</span>
                        <span>Stan magazynu</span>
                        <span>Limit na 1 osobę</span>
                    </div>
                    <Reward
                        role={role}
                        rewardName='Zniżka 10%'
                        rewardPoints='500 punktów'
                    >
                        <span>nieograniczony</span>
                        <span>bez limitu</span>
                        <div className="modify">
                            <button className="edit">Edytuj</button>
                            <button className="delete">Usuń</button>
                        </div>
                    </Reward>
                    <Reward
                        role={role}
                        rewardName='1 bilet'
                        rewardPoints='2000 punktów'
                    >
                        <span>nieograniczony</span>
                        <span>bez limitu</span>
                        <div className="modify">
                            <button className="edit">Edytuj</button>
                            <button className="delete">Usuń</button>
                        </div>
                    </Reward> 
                        
                    <Reward
                        role={role}
                        rewardName='2 bilety'
                        rewardPoints='3500 punktów'
                    >
                        <span>nieograniczony</span>
                        <span>bez limitu</span>
                        <div className="modify">
                            <button className="edit">Edytuj</button>
                            <button className="delete">Usuń</button>
                        </div>
                    </Reward> 
                    <Reward
                        role={role}
                        rewardName='Maskotka firmy'
                        rewardPoints='4000 punktów'
                    >
                        <span>1000 sztuk</span>
                        <span>1 sztuka/osobę</span>
                        <div className="modify">
                            <button className="edit">Edytuj</button>
                            <button className="delete">Usuń</button>
                        </div>
                    </Reward>
                </div>
            </div>
        );
    }

    return (
        <div className="loyalty-program page">
            {(role === 'owner') ? ownerTile() : clientGuestTile()}
        </div>
    );
}

export default LoyaltyProgram;
