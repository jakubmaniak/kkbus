import React from 'react';
import '../styles/LoyaltyProgram.css';

function Reward(props) {

    function header() {
        if (props.role == 'guest' || props.role == 'client') {
            return <span>{props.rewardName} ({props.rewardPoints})</span>;
        }
        
        return (<>
            <span>{props.rewardName}</span><span>{props.rewardPoints}</span>
        </>);
    }

    return (
        <div className="reward">
            {header()}
            {(props.role === 'client') ? 
                <button>Kup</button> 
            : null
            }
            {props.children}
        </div>
    )
}

export default Reward;
