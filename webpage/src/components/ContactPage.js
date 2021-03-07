import React from 'react';
import Header from './Header';
import '../styles/ContactPage.css';

function ContactPage() {
    return (
        <div className="contact-page">
            <Header />
            <div className="main">
                <div className="contact">
                    <h2>Kontakt</h2>
                    <p>ul.Władysława Łokietka 21/3</p>
                    <p>30-010 Kraków</p>
                    <div>
                        <span>Telefon: </span>
                        <span>12 01 02 300</span>
                    </div>
                    <div>
                        <span>Adres e-mail: </span>
                        <span>kontakt@kkbus.pl</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
