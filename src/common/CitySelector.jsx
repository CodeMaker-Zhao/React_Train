import classnames from 'classnames'
import { useEffect, useMemo,useCallback, useState,memo } from 'react'
import './CitySelector.css'
import PropTypes from 'prop-types'


const CityItem = memo(function CityItem(props) {
    const { name, onSelect } = props;

    return (
        <li className="city-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    );
});

CityItem.propTypes = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const CitySection = memo(function CitySection(props) {
    const { title, cities = [], onSelect } = props;
    return (
        <ul className="city-ul" data-cate={title}>
            <li className="city-li" key="title" date-alpha={title}>
                {title}
            </li>
            {cities.map(city => {
                return (
                    <CityItem
                        key={city.name}
                        name={city.name}
                        onSelect={onSelect}
                    />
                );
            })}
        </ul>
    );
});

CitySection.propTypes = {
    title: PropTypes.string.isRequired,
    cities: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
};

const alphaArr = Array.from(new Array(26),(v,index)=>{
    return String.fromCharCode(65+index);
})

const AlphaIndex = memo(function AlphaIndex(props){
    const {toAlpha,alpha} = props;
    return (
        <i className = "city-index-item" onClick = {()=>toAlpha(alpha)}>
            {alpha}
        </i>
    )
})
const CityList = memo(function CityList(props){
    const {sections,onSelect,toAlpha}  = props;
    return (
        <div className="city-list">
            <div className="city-cate">
                {
                    sections.map(section=>{
                        return(
                            <CitySection
                                key = {section.title}
                                title = {section.title}
                                cities = {section.citys}
                                onSelect = {onSelect}
                            />
                        )
                    })
                }
            </div>
            <div className='city-index'>
                {alphaArr.map(alpha=>{
                    return <AlphaIndex
                    key = {alpha}
                    toAlpha = {toAlpha}
                    alpha = {alpha}
                    />
                })}
            </div>
        </div>
    )
})

const SuggestItem = memo(function SuggestItem(props){
    const {name,onClick} = props;
    return(<li className = "city-suggest-li" onClick = {()=>onClick(name)}>
        {name}
    </li>)
})
const Suggest = memo(function Suggest(props){
    const {searchKey,onSelect} = props;
    const [result,setResult] = useState([]);

    useEffect(()=>{
        fetch('/rest/search?key='+encodeURIComponent(searchKey))
            .then(res => res.json())
            .then( data =>{
                const {
                    searchKey:sKey,
                    result
                } = data;
                if(sKey===searchKey){
                    setResult(result);
                }
            })
    },[searchKey])

    const fallBackResult = result.length?result:[{display:searchKey}]
    return (
        <div className="city-suggest">
            <ul className="city-suggest-ul">
                {fallBackResult.map(item=>{
                    return <SuggestItem
                    name = {item.display}
                    key = {item.display}
                    onClick = {onSelect}
                    />
                })}
            </ul>
        </div>
    )
})

const CitySelector = memo(function CitySelector(props) {
    const { show,onBack,isLoading,cityData,fetchCityData,onSelect } = props;
    const [searchKey, setSearchKey] = useState('');
    const key = useMemo(()=>searchKey.trim(),[searchKey])
    

    const toAlpha = useCallback(alpha =>{
        document.querySelector(`[date-alpha='${alpha}']`).scrollIntoView();
    },[])
    const outputCitySections = function(){
        if(isLoading){
            return <div>Loading</div>
        }
        if(cityData){
            return <CityList
                    sections = {cityData.cityList}
                    onSelect = {onSelect}
                    toAlpha = {toAlpha}
                    />
        }
        return <div>error</div>
    }


    useEffect(()=>{
        if(!show||isLoading||cityData)return;
        fetchCityData();
    },[isLoading,show,cityData])
    return (
        <div className={classnames('city-selector', { hidden: !show })}>
            <div className="city-search">
                <div className="search-back" onClick = {()=>onBack()}>
                    <svg width="42" height="42">
                        <polyline
                            points="25,13 16,21 25,29"
                            stroke="#fff"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="search-input-wrapper">
                    <input type="text"
                        className="search-input"
                        value={searchKey}
                        placeholder="城市、车站中文或拼音"
                        onChange={e => setSearchKey(e.target.value)}
                    />
                </div>
                <i
                    onClick={() => setSearchKey('')}
                    className={classnames('search-clean', {
                        hidden: key.length === 0,
                    })}
                >
                    &#xf063;
                </i>
            </div>
            {
                Boolean(key)&&(
                    <Suggest
                        searchKey = {key}
                        onSelect = {key => onSelect(key)}
                    />
                )
            }
            {outputCitySections()}
        </div>
    )
})

CitySelector.propTypes = {
    show:PropTypes.bool.isRequired,
    onBack:PropTypes.func.isRequired,
    isLoading:PropTypes.bool.isRequired,
    cityData:PropTypes.object,
    fetchCityData:PropTypes.func.isRequired
}

export default CitySelector