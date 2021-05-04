import React, { useState, useEffect } from 'react';

function Profile() {
    let [person, setPerson] = useState([]);

    useEffect(() => {

    }, []);

    return (
        <div className="profile-page page">
            <div className="main">
                <div className=" half tile">
                    <h2>Profil</h2>
                </div>
                <div className=" half tile">
                    <h2>Historia rezerwacji</h2>
                </div>
            </div>
        </div>
    );
}

export default Profile;
