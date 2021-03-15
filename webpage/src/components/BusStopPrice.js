import React from 'react';
import '../styles/MainPage.css'

function BusStopPrice(props) {
    return (
        <div className="bus-stop-price">
            <span className="bus-stop">{props.busStop}</span>
            <span className="price">{props.normalPrice}zł</span>
            <span className="price">{props.reducedPrice}zł</span>
        </div>
    )
}

export default BusStopPrice
