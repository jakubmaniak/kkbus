import React from 'react';

export const initialContext = {
    user: {
        loaded: false,
        loggedIn: false,
        role: 'guest',
        id: -1
    }
};

const UserContext = React.createContext(initialContext);

export default UserContext;