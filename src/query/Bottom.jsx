import React, { useMemo, memo, useState, useCallback,useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ORDER_DEPART } from './constant'
import classnames from 'classnames'
import './Bottom.css'
import leftPad from 'left-pad'
import useWinsize from '../common/useWinSize'
import { setTicketTypes, setTrainList, setTrainTypes } from './actions'
import { useSelector } from 'react-redux'


const Slider = memo((props) => {
    const { title,
        startTime,
        endTime,
        onStartChange,
        onEndChange
     } = props;
    const [start,setStart] = useState(()=>startTime/24*100);
    const [end,setEnd] = useState(()=>endTime/24*100);
    const startPer = useMemo(()=>{
        if(start>100){
            return 100;
        }
        if(start<0){
            return 0;
        }
        return start;
    },[start])
    const endPer = useMemo(()=>{
        if(end>100){
            return 100;
        }
        if(end<0){
            return 0;
        }
        return end;
    },[end])
    const startHours = useMemo(()=>{
        return Math.round(startPer*24/100);
    },[startPer])
    const endHours = useMemo(()=>{
        return Math.round(endPer*24/100);
    },[endPer])
    const startText = useMemo(()=>{
        return leftPad(startHours,2,'0')+":00";
    },[startHours])
    const endText = useMemo(()=>{
        return leftPad(endHours,2,'0')+":00";
    })
    const startHandle = useRef();
    const endHandle = useRef();
    const lastStartX = useRef();
    const lastEndX = useRef();
    const range = useRef();
    const rangeWidth = useRef();
    const winSize = useWinsize();
    const onStartTouchBegin = (e)=>{
        const touch = e.targetTouches[0];
        lastStartX.current = touch.pageX;
    }
    const onEndTouchBegin = (e)=>{
        const touch = e.targetTouches[0];
        lastEndX.current = touch.pageX;
    }
    const onStartTouchMove = (e)=>{
        const touch = e.targetTouches[0];
        const distance = touch.pageX-lastStartX.current;
        lastStartX.current = touch.pageX;
        setStart(start => start + (distance/rangeWidth.current)*100);
    }
    const onEndTouchMove = (e)=>{
        const touch = e.targetTouches[0];
        const distance = touch.pageX-lastEndX.current;
        lastEndX.current = touch.pageX;
        setEnd(end => end + (distance/rangeWidth.current)*100);
    }
    useEffect(()=>{
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        )
    },[winSize.width])
    useEffect(()=>{
        startHandle.current.addEventListener('touchstart',onStartTouchBegin,false);
        startHandle.current.addEventListener('touchmove',onStartTouchMove,false);
        endHandle.current.addEventListener('touchstart',onEndTouchBegin,false);
        endHandle.current.addEventListener('touchmove',onEndTouchMove,false);

        return()=>{
            startHandle.current.removeEventListener('touchstart',onStartTouchBegin,false);
            startHandle.current.removeEventListener('touchmove',onStartTouchMove,false);
            endHandle.current.removeEventListener('touchstart',onEndTouchBegin,false);
            endHandle.current.removeEventListener('touchmove',onEndTouchMove,false);
        }
    })
    useEffect(()=>{
        onStartChange(startHours);
    },[startHours])
    useEffect(()=>{
        onEndChange(endHours)
    },[endHours])
    return (
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                <div className="slider" ref={range}>
                    <div className='slider-range' style={{
                        left:startPer+'%',
                        width:endPer-startPer+'%'
                    }}></div>
                    <i ref={startHandle} className='slider-handle' style ={{
                        left:startPer+'%'
                    }}><span>{startText}</span></i>
                    <i ref={endHandle} className='slider-handle' style = {{
                        left:endPer+"%"
                    }}><span>{endText}</span></i>
                </div>
            </div>
        </div>
    )
})
const Filter = memo((props) => {
    const {
        name,
        checked,
        toggle,
        value
    } = props;
    return (
        <li className={classnames({ checked })} onClick={() => toggle(value)}>
            {name}
        </li>
    )
})
const Option = memo((props) => {
    const {
        title,
        options,
        checkedMap,
        update
    } = props;

    const toggle = useCallback((value) => {
        const newCheckedMap = { ...checkedMap };
        if (value in checkedMap) {
            delete newCheckedMap[value];
        } else {
            newCheckedMap[value] = true;
        }

        update(newCheckedMap);
    }, [checkedMap, update])
    return (
        <div className='option'>
            <h3>{title}</h3>
            <ul>
                {
                    options.map(option => {
                        return <Filter key={option.value} {...option} checked={option.value in checkedMap} toggle={toggle} />
                    })
                }
            </ul>
        </div>
    )
})

