import React, { useEffect, useState, useContext } from 'react';
import '../styles/MainPage.css';
import Track from './Track';
import * as api from '../api';
import UserContext from '../contexts/User';


function MainPage() {
    let [tracks, setTracks] = useState([]);
    let { role } = useContext(UserContext).user;
    
    useEffect(() => {
        api.getAllRoutes()
        .then((routes) => {
            setTracks(
                routes
                .map(({id, a, b}) => [
                    { ...a, id: id + 'a', routeId: id, arrivalLocation: b.departureLocation },
                    { ...b, id: id + 'b', routeId: id, arrivalLocation: a.departureLocation }
                ])
                .flat()
            );
        });
    }, []);

    return (
        <div className="main-page">
            <div className="main">
                {role === 'owner' ? 
                    <div className="button-add-container">
                        <button>Dodaj trasę</button>
                    </div>    
                : null}
                {tracks.map((track, i) => (
                        <Track
                            key={track.id}
                            startingStop={track.departureLocation}
                            finalStop={track.arrivalLocation}
                            busStops={track.stops.map((stop, i) => (
                                <span className="route" key={i}>
                                    <span>{stop}</span>
                                    {i < track.stops.length - 1 ? <span> - </span> : null}
                                </span>
                            ))}
                            hours={track.hours.map((hour, i) => (
                                <div key={i}>{hour}</div>
                            ))}
                            prices={[...track.stops.keys()].map((v, i, a) => a.slice(i + 1, a.length).map(w => [v, w]))
                                .flat()
                                .map(([i, j]) => (     
                                    <div className="bus-stop-price" key={i + ' ' + j}>
                                        <span className="bus-stop">{track.stops[i] + '-' + track.stops[j]}</span>
                                        <span className="price">{track.prices.slice(i, j).reduce((a, b) => a + b)} zł</span>
                                        <span className="price">{track.prices.slice(i, j).reduce((a, b) => Math.floor((a + b) * 0.7))}zł</span>
                                    </div>
                                ))}
                            routeId={track.id}
                            allHours={track.hours.reduce((a, b) => a.concat([b]), []).slice(1).join(', ')}
                            stopsPrices={track.stops.reduce((a, b, i) => a.concat([track.prices[i - 1], b]), []).slice(1).join(', ')}
                        />
                ))}
            </div>
        </div>
    );
}

export default MainPage;