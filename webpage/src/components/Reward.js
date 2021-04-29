import React, { useState } from 'react';
import '../styles/LoyaltyProgram.css';

import { fromValue } from '../helpers/from-value';
import toast from '../helpers/toast';

import * as api from '../api';

import NotificationModal from './NotificationModal';
import Modal from './Modal';

function Reward(props) {
    let [modalEditRewardVisibility, setModalEditRewardVisibility] = useState(false);
    let [modalDeleteRewardVisibility, setModalDeleteRewardVisibility] = useState(false);

    let [name, setName] = useState(props.name);
    let [requiredPoints, setRequiredPoints] = useState(props.requiredPoints);
    let [amount, setAmount] = useState(props.amount);
    let [limit, setLimit] = useState(props.limit);

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

        if(!isNaN(parseInt(requiredPoints)) && !isNaN(parseInt(amount)) && !isNaN(parseInt(limit))) {
            if(name !== props.name || parseInt(requiredPoints) !== props.requiredPoints || parseInt(amount) !== props.amount || parseInt(limit) !== props.limit) {
                let currentName = name !== props.name ? name : props.name;
                let currentRequirePoints = requiredPoints !== props.requiredPoints ? parseInt(requiredPoints) : props.requiredPoints;
                let currentAmout = amount !== props.amount ? parseInt(amount) : props.amount;
                let currentLimit = limit !== props.limit ? parseInt(limit) : props.limit;
                
                api.updateReward(rewardId, currentName, currentRequirePoints, currentAmout, currentLimit)
                    .then(() => {
                        props.updateRewards();
                        toast.success('Zmieniono dane nagrody');
                    })
                    .catch(api.toastifyError);
            }
            else {
                toast.error('Nieprawidłowy typ danych');
            }
        }
       else {
           toast.error('Wypełnij wszystkie pola');
       }     
    }

    return (
        <div className="reward">
            {header()}
            {(props.role === 'client') ? 
                <button>Kup</button> 
            : null
            }
            {props.role === 'owner' ?
                <>
                    <span>{props.amount}</span> 
                    <span>{props.limit}</span> 
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
                        <input placeholder="Nazwa" defaultValue={props.name} onChange={fromValue(setName)}/>
                        <input placeholder="Wymagene punkty" defaultValue={props.requiredPoints} onChange={fromValue(setRequiredPoints)}/>
                        <input placeholder="Stan magazynu (puste = nieograniczony)" defaultValue={props.amount} onChange={fromValue(setAmount)}/>
                        <input placeholder="Limit na 1 osobę (puste = bez limitu)" defaultValue={props.limit} onChange={fromValue(setLimit)}/>
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
