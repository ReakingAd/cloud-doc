import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
    const [editStatus, setEditStatus] = useState(false);
    const [value, setValue] = useState('');
    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);
    const closeSearch = () => {
        setEditStatus(false);
        setValue('');
    }
    // 每次重新渲染视图，都会执行这个副作用
    useEffect(() => {
        if (enterPressed) {
            const editItem = files.find(file => file.id === editStatus);
            if( editItem ){
                onSaveEdit(editItem.id, value);
                setEditStatus(false);
                setValue('')
            }
        }
        if (escPressed){
            closeSearch();
        }
    // })
    },[enterPressed, escPressed, files, editStatus, onSaveEdit, value]) // warning 提示要加这个参数。否则有无限循环的风险
    // console.log('before var ref')
    let inputRef = useRef(null);
    useEffect(() => {
        if (editStatus)
            inputRef.current.focus();
    }, [editStatus])
    return (
        <ul className="list-group list-group-flush">
            {
                files.map(file => {
                    return <li
                        className="list-group-item bg-light d-flex align-items-center row mx-0 px-0"
                        key={file.id}
                    >
                        {
                            (file.id !== editStatus) &&
                            <>
                                <span className="col-2">
                                    <FontAwesomeIcon
                                        size="lg"
                                        icon={faMarkdown}
                                    ></FontAwesomeIcon>
                                </span>
                                <span
                                    className="col-6 c-link"
                                    onClick={() => { onFileClick(file.id) }}
                                >
                                    {file.title}
                                </span>
                                <button
                                    type="button"
                                    className="btn-icon col-2"
                                    onClick={() => { setEditStatus(file.id); setValue(file.title) }}
                                >
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        title="编辑"
                                        size="xs"
                                    ></FontAwesomeIcon>
                                </button>
                                <button
                                    type="button"
                                    className="btn-icon col-2"
                                    onClick={() => { onFileDelete(file.id) }}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        title="删除"
                                        size="xs"
                                    ></FontAwesomeIcon>
                                </button>
                            </>
                        }
                        {
                            (file.id === editStatus) &&
                            <>
                                <input
                                    className="form-control col-10"
                                    value={value}
                                    ref={ inputRef }
                                    onChange={(e) => { setValue(e.target.value) }}
                                />
                                <button
                                    type="button"
                                    className="btn-icon col-2"
                                    onClick={closeSearch}
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        title="关闭"
                                        size="lg"
                                    ></FontAwesomeIcon>
                                </button>
                            </>
                        }

                    </li>
                })
            }
        </ul>
    )
}

FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func
}

export default FileList;