import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import UserContext, { initialContext } from './contexts/User';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header';
import ContactPage from './components/ContactPage';
import RoutesPage from './components/RoutesPage';
import RemindPasswordPage from './components/RemindPasswordPage';
import LoyaltyProgram from './components/LoyaltyProgram';
import VehicleInfo from './components/VehicleInfo';
import WorkSchedule from './components/WorkSchedule';
import FuelPage from './components/FuelPage';
import RouteReport from './components/RouteReport';
import Clients from './components/Clients';
import BookingList from './components/BookingList';
import PostSignup from './components/PostSignup';
import PostActivation from './components/PostActivation';
import Timetable from './components/Timetable';

function App() {
    let [user, setUser] = useState(initialContext.user);

    return (
        <div className="App">
            <UserContext.Provider value={{user, setUser}}>
                <Router>
                    <Switch>
                        <Route exact path="/logowanie" />
                        <Route exact path="/rejestracja" />
                        <Route exact path="/przypomnienie-hasla" />
                        <Route exact path="/aktywuj-konto" />
                        <Route exact path="/aktywowano-konto" />
                        <Route>
                            <Header />
                        </Route>
                    </Switch>
                    <Switch>
                        <Route exact path="/">
                            <RoutesPage />
                        </Route>
                        <Route exact path="/logowanie">
                            <LoginPage />
                        </Route>
                        <Route exact path="/rejestracja">
                            <SignupPage />
                        </Route>
                        <Route exact path="/przypomnienie-hasla">
                            <RemindPasswordPage />
                        </Route>
                        <Route exact path="/aktywuj-konto">
                            <PostSignup />
                        </Route>
                        <Route exact path="/aktywowano-konto">
                            <PostActivation />
                        </Route>
                        <Route exact path="/kontakt">
                            <ContactPage />
                        </Route>
                        <Route exact path="/program-lojalnosciowy">
                            <LoyaltyProgram />
                        </Route>
                        <Route exact path="/pojazdy">
                            <VehicleInfo />
                        </Route>
                        <Route exact path="/paliwo">
                            <FuelPage />
                        </Route>
                        <Route exact path="/grafik-pracy">
                            <WorkSchedule />
                        </Route>
                        <Route exact path="/raport-z-kursu">
                            <RouteReport />
                        </Route>
                        <Route exact path="/konta-i-rezerwacje-klientow">
                            <Clients />
                        </Route>
                        <Route exact path="/lista-rezerwacji">
                            <BookingList />
                        </Route>
                        <Route exact path="/dyspozycyjnosc">
                            <Timetable />
                        </Route>
                    </Switch>
                </Router>
            </UserContext.Provider>
        </div>
    );
}

export default App;
