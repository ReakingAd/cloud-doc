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

function App() {
	const [ files,setFiles ] = useState( defaultFiles );
	const [ activeFileID,setActiveFileID ] = useState('');
	const [ openedFileIDs,setOpenedFileIDs ] = useState([]);
	const [ unsavedFileIDs,setUnsavedFileIDs ] = useState([]);
	const [ searchedFiles,setSearchedFiles ] = useState([]);

	const openedFiles = openedFileIDs.map( openID => {
		return files.find( file => file.id === openID );
	})
	const activeFile = files.find( file => {
		return file.id === activeFileID 
	});
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
		let newFiles = files.map( file => {
			if( file.id === fileID )
				file.value = value;
			return file;
		})
		setFiles( files );
	}

	const deleteFile = (id) => {
		const newFiles = files.filter( file => file.id !== id )
		setFiles( newFiles );
		tabClose(id)
	}

	const updateFileName = ( fileID,newValue) => {
		let newFiles = files.map( file => {
			if( file.id === fileID )
				file.title = newValue;
			return file;
		})
		setFiles( newFiles );
	}

	const fileSearch = ( searchContent ) => {
		let searchedFiles = files.filter( file => file.title.includes( searchContent ) );
		console.log( searchedFiles )
		setSearchedFiles( searchedFiles ); // ***** paused here, 栈溢出
	}
	return (
		<div className="App container-fluid px-0">
			<div className="row no-gutters">
				<div className="col-3 bg-light left-panel">
					<FileSearch
						title="我的云文档"
						onFileSearch={ fileSearch }>	
					</FileSearch>
					<FileList
						files={ searchedFiles.length > 0 ? searchedFiles : files }
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
