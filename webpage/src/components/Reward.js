import React, { useState } from 'react';
import '../styles/LoyaltyProgram.css';
import Modal from './Modal';
import { useValue } from '../helpers/use-value';
import * as api from '../api';

function Reward(props) {
    let [modalVisibility, setModalVisibility] = useState(false);
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
        setModalVisibility(false);

        if(name !== props.name || parseInt(requiredPoints) !== props.requiredPoints || parseInt(amount) !== props.amount || parseInt(limit) !== props.limit) {
            let currentName = name !== props.name ? name : props.name;
            let currentRequirePoints = requiredPoints !== props.requiredPoints ? parseInt(requiredPoints) : props.requiredPoints;
            let currentAmout = amount !== props.amount ? parseInt(amount) : props.amount;
            let currentLimit = limit !== props.limit ? parseInt(limit) : props.limit;
            
            api.updateReward(rewardId, currentName, currentRequirePoints, currentAmout, currentLimit)
            .then(() => {
                props.updateRewards();
            });
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
                        <button className="edit" onClick={() => setModalVisibility(true)}>Edytuj</button>
                        <button className="delete">Usuń</button>
                    </div>
                </>
                : null    
            }
            <Modal visible={modalVisibility}>
                <header>Edycja nagrody</header>
                <section className="content">
                    <form>
                        <input placeholder="Nazwa" defaultValue={props.name} onChange={useValue(setName)}/>
                        <input placeholder="Wymagene punkty" defaultValue={props.requiredPoints} onChange={useValue(setRequiredPoints)}/>
                        <input placeholder="Stan magazynu (puste = nieograniczony)" defaultValue={props.amount} onChange={useValue(setAmount)}/>
                        <input placeholder="Limit na 1 osobę (puste = bez limitu)" defaultValue={props.limit} onChange={useValue(setLimit)}/>
                    </form>
                </section>
                <section className="footer">
                    <div>
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={() => editReward(props.rewardId)}>Zapisz</button>
                    </div>
                </section>
            </Modal>
        </div>
    )
}

export default Reward;
