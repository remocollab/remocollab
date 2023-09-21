#! /usr/bin/env node

const fs = require('fs')
const axios = require('axios')
const fse = require('fs-extra');
const compressing = require('compressing');
const currentPath = process.cwd();
const remocollabConfig = JSON.parse(fs.readFileSync(currentPath+'/remocollab.json', 'utf8'));

console.log(`Remocollab config loaded from remocollab.json`)


for (let i = 0; i < remocollabConfig.length; i++) {
    const name = remocollabConfig[i].name;
    const libs = remocollabConfig[i].libs;
    const regex = /https:\/\/github.com\/(.*)\/(.*)/;
    const match = name.match(regex);
    const org = match[1];
    const repo = match[2];


    const downloadUrl = `${remocollabConfig[i].name}/archive/refs/heads/${remocollabConfig[i].branch}.zip`; // 替换为要下载的zip文件URL

    const tempUrl = `./${org}-${repo}.zip`

    const branch = remocollabConfig[i].branch;


    axios({
        method: 'GET',
        url: downloadUrl,
        responseType: 'arraybuffer'
    })
        .then(response => {
            fs.writeFileSync(tempUrl, response.data);
            compressing.zip.uncompress(tempUrl,currentPath+'/').then(() => {
                const srcDir = `${currentPath}/${repo}-${branch}/${libs}`; // 替换为源文件夹的路径
                const destDir = `${currentPath}/src/remocollab/${repo}`; // 替换为目标文件夹的路径

                fse.removeSync(destDir);
                fse.copySync(srcDir, destDir);

                // 删除临时文件
                fse.removeSync(`${currentPath}/${repo}-${branch}`);
                fse.removeSync(tempUrl)
                console.log(`✔ Generated Remocollab components (v0.0.1) to ./src/remocollab/${repo}`)
            }).catch(() => {
                console.log(`error code: 003`)
            })
        })
        .catch(error => {
            console.log(`error code: 002`)
        });
}


