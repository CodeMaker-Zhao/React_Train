import React, { useCallback, useMemo } from 'react'
import './App.css'
import { bindActionCreators } from 'redux'
import Header from '../common/Header'
import DepertDate from './DepertDate'
import HighSpeed from './HighSpeed'
import Journey from './Journey'
import Submit from './Submit'
import { connect } from 'react-redux'
import { h0 } from '../common/fp'
import CitySelector from '../common/CitySelector'
import DateSelector from '../common/DateSelector'
import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity,
    showDateSelector,
    hideDateSelector,
    setDepertDate,
    toggleHighSpeed
} from './actions'


const App = (props) => {
    const { from,
        to,
        dispatch,
        isLoadingCityData,
        cityData,
        isCitySelectorVisible,
        depertDate,
        isDateSelectorVisible,
        highSpeed
    } = props;

    const onBack = useCallback(() => {
        window.history.back();
    }, [])

    const cbs = useMemo(() => {
        return bindActionCreators({
            exchangeFromTo,
            showCitySelector
        }, dispatch)
    }, [])
    const onSelectDate = useCallback(day => {
        if (!day) {
            return;
        }
        if (day < h0()) {
            return;
        }
        dispatch(setDepertDate(day));
        dispatch(hideDateSelector());
    }, [])
    const CitySelectorCbs = useMemo(() => {
        return bindActionCreators({
            onBack: hideCitySelector,
            fetchCityData,
            onSelect: setSelectedCity
        }, dispatch)
    }, [])

    const DepertdateCbs = useMemo(() => {
        return bindActionCreators({
            onClick: showDateSelector
        }, dispatch)
    }, [])

    const DateSelectorCbs = useMemo(() => {
        return bindActionCreators({
            onBack: hideDateSelector
        }, dispatch)
    }, [])

    const HighSpeedCbs = useMemo(() => {
        return bindActionCreators({
            toggle: toggleHighSpeed
        }, dispatch)
    }, [])
    return (
        <div>
            <div className="header-wrapper">
                <Header onBack={onBack} title="火车票" />
            </div>
            <form className='form' action = './query.html'>
                <Journey
                    from={from}
                    to={to}
                    {...cbs}
                />
                <DepertDate
                    time={depertDate}
                    {...DepertdateCbs}
                />
                <HighSpeed
                    {...HighSpeedCbs}
                    highSpeed={highSpeed}
                />
                <Submit />
                <CitySelector
                    show={isCitySelectorVisible}
                    cityData={cityData}
                    isLoading={isLoadingCityData}
                    {...CitySelectorCbs}
                />
                <DateSelector
                    show={isDateSelectorVisible}
                    {...DateSelectorCbs}
                    onSelect={onSelectDate}
                />
            </form>
        </div>
    )
}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);