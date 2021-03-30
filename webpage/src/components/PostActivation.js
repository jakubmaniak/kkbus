import React from 'react';
import '../styles/AuthPage.css';
import background from '../static/background.jpg';

function PostActivation() {
    return (
        <div className="post-activation-page">
            <div className="background" style={{backgroundImage: `url('${background}')`}}></div>
            <div className="container">
                <div className="post-activation">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    <p>Twoje konto zostało aktywowane.</p>
                    <p>Login i hasło zostały wysłane na twój e-mail</p>
                    <form>
                        <button className="submit">Zaloguj</button>
                    </form>
                </div> 
            </div>
        </div>
    );
}

export default PostActivation;
