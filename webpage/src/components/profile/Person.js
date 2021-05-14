import React from 'react';

function Person(props) {
    function textifyRole(role) {
        return {
            guest: 'Niezalogowany',
            client: 'Klient',
            driver: 'Kierowca',
            office: 'Pracownik sekretariatu',
            owner: 'Właściciel'
        }[role] ?? '-';
    }

    return (
        <>
            <div className="person-data">
                <span>Imię</span>
                <span>{props.firstName}</span>
            </div>
            <div className="person-data">
                <span>Nazwisko</span>
                <span>{props.lastName}</span>
            </div>
            <div className="person-data">
                <span>Login</span>
                <span>{props.login}</span>
            </div>
            <div className="person-data">
                <span>Adres email</span>
                <span>{props.email}</span>
            </div>
            <div className="person-data">
                <span>Data urodzenia</span>
                <span>{props.birthday}</span>
            </div>
            <div className="person-data">
                <span>Numer telefonu</span>
                <span>{props.phoneNumber}</span>
            </div>
            {
                props.client
                ?
                <div className="client-data">
                    <span>Liczba rezerwacji zrealizowanych/niezrealizowanych</span>
                    <span>{props.reservation}</span>
                </div>
                :
                <div className="person-data">
                    <span>Rola</span>
                    <span>{textifyRole(props.role)}</span>
                </div>
            }
        </>
    );
}

export default Person;
