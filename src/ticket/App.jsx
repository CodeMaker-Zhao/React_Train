import './App.css'
import React, { useCallback, useEffect, useMemo, lazy } from 'react'
import { bindActionCreators } from 'redux'
import URI from 'urijs'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import { h0 } from '../common/fp'
import { TrainContext } from './context'
import Header from '../common/Header'
import Nav from '../common/Nav'
import useNav from '../common/useNav'
import Candidate from './Candidate'
import Detail from '../common/Detail'
import {
    setDepartStation,
    setArriveStation,
    setDepartDate,
    setTrainNumber,
    setSearchParsed,

    setDepartTimeStr,
    setArriveTimeStr,
    setArriveDate,
    setTickets,
    setDurationStr,
    toggleIsScheduleVisible,

    nextDate,
    prevDate,
} from './actions'
import { Suspense } from 'react'

const Schedule = lazy(() => import('./Schedule.jsx'))

function App(props) {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        departStation,
        arriveStation,
        trainNumber,
        durationStr,
        tickets,
        isScheduleVisible,
        searchParsed,
        dispatch
    } = props;

    useEffect(() => {
        if (!searchParsed) return;
        const url = new URI('/rest/ticket')
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('trainNumber', trainNumber)
            .toString();
        fetch(url).then(Response => Response.json())
            .then(result => {
                const {
                    detail,
                    candidates,
                } = result;
                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr,
                } = detail;


                dispatch(setDepartTimeStr(departTimeStr))
                dispatch(setArriveTimeStr(arriveTimeStr))
                dispatch(setArriveDate(arriveDate))
                dispatch(setDurationStr(durationStr))
                dispatch(setTickets(candidates))
            })
    }, [searchParsed, departDate, trainNumber])
    useEffect(() => {
        const queries = URI.parseQuery(window.location.search);
        const {
            aStation,
            dStation,
            trainNumber,
            date
        } = queries;

        dispatch(setArriveStation(aStation));
        dispatch(setDepartStation(dStation));
        dispatch(setTrainNumber(trainNumber));
        dispatch(setDepartDate(h0(dayjs(date).valueOf())));

        dispatch(setSearchParsed(true));
    }, [])

    const {
        prev,
        next,
        isPrevDisabled,
        isNextDisabled,
    } = useNav(departDate, dispatch, prevDate, nextDate);

    useEffect(() => {
        document.title = trainNumber;
    }, [trainNumber]);

    const onBack = useCallback(() => {
        window.history.back();
    }, [])

    const detailCbs = useMemo(() => {
        return bindActionCreators({
            toggleIsScheduleVisible
        }, dispatch)
    }, [])
    if (!searchParsed) {
        return null;
    }
    return (
        <div className='app'>
            <div className="header-wrapper">
                <Header title={trainNumber} onBack={onBack} />
            </div>
            <div className="nav-wrapper">
                <Nav prev={prev}
                    next={next}
                    isPrevDisabled={isPrevDisabled}
                    isNextDisabled={isNextDisabled}
                    date={departDate}
                />
            </div>
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departTimeStr={departTimeStr}
                    arriveTimeStr={arriveTimeStr}
                    trainNumber={trainNumber}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    durationStr={durationStr}
                    {...detailCbs}
                />
            </div>
            <TrainContext.Provider value={{trainNumber,departStation,arriveStation,departDate}}>
                <Candidate tickets={tickets} />
            </TrainContext.Provider>
            {isScheduleVisible &&
                <div className="mask" onClick={() => { dispatch(toggleIsScheduleVisible()) }}>
                    <Suspense fallback={<div>loading</div>}>
                        <Schedule
                            date={departDate}
                            trainNumber={trainNumber}
                            arriveStation={arriveStation}
                            departStation={departStation}
                        />
                    </Suspense>
                </div>
            }
        </div>
    )
}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch }
    }
)(App);