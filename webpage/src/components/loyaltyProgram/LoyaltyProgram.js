import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../styles/LoyaltyProgram.css';

import * as api from '../../api';

import { fromValue } from '../../helpers/from-value';
import UserContext from '../../contexts/User';

import Reward from './Reward';
import Modal from '../modals/Modal';
import { ModalLoader } from '../Loader';
import toast from '../../helpers/toast';

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
    let [rewardOrders, setRewardOrders] = useState([]);

    let { role } = useContext(UserContext).user;

    useEffect(() => {            
        api.getAllRewards()
            .then((results) => {
                setRewards(results);
                setTimeout(() => {
                    setLoading(false);
                }, Math.max(0, 550 - (Date.now() - loadingInitTime)));
            })
            .catch(api.toastifyError);
    }, []);



    useEffect(() => {
        if(role !== 'client') {
            return;
        }

        let promiseLoyalityProgram = api.getLoyaltyProgram()
            .then((results) => {
                setClientsPoints(results.points);
            })
            .catch(api.errorToString);
    
        let promiseRewardOrders = api.getUserRewardOrders()
            .then((results) => {
                setRewardOrders(results);
            })
            .catch(api.toastifyError);

        Promise.all([promiseLoyalityProgram, promiseRewardOrders]);
    }, [role]);


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
            toast.error('Wprowadzone dane s?? niepoprawne');
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
                toast.success('Dodano nagrod??');
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
                toast.success('Usuni??to nagrod??');
            })
            .catch(api.toastifyError);
    }

    function buyReward(rewardId, requiredPoints) {
        api.buyReward(rewardId)
            .then(() => {
                setClientsPoints(clientPoints - requiredPoints);
                updateRewardOrders();
            })
            .catch(api.toastifyError);
    }

    function updateRewardOrders() {
        api.getUserRewardOrders()
            .then((results) => {
                setRewardOrders(results);
                toast.success('Kupiono nagrod??');
            })
            .catch(api.toastifyError);
    }

    function clientGuestTile() {
        return (
            <div className="main guest">
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
                                buyReward={() => {buyReward(reward.id, reward.requiredPoints)}}
                            />
                        );
                    })}
                </div>
                {
                    (role === 'guest') ? 
                        <div className="tile half">
                            <h2>Do????cz do nas</h2>
                            <p>Za?????? konto i korzystaj z nagr??d programu lojalno??ciowego.</p>
                            <div className="button-container">
                                <button className="signup" onClick={() => history.push('/rejestracja')}>Za?????? konto</button>
                                <button className="login" onClick={() => history.push('/logowanie')}>Zaloguj</button>
                            </div>
                        </div>
                    : (role === 'client') ? 
                        <div className="tile half">
                            <h2>Historia zakup??w</h2>
                            <p className="reward-history">
                                    <span>Data</span>
                                    <span>Nagroda</span>
                                    <span>Punkty</span>
                            </p>
                            {rewardOrders.map((rewardOrder, i) => {
                              return (
                                <p className="reward-history" key={i}>
                                    <span>{new Date(rewardOrder.orderDate).toLocaleDateString()}</span>
                                    <span>{(rewards.find(({id}) => rewardOrder.rewardId === id))?.name}</span>
                                    <span>{rewardOrder.points}</span>
                                </p>
                              );  
                            })}
                        </div>
                    : null
                }
            </div>
        );
    }

    function OwnerTile() {
        return (
            <div className="main owner">
                <button className="add-reward" onClick={showModal}>Dodaj nagrod??</button>
                <div className="tile">
                    <h2>Nagrody</h2>
                    <div className="reward-header">
                        <span>Nazwa</span>
                        <span>Wymagane punkty</span>
                        <span>Stan magazynu</span>
                        <span>Limit na 1 osob??</span>
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
                        <form onSubmit={(ev) => {ev.preventDefault(); addReward();}}>
                            <input placeholder="Nazwa" onChange={fromValue(setName)}/>
                            <input placeholder="Wymagane punkty" onChange={fromValue(setRequiredPoints)}/>
                            <input placeholder="Stan magazynu (puste = nieograniczony)" onChange={fromValue(setAmount)}/>
                            <input placeholder="Limit na 1 osob?? (puste = bez limitu)" onChange={fromValue(setLimit)}/>
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
