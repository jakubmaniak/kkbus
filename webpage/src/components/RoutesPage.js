import React, { useEffect, useState, useContext } from 'react';
import '../styles/RoutesPage.css';
import Route from './Route';
import * as api from '../api';
import UserContext from '../contexts/User';
import { ModalLoader } from './Loader';


function RoutesPage() {
    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();

    let [routes, setRoutes] = useState([]);
    let { role } = useContext(UserContext).user;
    
    useEffect(() => {
        api.getAllRoutes()
        .then((routes) => {
            setRoutes(routes);
            setTimeout(() => {
                setLoading(false);
            }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
        });
    }, []);

    function updateRoutes() {
        api.getAllRoutes()
        .then(setRoutes);
    }

    return (
        <div className="routes-page">
            <ModalLoader loading={loading} />
            <div className="main">
                {role === 'owner' ? 
                    <div className="button-add-container">
                        <button>Dodaj trasę</button>
                    </div>    
                : null}
                {routes.map((route) => (
                        <Route
                            key={route.id}
                            departureLocation={route.departureLocation}
                            arrivalLocation={route.arrivalLocation}
                            stops={route.stops.map((stop, i) => (
                                <span className="route" key={i}>
                                    <span>{stop}</span>
                                    {i < route.stops.length - 1 ? <span> - </span> : null}
                                </span>
                            ))}
                            hours={route.hours.map((hour, i) => (
                                <div key={i}>{hour}</div>
                            ))}
                            prices={[...route.stops.keys()].map((v, i, a) => a.slice(i + 1, a.length).map(w => [v, w]))
                                .flat()
                                .map(([i, j]) => (     
                                    <div className="bus-stop-price" key={i + ' ' + j}>
                                        <span className="bus-stop">{route.stops[i] + '-' + route.stops[j]}</span>
                                        <span className="price">{route.prices.slice(i, j).reduce((a, b) => a + b)} zł</span>
                                        <span className="price">{route.prices.slice(i, j).reduce((a, b) => Math.floor((a + b) * 0.7))}zł</span>
                                    </div>
                                ))}
                            routeId={route.id}
                            allHours={route.hours}
                            stopsPrices={route.stops.reduce((a, b, i) => a.concat([route.prices[i - 1], b]), []).slice(1).join(', ')}
                            updateRoutes={updateRoutes}
                        />
                ))}
            </div>
        </div>
    );
}

export default RoutesPage;