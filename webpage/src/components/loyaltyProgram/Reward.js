import React, { useEffect, useState } from 'react';
import '../../styles/LoyaltyProgram.css';

import { fromValue } from '../../helpers/from-value';
import toast from '../../helpers/toast';

import * as api from '../../api';

import NotificationModal from '../modals/NotificationModal';
import Modal from '../modals/Modal';

function Reward(props) {
    let [modalEditRewardVisibility, setModalEditRewardVisibility] = useState(false);
    let [modalDeleteRewardVisibility, setModalDeleteRewardVisibility] = useState(false);

    let [name, setName] = useState(props.name);
    let [requiredPoints, setRequiredPoints] = useState(props.requiredPoints);
    let [amount, setAmount] = useState(props.amount);
    let [limit, setLimit] = useState(props.limit);


    useEffect(() => {
        if (modalEditRewardVisibility) {
            setName(props.name);
            setRequiredPoints(props.requiredPoints);
            setAmount(props.amount);
            setLimit(props.limit);
        }
    }, [modalEditRewardVisibility]);


    function header() {
        if (props.role === 'guest' || props.role === 'client') {
            return <span>{props.name} ({props.requiredPoints})</span>;
        }
        
        return (
            <>
                <span>{props.name}</span><span>{props.requiredPoints}</span>
            </>
        );
    }

    function editReward(rewardId) {
        setModalEditRewardVisibility(false);

        let currentName = name;
        let currentRequiredPoints = parseInt(requiredPoints, 10);
        let currentAmount = (amount === null ? null : parseInt(amount, 10));
        let currentLimit = (limit === null ? null : parseInt(limit, 10));

        if (isNaN(currentRequiredPoints) || isNaN(currentAmount) || isNaN(currentLimit)) {
            toast.error('Wprowadzone dane są niepoprawne');
            return;
        }

        api.updateReward(rewardId, currentName, currentRequiredPoints, currentAmount, currentLimit)
        .then(() => {
            props.updateRewards();
            toast.success('Zmieniono dane nagrody');
        })
        .catch(api.toastifyError);    
    }

    return (
        <div className="reward">
            {header()}
            {(props.role === 'client') ? 
                <button onClick={props.buyReward}>Kup</button> 
            : null
            }
            {props.role === 'owner' ?
                <>
                    <span>{props.amount ?? '-'}</span> 
                    <span>{props.limit ?? '-'}</span> 
                    <div className="modify">
                        <button className="edit" onClick={() => setModalEditRewardVisibility(true)}>Edytuj</button>
                        <button className="delete" onClick={() => setModalDeleteRewardVisibility(true)}>Usuń</button>
                    </div>
                </>
                : null    
            }
            <Modal visible={modalEditRewardVisibility}>
                <header>Edycja nagrody</header>
                <section className="content">
                    <form>
                        <input placeholder="Nazwa" value={name} onChange={fromValue(setName)}/>
                        <input placeholder="Wymagane punkty" value={requiredPoints} onChange={fromValue(setRequiredPoints)}/>
                        <input placeholder="Stan magazynu (puste = nieograniczony)"
                            value={amount ?? ''}
                            onChange={fromValue((value) => setAmount(value.trim() || null))}
                        />
                        <input placeholder="Limit na 1 osobę (puste = bez limitu)"
                            value={limit ?? ''}
                            onChange={fromValue((value) => setLimit(value.trim() || null))}
                        />
                    </form>
                </section>
                <section className="footer">
                    <div>
                        <button onClick={() => setModalEditRewardVisibility(false)}>Anuluj</button>
                        <button onClick={() => editReward(props.rewardId)}>Zapisz</button>
                    </div>
                </section>
            </Modal>
            <NotificationModal 
                visible={modalDeleteRewardVisibility}
                header={'Usuwanie nagrody'}
                name={'nagrodę'}
                notificationModalExit={() => setModalDeleteRewardVisibility(false)}
                delete={() => props.deleteReward()}
            />
        </div>
    )
}

export default Reward;
