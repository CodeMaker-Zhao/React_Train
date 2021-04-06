import React, { useMemo } from 'react'
import './DepertDate.css'
import dayjs from 'dayjs'
import {h0} from '../common/fp'
export default function DepertDate(props){
    const {time,onClick} = props;
    const h0Time = h0(time);
    const depertDateString = useMemo(()=>{
        return dayjs(time).format('YYYY-MM-DD')
    },[h0Time])

    const isToday = h0Time===h0();

    const depertDay = new Date(h0Time);
    const dayString = '周'+['日','一','二','三','四','五','六'][depertDay.getDay()]+(isToday?'(今天)':'');
    return(
        <div className="depart-date" onClick = {onClick}>
            <input type="hidden" name='date' value={depertDateString}/>
            {depertDateString}<span className='depart-week'>{dayString}</span>
        </div>
    )
}