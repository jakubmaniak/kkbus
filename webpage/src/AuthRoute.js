import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { ModalLoader } from './components/Loader';
import UserContext from './contexts/User';


function AuthRoute({ children, path, exact = false, ...props }) {
    let { loaded: identityConfirmed, role, loggedIn } = useContext(UserContext).user;

    let roles = ['guest', 'client', 'driver', 'office', 'owner']
        .filter((roleName) => roleName in props && props[roleName]);

    return (
        <Route
            exact={exact}
            path={path}
            render={() => 
                identityConfirmed
                    ? (loggedIn === props.logged) || roles.includes(role)
                        ? children
                        : <Redirect to="/" />
                    : <ModalLoader/>
            }
        />
    );
}

export default AuthRoute;