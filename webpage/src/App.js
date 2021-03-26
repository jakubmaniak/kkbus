import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import UserContext, { initialContext } from './contexts/User';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header';
import Contact from './components/Contact';
import RoutesPage from './components/RoutesPage';
import RemindPasswordPage from './components/RemindPasswordPage';
import LoyaltyProgram from './components/LoyaltyProgram';
import VehicleInfo from './components/VehicleInfo';
import WorkSchedule from './components/WorkSchedule';
import Fuel from './components/Fuel';
import RouteReport from './components/RouteReport';
import Clients from './components/Clients';
import BookingList from './components/BookingList';

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
                        <Route exact path="/kontakt">
                            <Contact />
                        </Route>
                        <Route exact path="/program-lojalnosciowy">
                            <LoyaltyProgram />
                        </Route>
                        <Route exact path="/pojazdy">
                            <VehicleInfo />
                        </Route>
                        <Route exact path="/paliwo">
                            <Fuel />
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
                    </Switch>
                </Router>
            </UserContext.Provider>
        </div>
    );
}

export default App;
