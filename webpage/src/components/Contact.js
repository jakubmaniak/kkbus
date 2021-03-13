import React from 'react';
import '../styles/ContactPage.css';
import map from '../static/map.png';

function ContactPage() {
    return (
        <div className="contact-page">
            <div className="main">
                <div className="left-side">
                    <div className="tile">
                        <h2>Kontakt</h2>
                        <div className="adress">
                            <p>ul. Jana Pawła II 37</p>
                            <p>31-864 Kraków</p>
                        </div>
                        <div className="contact-info">
                            <div>
                                <span>Telefon: </span>
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
                <div className="right-side">
                    <h2>Masz pytanie?</h2>
                    <form>
                        <input placeholder="Twój adres email"/>
                        <textarea placeholder="Twoje pytanie"></textarea>
                        <button className="submit">Wyślij</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
