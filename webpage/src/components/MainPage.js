import React, { useState } from 'react';
import '../styles/MainPage.css';
import Track from './Track';
// import BusStopPrice from './BusStopPrice';

export default function MainPage() {
    let [tracks, setTracks] = useState(
        [
            {//dane z bazy dla jednej trasy (kursu)
                startingStop: 'Katowice',
                finalStop: 'Kraków',
                busStops: ['Katowice', 'Chrznów', 'Kraków Dworzec Główny'],
                hours: ['5:15','6:00','6:30','7:00','8:00','9:00','11:00','12:00','12:30','13:30','14:00','14:30','16:00','17:00','18:00','20:00','22:30','23:00'],
                prices: [
                    {
                        busStop: 'Kraków - Chrzanów',
                        normalPrice: 5, 
                        reducedPrice: 3.5
                    },
                    {
                        busStop: 'Chrzanów - Kraków',
                        normalPrice: 5, 
                        reducedPrice: 3.5
                    },
                    {
                        busStop: 'Katowice - Kraków',
                        normalPrice: 12, 
                        reducedPrice: 8.4
                    }
                ]
            },
            {
                startingStop: 'Kraków',
                finalStop: 'Katowice',
                busStops: ['Kraków Dworzec Główny', 'Chrznów', 'Jaworzno', 'Katowice'],
                hours: ['5:15','6:00','6:30','7:00','8:00','9:00','11:00','12:00','12:30','13:30','14:00','14:30','16:00','17:00','18:00','20:00','22:30','23:00'],
                prices: [
                    {
                        busStop: 'Kraków - Chrzanów',
                        normalPrice: 4, 
                        reducedPrice: 2.8
                    },
                    {
                        busStop: 'Chrzanów - Jaworzno',
                        normalPrice: 6, 
                        reducedPrice: 4.2
                    },
                    {
                        busStop: 'Kraków - Jaworzno',
                        normalPrice: 12, 
                        reducedPrice: 8.4
                    },
                    {
                        busStop: 'Kraków - Katowice',
                        normalPrice: 15, 
                        reducedPrice: 10.4
                    }
                ]
            },
            {
                startingStop: 'Kraków',
                finalStop: 'Warszawa',
                busStops: ['Kraków Dworzec Główny', 'Kielce', 'Radom', 'Warszawa Centralna'],
                hours: ['5:15','6:00','6:30','7:00','8:00','9:00','11:00','12:00','12:30','13:30','14:00','14:30','16:00','17:00','18:00','20:00','22:30','23:00'],
                prices: [
                    {
                        busStop: 'Kraków - Kielce',
                        normalPrice: 5, 
                        reducedPrice: 3.5
                    },
                    {
                        busStop: 'Kielce - Radom',
                        normalPrice: 5, 
                        reducedPrice: 3.5
                    },
                    {
                        busStop: 'Kraków - Radom',
                        normalPrice: 12, 
                        reducedPrice: 8.4
                    },
                    {
                        busStop: 'Kraków - Warszawa',
                        normalPrice: 12, 
                        reducedPrice: 8.4
                    }
                ]
            },
            {
                startingStop: 'Warszawa',
                finalStop: 'Kraków',
                busStops: ['Warszawa Centralna', 'Radom', 'Kielce', 'Kraków Dworzec Główny'],
                hours: ['5:15','6:00','6:30','7:00','8:00','9:00','11:00','12:00','12:30','13:30','14:00','14:30','16:00','17:00','18:00','20:00','22:30','23:00'],
                prices: [
                    {
                        busStop: 'Warszawa - Radom',
                        normalPrice: 5, 
                        reducedPrice: 3.5
                    },
                    {
                        busStop: 'Radom - Kielce',
                        normalPrice: 5, 
                        reducedPrice: 3.5
                    },
                    {
                        busStop: 'Warszawa - Kielce',
                        normalPrice: 12, 
                        reducedPrice: 8.4
                    },
                    {
                        busStop: 'Warszawa - Kraków',
                        normalPrice: 12, 
                        reducedPrice: 8.4
                    }
                ]
            },
        ]
    );

    return (
        <div className="main-page">
            <div className="main">
                {tracks.map((track, i) => {
                    return (
                        <Track
                            key={i}
                            startingStop={track.startingStop}
                            finalStop={track.finalStop}
                            busStops={track.busStops.map((busStop, i) => {
                                return (
                                    <span key={i}>
                                        <span>{busStop}</span>
                                        {i < track.busStops.length - 1 ? <span> - </span> : null}
                                    </span>
                                );
                            })}
                            hours={track.hours.map((hour, i) => {
                                return (
                                    <div key={i}>{hour}</div>
                                );
                            })}
                            prices={track.prices.map((price, i) => {
                                return (
                                    <div className="bus-stop-price" key={i}>
                                        <span className="bus-stop">{price.busStop}</span>
                                        <span className="price">{price.normalPrice}zł</span>
                                        <span className="price">{price.reducedPrice}zł</span>
                                    </div>
                                );
                            })}
                        />
                    )
                })}
            </div>
        </div>
    )
}
