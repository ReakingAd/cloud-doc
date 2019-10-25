import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress';
import useContextMenu from '../hooks/useContextMenu';
import { getParentNode } from '../utils/helper';

// require node.js modules
const { remote } = window.require('electron');
const { Menu,MenuItem } = remote;

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
    const [editStatus, setEditStatus] = useState(false); // 当前被编辑的文件ID
    const [value, setValue] = useState(''); // 当前被编辑的文件的title
    const enterPressed = useKeyPress(13);
    const escPressed = useKeyPress(27);
    const closeSearch = ( editItem ) => {
        setEditStatus(false);
        setValue('');
        // 加入是新建中的文件。则需要删掉这个文件
        if( editItem.isNew )
            onFileDelete( editItem.id );
    }

    const clickedItem = useContextMenu(
        [
            {
                label:'打开',
                click:() => {
                    const parentElement = getParentNode( clickedItem.current,'file-item' )
                    if( parentElement )
                        onFileClick( parentElement.dataset.id )
                }
            },
            {
                label:'重命名',
                click:() => {
                    console.log('rename....')
                }
            },
            {
                label:'删除',
                click:() => {
                    console.log('del....')
                }
            }
        ],
        '.file-list',files
    )
    // 每次重新渲染视图，都会执行这个副作用
    useEffect(() => {
        const editItem = files.find(file => file.id === editStatus);
        if ( enterPressed && editStatus && value.trim() !== '' ) {
            if( editItem ){
                onSaveEdit( editItem.id, value,editItem.isNew );
                setEditStatus(false);
                setValue('')
            }
        }
        if ( escPressed && editStatus ){
            closeSearch( editItem );
        }
    // })
    },[enterPressed, escPressed, files, editStatus, onSaveEdit, value]) // warning 提示要加这个参数。否则有无限循环的风险
    // console.log('before var ref')
    let inputRef = useRef(null);
    useEffect(() => {
        if (editStatus)
            inputRef.current.focus();
    }, [editStatus])

    useEffect(() => {
        const newFile = files.find( file => file.isNew )
        if( newFile ){
            setEditStatus( newFile.id )
            setValue( newFile.title )
        }
    },[files])
    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map(file => {
                    return <li
                        className="list-group-item bg-light d-flex align-items-center row mx-0 file-item"
                        key={ file.id }
                        data-id={ file.id }
                        data-title={ file.title }
                    >
                        {
                            ( (file.id !== editStatus) && !file.isNew ) &&
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
                            ( ( file.id === editStatus ) || file.isNew ) &&
                            <>
                                <input
                                    className="form-control col-10"
                                    value={value}
                                    ref={ inputRef }
                                    placeholder="请输入文件名称"
                                    onChange={(e) => { setValue(e.target.value) }}
                                />
                                <button
                                    type="button"
                                    className="btn-icon col-2"
                                    onClick={() => { closeSearch(file) }}
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        title="关闭"
                                        size="xs"
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