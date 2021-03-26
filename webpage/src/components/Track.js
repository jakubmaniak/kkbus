import React, { useContext, useState } from 'react';
import TrackDirection from './TrackDirection';
import '../styles/MainPage.css';
import UserContext from '../contexts/User';
import Modal from './Modal';
import Dropdown from './Dropdown';
import { useHistory } from 'react-router-dom';
import { fromValue } from '../helpers/from-value';
import * as api from '../api';

function Track(props) {
    let { role } = useContext(UserContext).user;
    let [modalVisibility, setModalVisibility] = useState(false);
    let [startPoint, setStartPoint] = useState(props.startingStop);
    let [endPoint, setEndPoint] = useState(props.finalStop);
    let [hours, setHours] = useState([]);
    let [stops, setStops] = useState([]);

    let history = useHistory();

    function showModal() {
        setModalVisibility(true);
    }

    function clientModal() {
        return (
            <Modal visible={modalVisibility}>
                <header>Rezerwacja</header>
                <section className="content">
                    <form className="book-track">
                        <Dropdown placeholder="Godzina"/>
                        <input placeholder="Liczba osób objętych biletem normalnym"/>
                        <input placeholder="Liczba osób objętych biletem ulgowym"/>
                        <input placeholder="Liczba dzieci do lat 5"/>
                        <Dropdown placeholder="Przystanek początkowy"/>
                        <Dropdown placeholder="Przystanek końcowy"/>
                    </form>
                </section>
                <section className="footer reserve">
                    <div>
                        <p>Koszt rezerwacji: 200zł</p>
                    </div>
                    <div>
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={() => setModalVisibility(false)}>Zapisz</button>
                    </div>
                </section>
            </Modal>
        );
    }

    function ownerModal() {
        return (
            <Modal visible={modalVisibility}>
                <header>Edycja informacji o trasie</header>
                <section className="content">
                    <form className="edit-track">
                        <input placeholder="Punkt startowy" defaultValue={props.startingStop} onChange={fromValue(setStartPoint)}/>
                        <input placeholder="Punkt docelowy" defaultValue={props.finalStop} onChange={fromValue(setEndPoint)}/>
                        <textarea placeholder="Godziny odjazdu (odzielone przecinkami)" 
                            defaultValue={props.allHours}
                            //onChange={}
                        />
                        <textarea placeholder="Przystanki (cena, przystanek, cena, przystanek...)"
                            defaultValue={props.stopsPrices}
                        />
                    </form>
                </section>
                <section className="footer">
                    <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                    <button onClick={() => console.log(startPoint, endPoint)}>Zapisz</button>
                </section>
            </Modal>
        );
    }

    return (
        <>
            { role === 'client' ? clientModal()
            : role === 'owner'  ? ownerModal()
            : null
            }
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
                        {(role === 'owner') ? 
                            <button className="btn-book" onClick={showModal}>Edytuj</button>
                        : (role === 'client') ?
                            <button className="btn-book" onClick={showModal}>Rezerwuj</button>
                        : (role === 'guest') ?
                            <button className="btn-book" onClick={() => history.push('/logowanie')}>Rezerwuj</button>
                        : null}
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
        </>
    );
}

export default Track;
