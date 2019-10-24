import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
// import 'bootstrap/dist/css/bootstrap.min.css';

const BottomBtn = ({text,colorClass,icon,onBtnClick}) => {
    return (
        <>
            <button
                type="button"
                className={`btn btn-block no-border ${colorClass}`}
                onClick={ onBtnClick }
            >
                <FontAwesomeIcon
                    className="mr-2"
                    icon={ icon }
                    size="lg"
                ></FontAwesomeIcon>
                { text }
            </button>
        </>
    )
}

BottomBtn.propTypes = {
    text:PropTypes.string,
    colorClass:PropTypes.string,
    // icon:PropTypes.element.isRequired,
    onBtnClick:PropTypes.func
}

BottomBtn.defaultProps = {
    text:'新建'
}
export default BottomBtn;