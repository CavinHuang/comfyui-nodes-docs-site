const path = require('path');
const fs = require('fs');

const nodesDocs = path.join(__dirname, './nodes-docs/nodes-docs');

const sideBarTS = path.join(__dirname, './nodes-docs/.vitepress/config/sideBar.ts');

const zhNodesDocs = path.join(nodesDocs, 'zh-CN');
const enNodesDocs = path.join(nodesDocs, 'en-US');

const sideBarTSContent = 'export const sideBar = ';

const windowsPathIgnore = [
    ['/', '%2F'],
    ['\\', '%5C'],
    [':', '%3A'],
    ['*', '%2A'],
    ['|', '%7C'],
    ['<', '%3C'],
    ['>', '%3E'],
    ['"', '%22'],
    ['?', '%3F'],
    ['[', '%5B'],
    [']', '%5D'],
  ]


  /**
   * 
   * @param {string} name 
   * @returns 
   */
const repairFileName = (name) => {
    windowsPathIgnore.forEach(item => {
        name = name.replace(item[0], item[1])
    })
    return name
}

const repireDocsFileName = () => {
    const files = fs.readdirSync(zhNodesDocs);
    files.forEach(file => {
        const filePath = path.join(zhNodesDocs, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const children = fs.readdirSync(filePath);
            children.forEach(child => {
                const childPath = path.join(filePath, child);
                const childStat = fs.statSync(childPath);
                if (childStat.isFile()) {
                    const newChildPath = path.join(filePath, repairFileName(child));
                    fs.renameSync(childPath, newChildPath)
                }
            })
        } else {
            const newFilePath = path.join(zhNodesDocs, repairFileName(file));
            fs.renameSync(filePath, newFilePath)
        }
    })

    const enFiles = fs.readdirSync(enNodesDocs);
    enFiles.forEach(file => {
        const filePath = path.join(enNodesDocs, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const children = fs.readdirSync(filePath);
            children.forEach(child => {
                const childPath = path.join(filePath, child);
                const childStat = fs.statSync(childPath);
                if (childStat.isFile()) {
                    const newChildPath = path.join(filePath, repairFileName(child));
                    fs.renameSync(childPath, newChildPath)
                }
            })
        } else {
            const newFilePath = path.join(enNodesDocs, repairFileName(file));
            fs.renameSync(filePath, newFilePath)
        }
    })
}


const buildSideBar = (dir, parent = '') => {
    const sideBar = []
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        const fileName = file.replace('.md', '').replace('[', '%5B').replace(']', '%5D');
        const link = parent ? parent + '/' + fileName : fileName
        if (stat.isDirectory()) {
            const children = buildSideBar(filePath, link);
            sideBar.push({
                text: fileName,
                collapsed: true,
                // link: `/${link}`,
                items: children
            })
        } else {
            sideBar.push({
                text: file.replace('.md', ''),
                link: `/${link}`
            })
        }
    })
    return sideBar;
}

repireDocsFileName()
const sideBarData = buildSideBar(zhNodesDocs, 'nodes-docs/zh-CN');
console.log(sideBarData)

const sideBarContent = sideBarTSContent + JSON.stringify(sideBarData, null, 2) + ';'

fs.writeFileSync(sideBarTS, sideBarContent, 'utf-8')