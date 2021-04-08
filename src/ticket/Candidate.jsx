import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {TrainContext} from './context'
import './Candidate.css'
import URI from 'urijs'
import dayjs from 'dayjs'
const Channel = memo(function Channel(props) {
    const {
        name,
        desc,
        type,
    } = props;
    const {trainNumber,departStation,arriveStation,departDate} = useContext(TrainContext);
    const src = useMemo(()=>{
        return new URI('order.html')
            .setSearch('trainNumber',trainNumber)
            .setSearch('dStation',departStation)
            .setSearch('aStation',arriveStation)
            .setSearch('type',type)
            .setSearch('date',dayjs(departDate).format('YYYY-MM-DD'))
            .toString();
    })
    return (
        <div className="channel">
            <div className="middle">
                <div className="name">{name}</div>
                <div className="desc">{desc}</div>
            </div>
            <a href={src} className="buy-wrapper">
                <div className="buy">买票</div>
            </a>
        </div>
    )
})
const Seat = memo(function Seat(props) {
    const {
        type,
        priceMsg,
        ticketsLeft,
        channels,
        expandedIndex,
        idx,
        onToggle
    } = props;
    return (
        <li>
            <div className="bar" onClick={()=>onToggle(idx)}>
                <span className='seat'>
                    {type}
                </span>
                <span className="price">
                    <i>¥</i>
                    {priceMsg}
                </span>
                <span className="btn">
                    收起
                </span>
                <span className="num">
                    {ticketsLeft}
                </span>

            </div>
            <div className="channels" style={{ height: expandedIndex ? channels.length * 55 + 'px' : 0 }}>
                {channels.map((channel) => {
                    return <Channel {...channel} key={channel.name} type={type} />
                })}
            </div>
        </li>
    )
})
const Candidate = memo(function Candidate(props) {
    const { tickets } = props
    const [expandedIndex, setExpandedIndex] = useState(-1);

    const onToggle = useCallback(
        idx => {
            setExpandedIndex(idx === expandedIndex ? -1 : idx);
        },
        [expandedIndex]
    );
    return (
        <div className='candidate'>
            <ul>
                {tickets.map((ticket, idx) => {
                    return <Seat
                        expandedIndex={idx === expandedIndex}
                        idx={idx}
                        onToggle={onToggle}
                        {...ticket}
                        key={ticket.type}
                    />
                })}
            </ul>
        </div>
    )
})

export default Candidate;