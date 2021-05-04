import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/LoyaltyProgram.css';

import * as api from '../api';

import { fromValue } from '../helpers/from-value';
import UserContext from '../contexts/User';

import Reward from './Reward';
import Modal from './Modal';
import { ModalLoader } from './Loader';
import toast from '../helpers/toast';

function LoyaltyProgram() {
    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();

    let history = useHistory();

    let [modalAddRewardVisibility, setModalAddRewardVisibility] = useState(false);

    let [rewards, setRewards] = useState([]);
    let [name, setName] = useState('');
    let [requiredPoints, setRequiredPoints] = useState('');
    let [amount, setAmount] = useState('');
    let [limit, setLimit] = useState('');

    let [clientPoints, setClientsPoints] = useState();

    let { role } = useContext(UserContext).user;

    useEffect(() => {
        api.getAllRewards()
            .then((results) => {
                setRewards(results);
                setTimeout(() => {
                    setLoading(false);
                }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
            })
            .catch(api.toastifyError);
    }, []);

    function updateRewards() {
        api.getAllRewards()
            .then((results) => {
                setRewards(results);
            })
            .catch(api.toastifyError);
    }

    function addReward() {
        let currentRequiredPoints = parseInt(requiredPoints, 10);
        let currentAmount = amount === '' ? null : parseInt(amount, 10);
        let currentLimit = limit === '' ? null : parseInt(limit, 10);

        if (isNaN(currentRequiredPoints) || isNaN(currentLimit) || isNaN(currentAmount)) {
            toast.error('Wprowadzone dane są niepoprawne');
            return;
        }
        
        api.addReward(name, currentRequiredPoints, currentAmount, currentLimit)
            .then((result) => {
                rewards.push({
                    id: result.id,
                    name,
                    requiredPoints: currentRequiredPoints,
                    amount: currentAmount,
                    limit: currentLimit
                });
                
                setModalAddRewardVisibility(false);
                toast.success('Dodano nagrodę');
            })
            .catch(api.toastifyError);
    }

    function showModal() {
        setName('');
        setRequiredPoints('');
        setAmount('');
        setLimit('');

        setModalAddRewardVisibility(true);
    }

    function deleteReward(rewardId) {           
        api.deleteReward(rewardId)
            .then(() => {
                updateRewards();
                toast.success('Usunięto nagrodę');
            })
            .catch(api.toastifyError);
    }

    function buyReward(rewardId, requiredPoints) {
        api.buyReward(rewardId)
            .then(() => {
                setClientsPoints(clientPoints - requiredPoints);
            })
            .catch(api.toastifyError);
    }

    function clientGuestTile() {
        api.getLoyaltyProgram()
            .then((results) => {
                setClientsPoints(results.points);
            })
            .catch(api.errorToString);

        return (
            <div className="main">
                <div className='tile half'>
                    <div className="title">
                        <h2>Sklep</h2>
                        {role === 'client' ? 
                            <h3 className="points">
                                <span>Punkty: </span> 
                                <span>{clientPoints}</span>
                            </h3> 
                        : null}
                    </div>
                    {rewards.map((reward) => {
                        return (
                            <Reward key={reward.id}
                                role={role}
                                name={reward.name}
                                requiredPoints={reward.requiredPoints}
                                rewardId={reward.id}
                                buyReward={() => buyReward(reward.id, reward.requiredPoints)}
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
                    : (role === 'client') ? 
                        <div className="tile half">
                            <h2>Historia zakupów</h2>
                            <p>28.01.2021 Kupiono 1 Bilet za 2000 punktów</p>
                            <p>28.01.2021 Kupiono 2 Bilet za 3500 punktów</p>
                        </div>
                    : null
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
                    {rewards.map((reward) => {
                        return (
                            <Reward key={reward.id}
                                role={role}
                                name={reward.name}
                                requiredPoints={reward.requiredPoints}
                                amount={reward.amount}
                                limit={reward.limit}
                                rewardId={reward.id}
                                updateRewards={updateRewards}
                                deleteReward={() => deleteReward(reward.id)}
                            />
                        );
                    })}
                </div>
                <Modal visible={modalAddRewardVisibility}>
                    <header>Dodawanie nagrody</header>
                    <section className="content">
                        <form>
                            <input placeholder="Nazwa" onChange={fromValue(setName)}/>
                            <input placeholder="Wymagane punkty" onChange={fromValue(setRequiredPoints)}/>
                            <input placeholder="Stan magazynu (puste = nieograniczony)" onChange={fromValue(setAmount)}/>
                            <input placeholder="Limit na 1 osobę (puste = bez limitu)" onChange={fromValue(setLimit)}/>
                        </form>
                    </section>
                    <section className="footer">
                        <div>
                            <button onClick={() => setModalAddRewardVisibility(false)}>Anuluj</button>
                            <button onClick={addReward}>Zapisz</button>
                        </div>
                    </section>
                </Modal>
            </div>
        );
    }

    return (
        <div className="loyalty-program page">
             <ModalLoader loading={loading} />
            {(role === 'owner') ? OwnerTile() : clientGuestTile()}
        </div>
    );
}

export default LoyaltyProgram;
