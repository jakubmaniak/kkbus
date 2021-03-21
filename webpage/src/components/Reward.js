import React, { useState } from 'react';
import '../styles/LoyaltyProgram.css';
import Modal from './Modal';

function Reward(props) {
    let [modalVisibility, setModalVisibility] = useState(false);

    function header() {
        if (props.role === 'guest' || props.role === 'client') {
            return <span>{props.name} ({props.requiredPoints})</span>;
        }
        
        return (<>
            <span>{props.name}</span><span>{props.requiredPoints}</span>
        </>);
    }

    function editReward() {
        setModalVisibility(true);
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
                        <button className="edit" onClick={editReward}>Edytuj</button>
                        <button className="delete">Usuń</button>
                    </div>
                </>
                : null    
            }
            <Modal visible={modalVisibility}>
                <header>Edycja nagrody</header>
                <section className="content">
                    <form>
                        <input placeholder="Nazwa"/>
                        <input placeholder="Wymagene punkty"/>
                        <input placeholder="Stan magazynu (puste = nieograniczony)"/>
                        <input placeholder="Limit na 1 osobę (puste = bez limitu)"/>
                    </form>
                </section>
                <section className="footer">
                    <div>
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={() => setModalVisibility(false)}>Zapisz</button>
                    </div>
                </section>
            </Modal>
        </div>
    )
}

export default Reward;
