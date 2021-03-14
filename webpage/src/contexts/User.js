import React from 'react';

export const initialContext = {
    user: {
        loggedIn: false,
        role: 'guest'
    }
};

const UserContext = React.createContext(initialContext);

export default UserContext;