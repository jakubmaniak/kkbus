import React from 'react';

const context = {
    user: {
        loggedIn: false,
        role: 'guest'
    }
};

const UserContext = React.createContext(context);

export default UserContext;