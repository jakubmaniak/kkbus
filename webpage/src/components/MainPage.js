import React from 'react';
import '../styles/MainPage.css';
import BusStopPrice from './BusStopPrice';

export default function MainPage() {
    return (
        <div className="main-page">
            <div className="main">
                <div className="tile half tile-container">
                    <div className="tile">
                        <div className="track-header">
                            <div className="track-info">
                                <div className="direction">
                                    <span>Katowice</span>
                                    <span>-----&gt;</span>
                                    <span>Kraków</span>
                                </div>
                                <div className="route">
                                    {/* <p>3 przystanki </p> */}
                                    <span>Mysłowice</span>
                                    <span>-</span>
                                    <span>Chrzanów</span>
                                    <span>-</span>
                                    <span>Balice</span>
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
                    <div className="tile">
                        <div className="price-list">
                            <div className="header">
                                <span>Normalny</span>
                                <span>Ulgowy*</span>
                            </div>
                                <BusStopPrice 
                                    busStop="Mysłowice - Chrzanów"
                                    normalPrice="5"
                                    reducedPrice="3.5"
                                />
                                <BusStopPrice
                                    busStop="Chrzanów - Balice"
                                    normalPrice="5"
                                    reducedPrice="3.5" 
                                />
                                <BusStopPrice
                                    busStop="Katowice - Kraków"
                                    normalPrice="12"
                                    reducedPrice="8.4" 
                                />
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
                                    <span>Katowice</span>
                                </div>
                                <div className="route">
                                    {/* <p>4 przystanki </p> */}
                                    <span>Balice</span>
                                    <span>-</span>
                                    <span>Chrzanów</span>
                                    <span>-</span>
                                    <span>Jaworzno</span>
                                    <span>-</span>
                                    <span>Mysłowice</span>
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
                    <div className="tile">
                        <div className="price-list">
                            <div className="header">
                                <span>Normalny</span>
                                <span>Ulgowy*</span>
                            </div>
                                <BusStopPrice 
                                    busStop="Balice - Chrzanów"
                                    normalPrice="4"
                                    reducedPrice="2.8"
                                />
                                <BusStopPrice
                                    busStop="Chrzanów - Jaworzno"
                                    normalPrice="6"
                                    reducedPrice="4.2" 
                                />
                                <BusStopPrice
                                    busStop="Balice - Jaworzno"
                                    normalPrice="12"
                                    reducedPrice="8.4" 
                                />
                                <BusStopPrice
                                    busStop="Kraków - Katowice"
                                    normalPrice="15"
                                    reducedPrice="10.4" 
                                />
                                <div className="note">
                                    <p>*uczniowie i studenci</p>
                                    <p>dzieci do lat 5: przejazd bezpłatny</p>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}
