import background from './static/background.jpg';
import './App.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ContactPage from './components/ContactPage';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route exact path="/"></Route>
                <Route exact path="/logowanie">
                    <LoginPage />
                </Route>
                <Route exact path="/rejestracja">
                    <SignupPage />
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
