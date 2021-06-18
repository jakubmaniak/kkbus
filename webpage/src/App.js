import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import UserContext, { initialContext } from './contexts/User';

import RoutesPage from './components/route/RoutesPage';
import WorkSchedule from './components/workSchedule/WorkSchedule';
import Availability from './components/availability/Availability';
import LoyaltyProgram from './components/loyaltyProgram/LoyaltyProgram';
import BookingReportPage from './components/bookingsReport/BookingReportPage';
import Clients from './components/accountAndBookings/Clients';
import SubmitReport from './components/submitRouteReport/SubmitRouteReport';
import VehicleInfo from './components/vehicle/VehicleInfo';
import FuelPage from './components/fuel/FuelPage';
import ContactPage from './components/contact/ContactPage';
import PostSignup from './components/userAuth/PostSignup';
import LoginPage from './components/userAuth/LoginPage';
import SignupPage from './components/userAuth/SignupPage';
import RemindPasswordPage from './components/userAuth/RemindPasswordPage';
import Header from './components/header/Header';
import Profile from './components/profile/Profile';
import BookingList from './components/bookingList/BookingList';
import BookingPage from './components/bookingClient/BookingPage';
import PostActivation from './components/userAuth/PostActivation';
import RouteReport from './components/routeReport/RouteReport';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Warsaw');

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
                        <Route exact path="/zarejestrowano" />
                        <Route exact path="/aktywuj-konto/:activationCode" />
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
                        <Route exact path="/zarejestrowano">
                            <PostSignup />
                        </Route>
                        <Route exact path="/aktywuj-konto/:activationCode">
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
                        <Route exact path="/zloz-raport-z-kursu">
                            <SubmitReport />
                        </Route>
                        <Route exact path="/konta-i-rezerwacje-klientow">
                            <Clients />
                        </Route>
                        <Route exact path="/lista-rezerwacji">
                            <BookingList />
                        </Route>
                        <Route exact path="/dyspozycyjnosc">
                            <Availability />
                        </Route>
                        <Route exact path="/profil">
                            <Profile />
                        </Route>
                        <Route exact path="/rezerwacje">
                            <BookingPage />
                        </Route>
                        <Route exact path="/raporty-z-rezerwacji">
                            <BookingReportPage />
                        </Route>
                        <Route exact path="/raporty-z-kursów">
                            <RouteReport />
                        </Route>
                    </Switch>
                </Router>
            </UserContext.Provider>
            <ToastContainer limit={4} />
        </div>
    );
}

export default App;
