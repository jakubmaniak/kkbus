import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import '../styles/LoyaltyProgram.css';
import * as api from '../api';
import { useValue } from '../helpers/use-value';

import UserContext from '../contexts/User';
import Reward from './Reward';
import Modal from './Modal';

function LoyaltyProgram() {
    let history = useHistory();
    let [rewards, setRewards] = useState([]);
    let [modalVisibility, setModalVisibility] = useState(false);
    let [name, setName] = useState('');
    let [requiredPoints, setRequiredPoints] = useState('');
    let [amount, setAmount] = useState('');
    let [limit, setLimit] = useState('');

    let { role } = useContext(UserContext).user;

    useEffect(() => {
        api.getAllRewards()
        .then((results) => {
            setRewards(results);
        });
    }, []);

    function updateRewards() {
        api.getAllRewards()
        .then((results) => {
            setRewards(results);
        });
    }

    function addReward() {
        let currentRequirePoints = parseInt(requiredPoints);
        let currentAmount = parseInt(amount * 1);
        let currentLimit = parseInt(limit * 1);
        
        let isDataCorrect;

        if((name !== '' && (!Number.isInteger(name))) && ((requiredPoints !== '') && (Number.isInteger(currentRequirePoints)))) {
            if(amount === '' && limit === '') {
                api.addReward(name, currentRequirePoints, currentAmount, currentLimit);
                isDataCorrect = true;
            }
            else if(amount !== '' || limit !== '') {
                if((Number.isInteger(currentAmount))  && (Number.isInteger(currentLimit))) {
                    api.addReward(name, currentRequirePoints, currentAmount, currentLimit);
                    isDataCorrect = true;  
                }               
            }
            else {
                api.addReward(name, currentRequirePoints, currentAmount, currentLimit);
                isDataCorrect = true;
            }
        }
        else {
            alert('Wypełnij poprawnie dane');
        }

        if(isDataCorrect) {
            setRewards(rewards => [...rewards, 
                {
                    id: rewards.length, 
                    name: name, 
                    requiredPoints: currentRequirePoints, 
                    amount: currentAmount, 
                    limit: currentLimit
                }
            ]);
            setModalVisibility(false);
        }
    }

    function showModal() {
        setName('');
        setRequiredPoints('');
        setAmount('');
        setLimit('');
        setModalVisibility(true);
    }

    function deleteReward(rewardId) {
        let reward = rewards.find(({id}) => id === rewardId);
        let index = rewards.indexOf(reward);     

        api.deleteReward(rewardId);

        rewards.splice(index, 1);
        setRewards(rewards);
        
        updateRewards();
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
                                rewardId={i + 1}
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

    function OwnerTile() {
        return (
            <div className="main owner">
                <button className="add-reward" onClick={showModal}>Dodaj nagrodę</button>
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
                                rewardId={i + 1}
                                updateRewards={updateRewards}
                                deleteReward={() =>deleteReward(reward.id)}
                            />
                        );
                    })}
                </div>
                <Modal visible={modalVisibility}>
                    <header>Dodawanie nagrody</header>
                    <section className="content">
                        <form>
                            <input placeholder="Nazwa" onChange={useValue(setName)}/>
                            <input placeholder="Wymagene punkty" onChange={useValue(setRequiredPoints)}/>
                            <input placeholder="Stan magazynu (puste = nieograniczony)" onChange={useValue(setAmount)}/>
                            <input placeholder="Limit na 1 osobę (puste = bez limitu)" onChange={useValue(setLimit)}/>
                        </form>
                    </section>
                    <section className="footer">
                        <div>
                            <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                            <button onClick={addReward}>Zapisz</button>
                        </div>
                    </section>
                </Modal>
            </div>
        );
    }

    return (
        <div className="loyalty-program page">
            {(role === 'owner') ? OwnerTile() : clientGuestTile()}
        </div>
    );
}

export default LoyaltyProgram;
