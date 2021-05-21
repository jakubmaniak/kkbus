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
            {props.client ?
                <>
                <div className="client-data">
                    <span>Rezerwacje niezrealizowane/max. dopuszczlna liczba</span>
                    <span>{props.unrealizedBookings} /3</span>
                </div>
                <div className="client-data">
                    <span>Data zakończenia blokady rezerwacji</span>
                    <span>{props.bookLockExpirationDate}</span>
                </div>
                </>
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
