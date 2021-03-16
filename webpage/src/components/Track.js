import React from 'react';
import TrackDirection from './TrackDirection';
import '../styles/MainPage.css';

function Track(props) {
    return (
        <div className="tile half tile-container">
            <div className="tile">
                <div className="track-header">
                    <div className="track-info">
                        <TrackDirection 
                            startingStop={props.startingStop}
                            finalStop={props.finalStop}
                        />
                        {props.busStops}
                    </div>
                    <div className="book">
                        <button className="btn-book">Rezerwuj</button>
                    </div>
                </div>
                <div className="hours">
                    {props.hours}
                </div>
            </div>
            <div className="tile tile-container inside">
                <div className="tile-price">
                    <div className="price-list">
                        <div className="header">
                            <span>Normalny</span>
                            <span>Ulgowy*</span>
                        </div>
                            {props.prices}
                    </div>
                </div>
                    <div className="tile-price">
                        <div className="note">
                            <p>*uczniowie i studenci</p>
                            <p>dzieci do lat 5: przejazd bezpłatny</p>
                        </div>
                    </div>
             </div>
        </div>
    );
}

export default Track;
