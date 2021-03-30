import React from 'react';
import '../styles/AuthPage.css';
import background from '../static/background.jpg';

function PostSignup() {
    return (
        <div className="post-sign-up-page">
            <div className="background" style={{backgroundImage: `url('${background}')`}}></div>
            <div className="container">
                <div className="post-sign-up">
                    <h1 className="logo">
                        <span>KK</span>
                        <span>BUS</span>
                    </h1>
                    <p>Link aktywacyjny został wysłany na podany przez Ciebie adres e-mail</p>
                    <form>
                        <button className="submit">Wyślij jeszcze raz</button>
                    </form>
                </div> 
            </div>
        </div>
    );
}

export default PostSignup;
