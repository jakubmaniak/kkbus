import React, { useEffect, useState } from 'react';
import '../styles/MainPage.css';
import Track from './Track';
import * as api from '../api';

export default function MainPage() {
    let [tracks, setTracks] = useState([]);
    let [a, setA] = useState([]);

    useEffect(() => {
        api.getAllRoutes()
        .then((results) => {
            setTracks(results);
        });
    }, []);


    function stopsPrice(stops) {
        let arr=[];

        for(let i = 0; i < stops.length - 1; i++) {
            for(let j = 0; j < stops.length - 1; j++) {
                if(stops[j] !== stops[i + 1] && stops[j] < stops[i + 1]) {
                    console.log(stops[j], stops[i + 1]);
                    arr.push((stops[j] - stops[i + 1]));
                }
            }
        }

        setA(arr);
    }

    return (
        <div className="main-page">
            <div className="main">
                {tracks.map((track, i) => {
                    return (
                        <div key={i}>
                        <Track
                            key={track.id + 'a'}
                            startingStop={track.a.departureLocation}
                            finalStop={track.b.departureLocation}
                            busStops={track.a.stops.map((stop, i) => {
                                return (
                                    <span className="route" key={i}>
                                        <span>{stop}</span>
                                        {i < track.a.stops.length - 1 ? <span> - </span> : null}
                                    </span>
                                );
                            })}
                            hours={track.a.hours.map((hour, i) => {
                                return (
                                    <div key={i}>{hour}</div>
                                );
                            })}
                            prices={track.a.prices.map((price, i) => {
                                    return (
                                        <div className="bus-stop-price" key={i}>
                                            <span className="bus-stop"> - </span>
                                            <span className="price">{price}zł</span>
                                            <span className="price">{price - price * 0.3}zł</span>
                                        </div>
                                    );
                            })}
                        />
                        <Track
                            key={track.id + 'b'}
                            startingStop={track.b.departureLocation}
                            finalStop={track.a.departureLocation}
                            busStops={track.b.stops.map((stop, i) => {
                                return (
                                    <span className="route" key={i}>
                                        <span>{stop}</span>
                                        {i < track.b.stops.length - 1 ? <span> - </span> : null}
                                    </span>
                                );
                            })}
                            hours={track.b.hours.map((hour, i) => {
                                return (
                                    <div key={i}>{hour}</div>
                                );
                            })}
                            prices={track.b.prices.map((price, i) => {
                                    return (
                                        <div className="bus-stop-price" key={i}>
                                            <span className="bus-stop"> - </span>
                                            <span className="price">{price}zł</span>
                                            <span className="price">{price - price * 0.3}zł</span>
                                        </div>
                                    );
                            })}
                        />
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
