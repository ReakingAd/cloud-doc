import React,{ useState,useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFiles';
import BottomBtn from './components/BottomBtn';
import { faPlus, faFileImport,faSave } from '@fortawesome/free-solid-svg-icons';
import TabList from './components/TabList';
import uuidv4 from 'uuid/v4';
import { flattenArr ,objToArr } from './utils/helper';
import fileHelper from './utils/fileHelper';
import useIpcRenderer from './hooks/useIpcRenderer';

// require node.js modules
const path  = window.require('path');
const { remote,ipcRenderer } = window.require('electron');
const Store = window.require('electron-store');
const fileStore = new Store({'name':'Files Data'});

const saveFilesToStore = (files) => {
	const filesStoreObj = objToArr( files ).reduce( (result,file) => {
		const { id,path,title,createAt } = file;
		result[ id ] = {
			id,
			path,
			title,
			createAt
		}

		return result;
	},{})
	fileStore.set('files',filesStoreObj);
}

function App() {
	const [ files,setFiles ] = useState( fileStore.get('files') || {} );
	const [ activeFileID,setActiveFileID ] = useState('');
	const [ openedFileIDs,setOpenedFileIDs ] = useState([]);
	const [ unsavedFileIDs,setUnsavedFileIDs ] = useState([]);
	const [ searchedFiles,setSearchedFiles ] = useState([]);
	const filesArr = objToArr( files );
	const activeFile = files[ activeFileID ];
	const openedFiles = openedFileIDs.map( openID => {
		return files[ openID ]
	})
	const savedLocation = remote.app.getPath('documents');

	const fileListFileClick = ( fileID ) => {
		setActiveFileID( fileID );
		const currenFile = files[ fileID ];
		if( !currenFile.isLoaded )
			fileHelper.readFile( currenFile.path ).then( value => {
				const newFile = {
					...files[ fileID ],
					body:value,
					isLoaded:true
				}
				setFiles( { ...files,[ fileID ]:newFile } )
			})
		if( !openedFileIDs.includes( fileID ) )
			setOpenedFileIDs( [ ...openedFileIDs ,fileID ] )
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
		if( value !== files[ fileID ].body ){
			// 1. 更新 unsaved
			if( !unsavedFileIDs.includes(fileID) )
			setUnsavedFileIDs( [ ...unsavedFileIDs,fileID ] );
			const newFile = { ...files[ fileID ],body:value }
			setFiles( { ...files,[fileID]:newFile } );
		}
	}

	const deleteFile = (id) => {
		if( !files[ id ].path ){
			const { [id]:value,...afterDelete } = files; // *** spread 的花式用法
			setFiles( afterDelete );
		}
		else{
			fileHelper.deleteFile( files[ id ].path ).then(() => {
				delete files[ id ];
				setFiles( files );
				saveFilesToStore( files )
				tabClose(id);
			})
		}
	}

	const updateFileName = ( fileID,newValue,isNew ) => {
		// const newPath = path.join( savedLocation,`${ newValue }.md`)
		const newPath = isNew 
			? path.join( savedLocation,`${ newValue }.md`)
			: path.join( 
				path.dirname( files[ fileID ].path ),
				`${ newValue }.md`
			)
		const modifiedFile = {
			...files[ fileID ],
			title:newValue,
			isNew:false,
			path:newPath
		}
		const newFiles = { ...files,[fileID]:modifiedFile };
		if( isNew ){
			fileHelper.writeFile( newPath,files[ fileID ].body ).then( res => {
				setFiles( newFiles );
				saveFilesToStore( newFiles );
			})
		}
		else{
			const oldPath = files[ fileID ].path;
			fileHelper.renameFile( oldPath,newPath ).then( res => {
				setFiles( newFiles );
				saveFilesToStore( newFiles );
			})
		}
	}

	const fileSearch = ( searchContent ) => {
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
		setFiles({
			...files,[newID]:newFile
		});
	}

	const saveCurrentFile = () => {
		fileHelper.writeFile(
			path.join( activeFile.path ),
			activeFile.body
		).then( () => {
			setUnsavedFileIDs(
				unsavedFileIDs.filter( fileID => fileID !== activeFile.id )
			)
		})
	}

	const importFiles = () => {
		remote.dialog.showOpenDialog({
			title:'选择导入的 Markdown 文件',
			properties:['openFile','multiSelections'],
			filters:[
				{ name:'Markdown files',extensions:['md'] }
			]
		}).then( res => {
			const paths = res.filePaths;
			const filteredPaths = paths.filter( path => {
				return !Object.values( files ).find( file => file.path === path );
			})

			const importFilesArr = filteredPaths.map( filePath => {
				return {
					id:uuidv4(),
					title:path.basename( filePath,path.extname( filePath )),
					path:filePath
				}
			})

			const newFiles = {
				...files,
				...flattenArr( importFilesArr )
			}
			setFiles( newFiles );
			saveFilesToStore( newFiles );
			if( importFilesArr.length > 0 ){
				remote.dialog.showMessageBox({
					type:'info',
					title:`成功导入了${ importFilesArr.length }个文件`,
					message:`成功导入了${ importFilesArr.length }个文件`
				})
			}
		})
	}

	useIpcRenderer({
		'create-new-file':createNewFile,
		'import-file':importFiles,
		'save-edit-file':saveCurrentFile
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
								onBtnClick={ importFiles }
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
