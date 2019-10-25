import React,{ useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFiles';
import BottomBtn from './components/BottomBtn';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import TabList from './components/TabList';
import uuidv4 from 'uuid/v4';
import { flattenArr ,objToArr } from './utils/helper';


function App() {
	const [ files,setFiles ] = useState( flattenArr(defaultFiles) );
	const [ activeFileID,setActiveFileID ] = useState('');
	const [ openedFileIDs,setOpenedFileIDs ] = useState([]);
	const [ unsavedFileIDs,setUnsavedFileIDs ] = useState([]);
	const [ searchedFiles,setSearchedFiles ] = useState([]);

	const filesArr = objToArr( files );
	const fileListFileClick = ( fileID ) => {
		if( !openedFileIDs.includes( fileID ) )
			setOpenedFileIDs( [ ...openedFileIDs ,fileID ] )
		setActiveFileID( fileID );
	}
	const tabListTabClick = (fileID) => {
		setActiveFileID( fileID );
	}

	const tabClose = ( fileIDClicked ) => {
		const tabsWithout = openedFileIDs.filter( fileID => fileID !== fileIDClicked );
		setOpenedFileIDs( tabsWithout );

		if( !tabsWithout.includes( activeFileID ) ){
			setActiveFileID( openedFileIDs[ 0 ] );
		}
	}

	const filechange = ( fileID,value ) => {
		console.log(fileID,value)
		// 1. 更新 unsaved
		if( !unsavedFileIDs.includes(fileID) )
			setUnsavedFileIDs( [ ...unsavedFileIDs,fileID ] );
		// let newFiles = files.map( file => {
		// 	if( file.id === fileID )
		// 		file.value = value;
		// 	return file;
		// })
		const newFile = { ...files[ fileID ],body:value }
		setFiles( { ...files,[fileID]:newFile } );
		// setFiles( newFiles );
	}

	const deleteFile = (id) => {
		delete files[ id ];
		setFiles( files );
		tabClose(id)
	}

	const updateFileName = ( fileID,newValue ) => {
		const modifiedFile = { ...files[ fileID ],title:newValue,isNew:false }
		setFiles( { ...files,[fileID]:modifiedFile } );
	}

	const fileSearch = ( searchContent ) => {
		// let searchedFiles = files.filter( file => file.title.includes( searchContent ) );
		let searchedFiles = filesArr.filter( file => file.title.includes( searchContent ) );
		setSearchedFiles( searchedFiles );
	}

	const createNewFile = () => {
		const newID = uuidv4();
		const newFile = {
			id:newID,
			title:'',
			body:'## 请输入..',
			createAt:new Date().getTime(),
			isNew:true
		}
		setFiles( {
			...files,[newID]:newFile
		} );
	}

	const activeFile = files[ activeFileID ];
	const openedFiles = openedFileIDs.map( openID => {
		return files[ openID ]
	})
	return (
		<div className="App container-fluid px-0">
			<div className="row no-gutters">
				<div className="col-3 bg-light left-panel">
					<FileSearch
						title="我的云文档"
						onFileSearch={ fileSearch }>	
					</FileSearch>
					<FileList
						files={ searchedFiles.length > 0 ? searchedFiles : filesArr }
						onFileClick={ fileListFileClick }
						onFileDelete={ deleteFile }
						onSaveEdit={ updateFileName }
					></FileList>
					<div className="row no-gutters button-group">
						<div className="col">
							<BottomBtn
								text="新建"
								colorClass="btn-primary"
								icon={ faPlus }
								onBtnClick={ createNewFile }
							></BottomBtn>
						</div>
						<div className="col">
							<BottomBtn
								text="导入"
								colorClass="btn-success"
								icon={ faFileImport }
							></BottomBtn>
						</div>
					</div>
				</div>
				<div className="col-9 right-panel">
					{
						!activeFile &&
						<div className="start-page">
							选择或者创建新的 Markdown 文档
						</div>
					}
					{
						activeFile &&
						<>
							<TabList
								files={ openedFiles }
								activeId={ activeFileID }
								unsaveIds={ unsavedFileIDs }
								onTabClick={ tabListTabClick }
								onCloseTab={ tabClose }
							></TabList>
							<SimpleMDE
								key={ activeFile && activeFile.id }
								value={ activeFile && activeFile.body }
								onChange={ (value) => { filechange(activeFile.id,value) } }
								options={
									{minHeight:'515px'}
								}
							></SimpleMDE>
						</>
					}
					
				</div>
			</div>	
		</div>
	);
}

export default App;
