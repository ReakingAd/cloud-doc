const fs = require('fs').promises;
const path = require('path');

const fileHelper = {
    readFile:(path,cb) => {
        return fs.readFile(path,{encoding:'utf8'} );
    },
    writeFile:(path,content,cb) => {
        return fs.writeFile(path,content,{encoding:'utf8'})
    },
    renameFile:(path,newPath) => {
        return fs.rename( path,newPath )
    },
    deleteFile:(path) => {
        return fs.unlink( path );
    }
}

const testPath = path.join( __dirname,'helper.js' );
fileHelper.readFile( testPath ).then( res => {
    console.log(res)
})
// const testWritePath = path.join( __dirname,'hello.md')
// console.log( testWritePath )
// fileHelper.writeFile(testWritePath,'## hell',() => {
//     console.log('success');
// })

// fileHelper.renameFile( path.join(__dirname,'hello.md'),'aaaa')
fileHelper.deleteFile( path.join( __dirname,'aaaa'))