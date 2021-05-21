import React, { useState, useEffect, useContext } from 'react';
import '../../styles/Profile.css';

import Person from './Person';
import { ModalLoader } from '../Loader';
import Modal from '../modals/Modal';

import { fromValue } from '../../helpers/from-value';

import * as api from '../../api';
import UserContext from '../../contexts/User';
import toast from '../../helpers/toast';

import dayjs from 'dayjs';


function Profile() {
    let [person, setPerson] = useState([]);

    let [loading, setLoading] = useState(true);
    let { user, setUser } = useContext(UserContext);
    let { role, loaded: userInfoLoaded } = useContext(UserContext).user;

    let [modalChangePasswordVisibility, setModalChangePasswordVisibility] = useState(false);
    let [modalChangeDataVisibility, setModalChangeDataVisibility] = useState(false);

    let [email, setEmail] = useState();
    let [login, setLogin] = useState('');
    let [firstName, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');
    let [birthDate, setBirthDate] = useState('');
    let [phoneNumber, setPhoneNumber] = useState('');

    let [currentPassword, setCurrentPassword] = useState('');
    let [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (!userInfoLoaded) return;

        api.getUserProfile()
            .then((results) => {
                setPerson(results);
                setLoading(false);

                setEmail(results.email);
                setLogin(results.login);
                setFirstName(results.firstName);
                setLastName(results.lastName);
                setBirthDate(results.birthDate);
                setPhoneNumber(results.phoneNumber);
                console.log(results);
            })
            .catch(api.toastifyError);
            
    }, [userInfoLoaded]);

    function savePassword() {
        api.updateUserPassword(currentPassword, newPassword)
            .then(() => {
                toast.success('Zmieniono hasło');
                setModalChangePasswordVisibility(false);
            })
            .catch(api.toastifyError);
    }

    function saveData() {
        if(firstName  && lastName  && birthDate  && login  && email  && phoneNumber) {
            api.updateUserProfile({firstName, birthDate: dayjs(birthDate).format('YYYY-MM-DD HH:mm:ss'), lastName, login, mail: email, phoneNumber})
                .then(() => {
                    toast.success('Zmieniono dane');
                    setPerson({firstName,  lastName, login, email, phoneNumber, birthDate});
                    setUser({ ...user, firstName, lastName });
                    setModalChangeDataVisibility(false);
                })
                .catch(api.toastifyError);
        }
        else {
            toast.error('Wypełnij wszystkie pola');
        }
    }

    return (
        <div className="profile-page page">
            <ModalLoader loading={loading} />
            <div className="main">
                <div className="tile half">
                    <h2>Profil</h2>
                    <Person
                        firstName={person.firstName}
                        lastName={person.lastName}
                        login={person.login}
                        email={person.email}
                        birthday={new Date(person.birthDate).toLocaleDateString()}
                        phoneNumber={person.phoneNumber}
                        client={role === 'client' ? true : false}
                        role={role}
                        unrealizedBookings={person.unrealizedBookings}
                        bookLockExpirationDate={person.bookLockExpirationDate === null ? '-' : person.bookLockExpirationDate}
                    />
                    <div className="data-change">
                        <button onClick={() => setModalChangePasswordVisibility(true)}>Zmień hasło</button>
                        <button onClick={() => setModalChangeDataVisibility(true)}>Edytuj dane</button>
                    </div>
                </div>
            </div>
            <Modal visible={modalChangeDataVisibility}>
                    <header>Dane użytkownika</header>
                    <section className="content">
                        <form>
                            <input placeholder="Adres email" value={email} onChange={fromValue(setEmail)}/>
                            <input placeholder="Login" value={login} onChange={fromValue(setLogin)}/>
                            <input placeholder="Imię" value={firstName} onChange={fromValue(setFirstName)}/>
                            <input placeholder="Nazwisko" value={lastName} onChange={fromValue(setLastName)}/>
                            <input placeholder="Data urodzenia" type="date" value={birthDate} onChange={fromValue(setBirthDate)}/>
                            <input placeholder="Numer telefonu" value={phoneNumber} onChange={fromValue(setPhoneNumber)}/>
                        </form>
                    </section>
                    <section className="footer">
                        <div>
                            <button onClick={() => setModalChangeDataVisibility(false)}>Anuluj</button>
                            <button onClick={saveData}>Zapisz</button>
                        </div>
                    </section>
            </Modal>

            <Modal visible={modalChangePasswordVisibility}>
                    <header>Zmiana hasła</header>
                    <section className="content">
                        <form>
                            <input placeholder="Aktualne hasło" type="password" value={currentPassword} onChange={fromValue(setCurrentPassword)}/>
                            <input placeholder="Nowe hasło" type="password" value={newPassword} onChange={fromValue(setNewPassword)}/>
                        </form>
                    </section>
                    <section className="footer">
                        <div>
                            <button onClick={() => setModalChangePasswordVisibility(false)}>Anuluj</button>
                            <button onClick={savePassword}>Zapisz</button>
                        </div>
                    </section>
            </Modal>
        </div>
    );
}

export default Profile;
