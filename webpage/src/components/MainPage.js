import React from 'react';
import Header from './Header';
import '../styles/MainPage.css';

export default function MainPage() {
    return (
        <div className="main-page">
            <div className="main">
                <div className="track">
                    <div className="track-header">
                        <div className="track-info">
                            <div className="direction">
                                <span>Kraków</span>
                                <span>-----&gt;</span>
                                <span>Katowice</span>
                            </div>
                            <div className="route">
                                <span>4 przystanki </span>
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
                            <p className="price">10,00 zł</p>
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
                <div className="track">
                    <div className="track-header">
                        <div className="track-info">
                            <div className="direction">
                                <span>Katowice</span>
                                <span>-----&gt;</span>
                                <span>Kraków</span>
                            </div>
                            <div className="route">
                                <span>3 przystanki </span>
                                <span>Balice</span>
                                <span>-</span>
                                <span>Chrzanów</span>
                                <span>-</span>
                                <span>Mysłowice</span>
                            </div>
                        </div>
                        <div className="book">
                            <p className="price">10,00 zł</p>
                            <button className="btn-book">Rezerwuj</button>
                        </div>
                    </div>
                    <div className="hours">
                        <div>5:15</div>
                        <div>6:00</div>
                        <div>6:30</div>
                        <div className="booked">7:00</div>
                        <div>8:00</div>
                        <div>9:00</div>
                        <div>11:00</div>
                        <div>12:00</div>
                        <div>12:30</div>
                        <div>13:30</div>
                        <div>14:00</div>
                        <div>14:30</div>
                        <div>15:30</div>
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
            </div>
        </div>
    )
}
