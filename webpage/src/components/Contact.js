import React, {useContext} from 'react';
import '../styles/Contact.css';
import map from '../static/map.png';

import UserContext from '../contexts/User';

function Contact() {
    let { role } = useContext(UserContext).user;

    return (
        <div className="contact page">
            <div className="main">
                <div className="contact-container">
                    <div className="tile half">
                        <div className="header-wrapper">
                            <h2>Kontakt</h2>
                            {role === 'owner' ? 
                                <button className="edit">Edytuj</button> 
                            : null}
                        </div>
                        <div className="adress">
                            <p>ul. Jana Pawła II 37</p>
                            <p>31-864 Kraków</p>
                        </div>
                        <div className="contact-info">
                            <div>
                                <span>Telefon/fax: </span>
                                <span>(070) 012-34-56, (070)-011-22-33</span>
                            </div>
                            <div>
                                <span>Adres e-mail: </span>
                                <span>kontakt@kkbus.pl</span>
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
        </div>
    );
}

export default Contact;
