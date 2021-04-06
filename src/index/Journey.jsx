import React from 'react'
import { showCitySelector } from './actions';
import './Journey.css'
import switchImg from './imgs/switch.svg'

export default function Journey(props) {
    const { from, to,exchangeFromTo, showCitySelector } = props;
    return (
        <div className="journey" >
            <div className="journey-station" onClick = {()=>showCitySelector(true)}>
                <input
                    type="text"
                    readOnly
                    value={from}
                    name = "from"
                    className="journey-input journey-from"
                />
            </div>
            <div className="journey-switch" onClick = {()=>exchangeFromTo()}>
                <img src={switchImg} alt="switch" width = "70" height="40"/>
            </div>
            <div className="journey-station" onClick = {()=>showCitySelector(false)}>
                <input
                    type="text"
                    readOnly
                    value={to}
                    name = "to"
                    className="journey-input journey-to"
                />
            </div>
        </div>
    )
}