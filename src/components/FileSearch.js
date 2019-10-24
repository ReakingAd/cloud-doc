import React,{ useState,useEffect,useRef } from 'react';

const FileSearch = ( {title,onFileSearch} ) => {
    const [ inputActive,setInputActive ] = useState( false );
    const [ value,setValue ] = useState('');

    const closeSearch = (e) => {
        e.preventDefault();
        setInputActive( false );
        setValue('');
    }
    let number = useRef( 1 );
    number.current++;
    console.log( number.current );
    // 每次重新渲染视图，都会调用useEffect()里面的回调函数
    useEffect( () => {
        const handleInputEvent = (event) => {
            const  { keyCode } = event;
            // 回车
            if( keyCode === 13 && inputActive ){
                onFileSearch( value );
            }
            // ESC
            else if( keyCode === 27 && inputActive ){
                closeSearch( event );
            }
        }
        document.addEventListener('keyup',handleInputEvent);
        return () => {
            document.removeEventListener('keyup',handleInputEvent)
        }
    })
    return (
        <div className="alert alert-primary">
            {
                !inputActive &&
                <div className="d-flex justify-content-between align-items-center">
                    <span>{title}</span>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={ () => { setInputActive( true ) }}
                    >
                        搜索
                    </button>
                </div>
            }
            {
                inputActive &&
                <div className="row">
                    <input 
                        className="form-control col-8"
                        value={ value }
                        onChange={ (e) => { setValue( e.target.value ) } }
                    />
                    <button
                        type="button"
                        className="btn btn-primary col-4"
                        onClick={ closeSearch }
                    >
                        关闭
                    </button>
                </div>
            }
        </div>
    )
}

export default FileSearch;