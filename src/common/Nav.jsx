import React,{memo} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import './Nav.css'

const Nav = memo(function Nav(props){
    const {prev,next,isPrevDisabled,isNextDisabled,date} = props;
    let d = dayjs(date);
    const dateText = d.format('M月D日 ')+d.locale('zh-cn').format('ddd');
    return(
        <div className='nav'>
            <span className={classnames('nav-prev',{'nav-disabled':isPrevDisabled})}
            onClick = {prev}
            >
                前一天
            </span>
            <span className='nav-current'>
                {dateText}
            </span>
            <span className={classnames('nav-next',{'nav-disabled':isNextDisabled})}
            onClick = {next}
            >
                后一天
            </span>
        </div>
    )
})

export default Nav;

Nav.propTypes = {
    
}