import './App.css'
import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import Nav from '../common/Nav.jsx'
import List from './List.jsx'
import URI from 'urijs'
import { h0 } from '../common/fp'
import dayjs from 'dayjs'
import Header from '../common/Header.jsx'
import Bottom from './Bottom.jsx'
import useNav from '../common/useNav'
import { bindActionCreators } from 'redux'

import {
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
    setTrainList,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,
    setSearchParsed,
    prevDate,
    nextDate,
    toggleIsFiltersVisible,
    toggleOnlyTickets,
    toggleOrderType,
    toggleHighSpeed,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
} from './actions.js'

function App(props) {
    const {
        trainList,
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        dispatch,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        isFiltersVisible,
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
    } = props;

    useEffect(() => {
        const queries = URI.parseQuery(window.location.search);
        const { from, to, date, highSpeed } = queries;
        dispatch(setFrom(from));
        dispatch(setTo(to));
        dispatch(setDepartDate(h0(dayjs(date).valueOf())))
        dispatch(setHighSpeed(highSpeed === 'true'))

        dispatch(setSearchParsed(true));
    }, [])

    useEffect(() => {
        if (!searchParsed) {
            return;
        }
        const url = new URI('/rest/query')
            .setSearch('from', from)
            .setSearch('to', to)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('highSpeed', highSpeed)
            .setSearch('orderType', orderType)
            .setSearch('onlyTickets', onlyTickets)
            .setSearch(
                'checkedTicketTypes',
                Object.keys(checkedTicketTypes).join()
            )
            .setSearch(
                'checkedTrainTypes',
                Object.keys(checkedTrainTypes).join()
            )
            .setSearch(
                'checkedDepartStations',
                Object.keys(checkedDepartStations).join()
            )
            .setSearch(
                'checkedArriveStations',
                Object.keys(checkedArriveStations).join()
            )
            .setSearch('departTimeStart', departTimeStart)
            .setSearch('departTimeEnd', departTimeEnd)
            .setSearch('arriveTimeStart', arriveTimeStart)
            .setSearch('arriveTimeEnd', arriveTimeEnd)
            .toString();
        fetch(url)
            .then(response => response.json())
            .then(result => {
                const {
                    dataMap: {
                        directTrainInfo: {
                            trains,
                            filter: {
                                ticketType,
                                trainType,
                                depStation,
                                arrStation,
                            },
                        },
                    },
                } = result;

                dispatch(setTrainList(trains));
                dispatch(setTicketTypes(ticketType));
                dispatch(setTrainTypes(trainType));
                dispatch(setDepartStations(depStation));
                dispatch(setArriveStations(arrStation));
            });
    }, [
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
    ])
    const onBack = useCallback(() => {
        window.history.back();
    }, [])

    const { isPrevDisabled,
        isNextDisabled,
        prev,
        next } = useNav(departDate, dispatch, prevDate, nextDate)

    const bottomCbs = useMemo(() => {
        return bindActionCreators({
            toggleIsFiltersVisible,
            toggleOnlyTickets,
            toggleOrderType,
            toggleHighSpeed,
            setCheckedTicketTypes,
            setCheckedTrainTypes,
            setCheckedDepartStations,
            setCheckedArriveStations,
            setDepartTimeStart,
            setDepartTimeEnd,
            setArriveTimeStart,
            setArriveTimeEnd,
        }, dispatch)
    }, [])
    return (
        <div>
            <div className="header-wrapper">
                <Header
                    title={`${from} ??? ${to}`}
                    onBack={onBack}
                />
            </div>
            <Nav
                date={departDate}
                prev={prev}
                next={next}
                isPrevDisabled={isPrevDisabled}
                isNextDisabled={isNextDisabled}
            />
            <List
                list={trainList}
            />
            <Bottom
                {...bottomCbs}
                highSpeed={highSpeed}
                orderType={orderType}
                onlyTickets={onlyTickets}
                isFiltersVisible={isFiltersVisible}
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
            />
        </div>
    )
}

export default connect(
    function mapStateToProps(state) {
        return state
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch }
    }
)(App);