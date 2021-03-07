import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ContactPage from './components/ContactPage';
import MainPage from './components/MainPage';
import RemindPasswordPage from './components/RemindPasswordPage';

function App() {
  return (
    <div className="App">
        <Router>
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
            </Switch>
        </Router>
    </div>
  );
}

export default App;
