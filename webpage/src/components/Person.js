import React from 'react';

function Person(props) {
    return (
        <>
            <div className="client-data">
                <span>Imię</span>
                <span>{props.firstName}</span>
            </div>
            <div className="client-data">
                <span>Nazwisko</span>
                <span>{props.lastName}</span>
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
                <span>{props.phoneNumber}</span>
            </div>
            {props.client ?
                <div className="client-data">
                    <span>Liczba rezerwacji zrealizowanych/niezrealizowanych</span>
                    <span>{props.reservation}</span>
                </div>
            : null}
        </>
    );
}

export default Person;
