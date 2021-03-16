import React from 'react';
import BusStopPrice from './BusStopPrice';
import TrackDirection from './TrackDirection';
import '../styles/MainPage.css';
import TrackHours from './TrackHours';

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
                            {props.children}
                        </div>
                        <div className="book">
                            <button className="btn-book">Rezerwuj</button>
                        </div>
                    </div>
                    <TrackHours />
                </div>
                <div className="tile tile-container inside">
                    <div className="tile-price">
                        <div className="price-list">
                            <div className="header">
                                <span>Normalny</span>
                                <span>Ulgowy*</span>
                            </div>
                                <BusStopPrice 
                                    busStop="Katowice - Chrzanów"
                                    normalPrice="5"
                                    reducedPrice="3.5"
                                />
                                <BusStopPrice
                                    busStop="Chrzanów - Kraków"
                                    normalPrice="5"
                                    reducedPrice="3.5" 
                                />
                                <BusStopPrice
                                    busStop="Katowice - Kraków"
                                    normalPrice="12"
                                    reducedPrice="8.4" 
                                />
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
    )
}

export default Track;
