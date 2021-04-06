
import { useCallback } from 'react';
import {h0} from './fp'
export default function useNav(date,dispatch,prevDate,nextDate){
    const isPrevDisabled = h0(date) <= h0(); 
    const isNextDisabled = h0(date) - h0() >20*86400*1000;

    const prev = useCallback(()=>{
        if(isPrevDisabled)return;
        dispatch(prevDate());
    },[isPrevDisabled])

    const next = useCallback(()=>{
        if(isNextDisabled)return;
        dispatch(nextDate());
    },[isNextDisabled])

    return{
        isPrevDisabled,
        isNextDisabled,
        prev,
        next
    }
}