import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import '../styles/LoyaltyProgram.css';
import * as api from '../api';

import UserContext from '../contexts/User';
import Reward from './Reward';

function LoyaltyProgram() {
    let history = useHistory();
    let [rewards, setRewards] = useState([
        {
            id: 1,
            name: 'Zniżka 10%',
            requiredPoints: 5000,
            amount: 0,
            limit: 0
        },
        {
            id: 2,
            name: 'Zniżka 20%',
            requiredPoints: 8000,
            amount: 0,
            limit: 0
        },
        {
            id: 3,
            name: 'Zniżka 40%',
            requiredPoints: 12000,
            amount: 0,
            limit: 0
        },
        {
            id: 4,
            name: 'Mała maskotka firmy',
            requiredPoints: 12000,
            amount: 500,
            limit: 3
        },
        {
            id: 5,
            name: 'Duża maskotak firmy',
            requiredPoints: 20000,
            amount: 100,
            limit: 1
        },
    ]);

    let { role } = useContext(UserContext).user;

    function updateReward() {
        //api.updateReward()
    }

    function deleteReward() {

    }

    function clientGuestTile() {
        return (
            <div className="main">
                <div className='tile half'>
                    <div className="title">
                        <h2>Sklep</h2>
                        {role === 'client' ? <h3 className="points">Punkty: 1156</h3> : null}
                    </div>
                    {rewards.map((reward, i) => {
                        return (
                            <Reward key={i}
                                role={role}
                                name={reward.name}
                                requiredPoints={reward.requiredPoints}
                            />
                        );
                    })}
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
                    {rewards.map((reward, i) => {
                        return (
                            <Reward key={i}
                                role={role}
                                name={reward.name}
                                requiredPoints={reward.requiredPoints}
                                amount={reward.amount}
                                limit={reward.limit}
                            />
                        );
                    })}
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
