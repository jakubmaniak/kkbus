import React, { useContext, useState, useEffect } from 'react';
import '../styles/Contact.css';
import map from '../static/map.png';

import UserContext from '../contexts/User';
import Modal from './Modal';
import '../styles/Modal.css';
import * as api from '../api';
import { fromValue } from '../helpers/from-value';

function Contact() {
    let { role } = useContext(UserContext).user;
    let [modalVisibility, setModalVisibility] = useState(false);
    let [address, setAddress] = useState('');
    let [zipCode, setZipCode] = useState('');
    let [phoneNumber, setPhoneNumber] = useState('');
    let [faxNumber, setFaxNumber] = useState('');
    let [email, setEmail] = useState('');


    useEffect(() => {
        api.getContact()
        .then((res) => {
            setAddress(res.address);
            setZipCode(res.zipCode);
            setPhoneNumber(res.phoneNumber);
            setFaxNumber(res.faxNumber);
            setEmail(res.email);
        });
    });

    function showModal() {
        setModalVisibility(true);
    }

    return (
        <div className="contact page">
            <div className="main">
                <div className="contact-container">
                    <div className="tile half">
                        <div className="header-wrapper">
                            <h2>Kontakt</h2>
                            {role === 'owner' ? 
                                <button className="edit" onClick={showModal}>Edytuj</button> 
                            : null}
                        </div>
                        <div className="adress">
                            <p>{address}</p>
                            <p>{zipCode}</p>
                        </div>
                        <div className="contact-info">
                            <div>
                                <span>Telefon/fax: </span>
                                <span>{phoneNumber}, {faxNumber}</span>
                            </div>
                            <div>
                                <span>Adres e-mail: </span>
                                <span>{email}</span>
                            </div>
                        </div>
                    </div>
                    <div className="map-container">
                        <img src={map} alt="mapa" />
                    </div>
                </div>
                <div className="tile half">
                    <h2>Masz pytanie?</h2>
                    <form className="contact-form">
                        <input placeholder="Twój adres email"/>
                        <textarea placeholder="Twoje pytanie"></textarea>
                        <button className="submit">Wyślij</button>
                    </form>
                </div>
            </div>
            {role === 'owner' ? 
               <Modal visible={modalVisibility}>
                    <header>Edycja danych kontaktowych</header>
                    <section className="content">
                        <form className="edit-contact">
                            <input placeholder="Adres" defaultValue={address} onChange={fromValue(setAddress)}/>
                            <input placeholder="Kod pocztowy" defaultValue={zipCode}/>
                            <input placeholder="Telefon/fax" defaultValue={phoneNumber}/>
                            <input placeholder="Fax" defaultValue={faxNumber}/>
                            <input placeholder="Adres e-mail" defaultValue={email}/>
                        </form>
                    </section>
                    <section className="footer">
                        <button onClick={() => setModalVisibility(false)}>Anuluj</button>
                        <button onClick={() => setModalVisibility(false)}>Zapisz</button>
                    </section>  
                </Modal>
            : null}
        </div>
    );
}

export default Contact;
