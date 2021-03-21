import React from 'react';
import '../styles/LoyaltyProgram.css';

function Reward(props) {

    function header() {
        if (props.role === 'guest' || props.role === 'client') {
            return <span>{props.name} ({props.requiredPoints})</span>;
        }
        
        return (<>
            <span>{props.name}</span><span>{props.requiredPoints}</span>
        </>);
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
                        <button className="edit">Edytuj</button>
                        <button className="delete">Usuń</button>
                    </div>
                </>
                : null    
            }
            

        </div>
    )
}

export default Reward;
