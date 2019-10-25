const { remote } = require('electron');

const $ = (id) => {
    return document.getElementById( id );
}

document.addEventListener('DOMContentLoaded',() => {
    $('select-new-location').addEventListener('click',() => {
        remote.dialog.showOpenDialog({
            properties:['openDirectory'],
            message:'选择文件的存储路径'
        },(path) => {
            console.log( path )
        }).catch( err => console.log(err) )
    })
})