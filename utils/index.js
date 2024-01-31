module.exports.getFileName = (filePath)=>{
    let fileArr = filePath.split('/');
return fileArr.pop();
}


