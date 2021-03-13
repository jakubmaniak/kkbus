import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ContactPage from './components/Contact';
import MainPage from './components/MainPage';
import RemindPasswordPage from './components/RemindPasswordPage';
import LoyaltyProgram from './components/LoyaltyProgram';
import VehicleInfo from './components/VehicleInfo';
import Header from './components/Header';
import WorkSchedule from './components/WorkSchedule';
import Fuel from './components/Fuel';

function App() {
  return (
    <div className="App">
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
                    <MainPage />
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
                    <ContactPage />
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
            </Switch>
        </Router>
    </div>
  );
}

export default App;
