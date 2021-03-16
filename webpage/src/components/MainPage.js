import React, { useState } from 'react';
import '../styles/MainPage.css';
import Track from './Track';
// import BusStopPrice from './BusStopPrice';

export default function MainPage() {
    let [tracks, setTracks] = useState(
        [
            {
                startingStop: 'Katowice',
                finalStop: 'Kraków',
                busStops: ['Katowice', 'Chrznów', 'Kraków']
            }
        ]
    );



    return (
        <div className="main-page">
            <div className="main">
                {tracks.map((track) => {
                    return (
                        <Track
                            startingStop={track.startingStop}
                            finalStop={track.finalStop}
                            children={track.busStops.map((busStop, i) => {
                                return (
                                    <span key={i}>
                                        <span>{busStop}</span>
                                        {i < track.busStops.length - 1 ? <span> - </span> : null}
                                    </span>
                                )
                            })}
                        />
                    )
                })}
                    {/* <div className="tile half tile-container">
                        <div className="tile">
                            <div className="track-header">
                                <div className="track-info">
                                    <div className="direction">
                                        <span>Kraków</span>
                                        <span>-----&gt;</span>
                                        <span>Katowice</span>
                                    </div>
                                    <div className="route">
                                        <span>Kraków Balice</span>
                                        <span>-</span>
                                        <span>Chrzanów</span>
                                        <span>-</span>
                                        <span>Jaworzno</span>
                                        <span>-</span>
                                        <span>Katowice Dworzec</span>
                                    </div>
                                </div>
                                <div className="book">
                                    <button className="btn-book">Rezerwuj</button>
                                </div>
                            </div>
                                <div className="hours">
                                    <div>5:15</div>
                                    <div>6:00</div>
                                    <div>6:30</div>
                                    <div>7:00</div>
                                    <div>8:00</div>
                                    <div>9:00</div>
                                    <div>11:00</div>
                                    <div>12:00</div>
                                    <div>12:30</div>
                                    <div>13:30</div>
                                    <div>14:00</div>
                                    <div>14:30</div>
                                    <div className="booked">15:30</div>
                                    <div>16:00</div>
                                    <div>17:00</div>
                                    <div>18:00</div>
                                    <div>20:00</div>
                                    <div className="booked">21:00</div>
                                    <div>22:30</div>
                                    <div>23:00</div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                                    <div className="dummy"></div>
                            </div>
                    </div>
                    <div className="tile tile-container inside">
                        <div className="tile-price">
                            <div className="price-list">
                                <div className="header">
                                    <span>Normalny</span>
                                    <span>Ulgowy*</span>
                                </div>
                                    <BusStopPrice 
                                        busStop="Kraków - Chrzanów"
                                        normalPrice="4"
                                        reducedPrice="2.8"
                                    />
                                    <BusStopPrice
                                        busStop="Chrzanów - Jaworzno"
                                        normalPrice="6"
                                        reducedPrice="4.2" 
                                    />
                                    <BusStopPrice
                                        busStop="Kraków - Jaworzno"
                                        normalPrice="12"
                                        reducedPrice="8.4" 
                                    />
                                    <BusStopPrice
                                        busStop="Kraków - Katowice"
                                        normalPrice="15"
                                        reducedPrice="10.4" 
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
                <div className="tile half tile-container">
                    <div className="tile">
                        <div className="track-header">
                            <div className="track-info">
                                <div className="direction">
                                    <span>Kraków</span>
                                    <span>-----&gt;</span>
                                    <span>Warszawa</span>
                                </div>
                                <div className="route">
                                    <span>Kraków Balice</span>
                                    <span>-</span>
                                    <span>Kielce</span>
                                    <span>-</span>
                                    <span>Radom</span>
                                    <span>-</span>
                                    <span>Warszawa Centralna</span>
                                </div>
                            </div>
                            <div className="book">
                                <button className="btn-book">Rezerwuj</button>
                            </div>
                        </div>
                            <div className="hours">
                                <div>5:15</div>
                                <div>6:00</div>
                                <div>6:30</div>
                                <div>7:00</div>
                                <div>8:00</div>
                                <div>9:00</div>
                                <div>11:00</div>
                                <div>12:00</div>
                                <div>12:30</div>
                                <div>13:30</div>
                                <div>14:00</div>
                                <div>14:30</div>
                                <div className="booked">15:30</div>
                                <div>16:00</div>
                                <div>17:00</div>
                                <div>18:00</div>
                                <div>20:00</div>
                                <div className="booked">21:00</div>
                                <div>22:30</div>
                                <div>23:00</div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                            </div>
                        </div>
                    <div className="tile tile-container inside">
                        <div className="tile-price">
                            <div className="price-list">
                                <div className="header">
                                    <span>Normalny</span>
                                    <span>Ulgowy*</span>
                                </div>
                                    <BusStopPrice 
                                        busStop="Kraów - Kielce"
                                        normalPrice="5"
                                        reducedPrice="3.5"
                                    />
                                    <BusStopPrice
                                        busStop="Kielce - Radom"
                                        normalPrice="5"
                                        reducedPrice="3.5" 
                                    />
                                    <BusStopPrice
                                        busStop="Kraków - Radom"
                                        normalPrice="12"
                                        reducedPrice="8.4" 
                                    />
                                     <BusStopPrice
                                        busStop="Kraków - Warszawa"
                                        normalPrice="15"
                                        reducedPrice="10.5" 
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
                    <div className="tile half tile-container">
                    <div className="tile">
                        <div className="track-header">
                            <div className="track-info">
                                <div className="direction">
                                    <span>Kraków</span>
                                    <span>-----&gt;</span>
                                    <span>Warszawa</span>
                                </div>
                                <div className="route">
                                    <span>Kraków Balice</span>
                                    <span>-</span>
                                    <span>Kielce</span>
                                    <span>-</span>
                                    <span>Radom</span>
                                    <span>-</span>
                                    <span>Warszawa Centralna</span>
                                </div>
                            </div>
                            <div className="book">
                                <button className="btn-book">Rezerwuj</button>
                            </div>
                        </div>
                            <div className="hours">
                                <div>5:15</div>
                                <div>6:00</div>
                                <div>6:30</div>
                                <div>7:00</div>
                                <div>8:00</div>
                                <div>9:00</div>
                                <div>11:00</div>
                                <div>12:00</div>
                                <div>12:30</div>
                                <div>13:30</div>
                                <div>14:00</div>
                                <div>14:30</div>
                                <div className="booked">15:30</div>
                                <div>16:00</div>
                                <div>17:00</div>
                                <div>18:00</div>
                                <div>20:00</div>
                                <div className="booked">21:00</div>
                                <div>22:30</div>
                                <div>23:00</div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                                <div className="dummy"></div>
                            </div>
                        </div>
                    <div className="tile tile-container inside">
                        <div className="tile-price">
                            <div className="price-list">
                                <div className="header">
                                    <span>Normalny</span>
                                    <span>Ulgowy*</span>
                                </div>
                                    <BusStopPrice 
                                        busStop="Kraów - Kielce"
                                        normalPrice="5"
                                        reducedPrice="3.5"
                                    />
                                    <BusStopPrice
                                        busStop="Kielce - Radom"
                                        normalPrice="5"
                                        reducedPrice="3.5" 
                                    />
                                    <BusStopPrice
                                        busStop="Kraków - Radom"
                                        normalPrice="12"
                                        reducedPrice="8.4" 
                                    />
                                     <BusStopPrice
                                        busStop="Kraków - Warszawa"
                                        normalPrice="15"
                                        reducedPrice="10.5" 
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
                    </div> */}
            </div>
        </div>
    )
}
