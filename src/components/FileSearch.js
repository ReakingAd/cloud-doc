import React,{ useState,useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faTimes } from '@fortawesome/free-solid-svg-icons';
import useKeyPress from '../hooks/useKeyPress'

const FileSearch = ( {title,onFileSearch} ) => {
    const [ inputActive,setInputActive ] = useState( false );
    const [ keyword,setKeyword ] = useState('');
    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);

    const closeSearch = () => {
        setInputActive( false );
        setKeyword('');
        onFileSearch('');
    }
    let inputRef = useRef( null );
    // 每次重新渲染视图，都会执行这个副作用
    useEffect( () => {
        if( enterPressed && inputActive ){
            onFileSearch( keyword );
        }
        if( escPressed && inputActive ){
            closeSearch();
        }
    },[enterPressed,escPressed])
    // 只有在 inputActive 改变时，才会执行这个副作用。
    useEffect( () => {
        if( inputActive )
            inputRef.current.focus();
    },[ inputActive ])
    return (
        <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
            {
                !inputActive &&
                <>
                    <span>{ title }</span>
                    <button
                        type="button"
                        className="btn-icon"
                        onClick={ () => { setInputActive( true ) }}
                    >
                        <FontAwesomeIcon
                            icon={faSearch}
                            title="搜索"
                            size="lg"
                        ></FontAwesomeIcon>
                    </button>
                </>
            }
            {
                inputActive &&
                <>
                    <input 
                        className="form-control"
                        value={ keyword }
                        ref={ inputRef }
                        onChange={ (e) => { setKeyword( e.target.value ) } }
                    />
                    <button
                        type="button"
                        className="btn-icon"
                        onClick={ closeSearch }
                    >
                        <FontAwesomeIcon
                            icon={ faTimes }
                            title="关闭"
                            size="lg"    
                        ></FontAwesomeIcon>
                    </button>
                </>
            }
        </div>
    )
}

export default FileSearch;