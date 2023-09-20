#! /usr/bin/env node

const fs = require('fs')
const axios = require('axios')
const fse = require('fs-extra');
const compressing = require('compressing');
const currentPath = process.cwd();
const fileData = fs.readFileSync(currentPath+'/remocollab.json', 'utf8');



console.log(fileData,currentPath,'fileData')

const url = 'https://github.com/arextest/arex-request/archive/refs/heads/main.zip'; // 替换为要下载的zip文件URL

axios({
    method: 'get',
    url: url,
    responseType: 'arraybuffer'
})
    .then(response => {
        fs.writeFileSync(currentPath+'/downloaded-zip.zip', response.data);
        // 将压缩包解压到 test 文件夹中
        compressing.zip.uncompress(currentPath+'/downloaded-zip.zip',currentPath+'/').then(() => {
            console.log('解压完成')

            const srcDir = currentPath+'/arex-request-main/packages'; // 替换为源文件夹的路径
            const destDir = currentPath+'/src/components'; // 替换为目标文件夹的路径

            fse.copySync(srcDir, destDir);
        }).catch(() => {
            console.log('解压失败')
        })


    })
    .catch(error => {
        console.error(`Error downloading zip file: ${error}`);
    });



