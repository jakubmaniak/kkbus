import background from './static/background.jpg';
import './App.css';
import LoginPage from './components/LoginPage';
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
            </Switch>
        </Router>
    </div>
  );
}

export default App;
