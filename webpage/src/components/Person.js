import React from 'react';

function Person(props) {
    return (
        <>
            <div className="client-data">
                <span>Imię</span>
                <span>{props.name}</span>
            </div>
            <div className="client-data">
                <span>Nazwisko</span>
                <span>{props.surname}</span>
            </div>
            <div className="client-data">
                <span>Login</span>
                <span>{props.login}</span>
            </div>
            <div className="client-data">
                <span>Adres email</span>
                <span>{props.email}</span>
            </div>
            <div className="client-data">
                <span>Data urodzenia</span>
                <span>{props.birthday}</span>
            </div>
            <div className="client-data">
                <span>Numer telefonu</span>
                <span>{props.phone}</span>
            </div>
            <div className="client-data">
                <span>Liczba rezerwacji zrealizowanych/niezrealizowanych</span>
                <span>{props.reservation}</span>
            </div>
        </>
    );
}

export default Person;
