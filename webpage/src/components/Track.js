import React, { useContext, useState } from 'react';
import TrackDirection from './TrackDirection';
import '../styles/MainPage.css';
import UserContext from '../contexts/User';
import Modal from './Modal';
import Dropdown from './Dropdown';

function Track(props) {
    let { role } = useContext(UserContext).user;
    let [modalVisibility, setModalVisibility] = useState(false);

    function showModal() {
        setModalVisibility(true);
    }

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
                        <button className="btn-book" onClick={showModal}>Rezerwuj</button>
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
             {role === 'client' ? 
                <Modal visible={modalVisibility}>
                    <header>Edycja danych kontaktowych</header>
                    <section className="content">
                        <form className="book-track">
                            <Dropdown placeholder="Godzina"/>
                            <input placeholder="Liczba osób objętych biletem normalnym"/>
                            <input placeholder="Liczba osób objętych biletem ulgowym"/>
                            <input placeholder="Liczba dzieci do lat 5"/>
                            <Dropdown placeholder="Przystanek początkowy"/>
                            <Dropdown placeholder="Przystanek końcowy"/>
                            <section className="footer">
                                <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                                <button onClick={() => setModalVisibility(false)}>Zapisz</button>
                            </section>  
                        </form>
                    </section>
                </Modal>
                : null}
        </div>
    );
}

export default Track;
