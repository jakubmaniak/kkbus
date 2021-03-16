import React from 'react';
import '../styles/LoyaltyProgram.css';

function Reward(props) {
    return (
        <div className="reward owner">
            <span>{props.rewardName}</span>
            <span>{props.rewardPoints}</span>
            {(props.role === 'client') ? 
                <button>Kup</button> 
            : null
            }
            {props.children}
        </div>
    )
}

export default Reward;