const BottomModal = memo((props) => {
    const {
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
        toggleIsFiltersVisible
    } = props;

    const [localCheckedTicketTypes, setLocalCheckedTicketTypes] = useState(() => {
        return { ...checkedTicketTypes };
    });

    const [localCheckedTrainTypes, setLocalCheckedTrainTypes] = useState(() => {
        return { ...checkedTrainTypes };
    })

    const [localCheckedDepartStations, setLocalCheckedDepartStations] = useState(() => {
        return { ...checkedDepartStations };
    })

    const [localCheckedArriveStations, setLocalCheckedArriveStations] = useState(() => {
        return { ...checkedArriveStations };
    })
    const [localDepartTimeStart, setLocalDepartTimeStart] = useState(departTimeStart);
    const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd);
    const [localArriveTimeStart, setLocalArriveTimeStart] = useState(arriveTimeStart);
    const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd);
    const optionMap = [
        {
            title: '坐席类型',
            options: ticketTypes,
            checkedMap: localCheckedTicketTypes,
            update: setLocalCheckedTicketTypes,
        },
        {
            title: '车次类型',
            options: trainTypes,
            checkedMap: localCheckedTrainTypes,
            update: setLocalCheckedTrainTypes
        },
        {
            title: '出发车站',
            options: departStations,
            checkedMap: localCheckedDepartStations,
            update: setLocalCheckedDepartStations
        },
        {
            title: '到达车站',
            options: arriveStations,
            checkedMap: localCheckedArriveStations,
            update: setLocalCheckedArriveStations
        }

    ]

    return (
        <div className="bottom-modal">
            <div className="bottom-dialog">
                <div className="bottom-dialog-content">
                    <div className="title">
                        <span className="reset">
                            重置
                        </span>
                        <span className="ok">
                            确定
                        </span>
                    </div>
                    <div className="options">
                        {optionMap.map(option => {
                            return <Option
                                {...option}
                                key={option.title}
                            />
                        })}
                    </div>
                    <Slider
                        title="出发时间"
                        startTime={localDepartTimeStart}
                        endTime={localDepartTimeEnd}
                        onStartChange={setLocalDepartTimeStart}
                        onEndChange={setLocalDepartTimeEnd}
                    />
                    <Slider
                        title="到达时间"
                        startTime={localArriveTimeStart}
                        endTime={localArriveTimeEnd}
                        onStartChange={setLocalArriveTimeStart}
                        onEndChange={setLocalArriveTimeEnd}
                    />
                </div>
            </div>
        </div>
    )
})

export default function Bottom(props) {
    const {
        highSpeed,
        orderType,
        onlyTickets,
        isFiltersVisible,
        toggleIsFiltersVisible,
        toggleOnlyTickets,
        toggleOrderType,
        toggleHighSpeed,


        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd,
    } = props;
    return (
        <div className='bottm'>
            <div className='bottom-filters'>
                <span className='item' onClick={toggleOrderType}>
                    <i className='icon'>&#xf065;</i>
                    {orderType === ORDER_DEPART ? '出发 早⇀晚' : '耗时 短⇀长'}
                </span>
                <span className={classnames('item', { 'item-on': highSpeed })} onClick={toggleHighSpeed}>
                    <i className='icon'>{highSpeed ? '\uf43f' : '\uf43e'}</i>
                    只看高铁动车
                </span>
                <span className={classnames('item', { 'item-on': onlyTickets })} onClick={toggleOnlyTickets}>
                    <i className='icon'>{onlyTickets ? '\uf43d' : '\uf43c'}</i>
                    只看有票
                </span>
                <span className={classnames('item', { 'item-on': isFiltersVisible })} onClick={toggleIsFiltersVisible}>
                    <i className='icon'>{isFiltersVisible ? '\uf0f7' : '\uf446'}</i>
                    综合筛选
                </span>
            </div>
            {isFiltersVisible && <BottomModal
                ticketTypes={ticketTypes}
                trainTypes={trainTypes}
                departStations={departStations}
                arriveStations={arriveStations}
                checkedTicketTypes={checkedTicketTypes}
                checkedTrainTypes={checkedTrainTypes}
                checkedDepartStations={checkedDepartStations}
                checkedArriveStations={checkedArriveStations}
                departTimeStart={departTimeStart}
                departTimeEnd={departTimeEnd}
                arriveTimeStart={arriveTimeStart}
                arriveTimeEnd={arriveTimeEnd}
                setCheckedTicketTypes={setCheckedTicketTypes}
                setCheckedTrainTypes={setCheckedTrainTypes}
                setCheckedDepartStations={setCheckedDepartStations}
                setCheckedArriveStations={setCheckedArriveStations}
                setDepartTimeStart={setDepartTimeStart}
                setDepartTimeEnd={setDepartTimeEnd}
                setArriveTimeStart={setArriveTimeStart}
                setArriveTimeEnd={setArriveTimeEnd}
                toggleIsFiltersVisible={toggleIsFiltersVisible}
            />}
        </div>
    )
}

Bottom.propTypes = {

}