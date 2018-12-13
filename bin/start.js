
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const readline = require('readline');

const readdir = promisify(fs.readdir); // read dir
const stat = promisify(fs.stat); // check exist
const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * @desc 将普通函数promise化
 * @param {Function} fn 待转换的函数
 */
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      args.push((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      fn(...args);
    });
}

/**
 * @desc 接受用户输入内容
 * @param {*} tips 提示内容
 */
const readSyncByRl = tips => {
  tips = tips || '> ';

  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(tips, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

/**
 * @desc 检查目录是否存在,不存在则创建
 * @param {*} dist 目录名
 */
const checkDirExist = dist =>
  access(dist).catch(async () => {
    await mkdir(dist);
  });

/**
 * @desc 通过读写文件流复制文件
 * @param {*} src 源文件地址
 * @param {*} dist 目标文件地址
 */
const copyFile = (src, dist) => {
  const readStream = fs.createReadStream(src, { start: 0 });
  const writeStream = fs.createWriteStream(dist, { start: 0 });
  readStream.pipe(writeStream);
};

/**
 * @desc 递归操作文件
 * @param  {String} path 源目录路径
 * @param  {String} dist 目标目录路径
 * @param  {Function} callback 回调
 */
const operaDirRecur = async (path, dist, callback) => {
  await checkDirExist(dist);
  return readdir(path).then(files => {
    files = files.map(item => {
      const _path = `${path}/${item}`;
      const _dist = `${dist}/${item}`;
      return stat(_path).then(stats => {
        if (stats.isDirectory()) {
          return operaDirRecur(_path, _dist, callback);
        }
        return Promise.resolve(copyFile(_path, _dist));
      });
    });
    return Promise.all(files);
  });
};

/**
 * @desc 项目初始化失败的回调
 * @param {*} name 错误信息
 */
const proInitError = err => {
  console.log(`项目初始化失败, ${err} 请重新输入命令创建!`.underline.red);
  process.exit();
};

/**
 * @desc 项目初始化成功的回调
 * @param {*} name 用户输入的名称
 */
const proInitSuccess = async name => {
  const src = path.join(process.cwd(), './src/pages/template');
  const dist = path.join(process.cwd(), `./src/pages/${name}`);
  await operaDirRecur(src, dist);
};

/**
 * @desc 修改活动的入口地址
 * @param {*} name 项目名称
 * @param {*} note 项目活动注释
 */
const replaceEntryForWebpack = async (name, note) => {
  const dist = path.join(process.cwd(), './public/index.js');
  const entry = path.join(process.cwd(), `./src/pages/${name}`);
  const reader = await readFile(dist, 'utf8').then(data => {
    const caches = data.toString().split('\n');
    const result = caches.map(line => {
      if (line.indexOf('}') > -1) {
        return `  ${name}: '${name}', // ${note}\n};`;
      } else if (/const\s+current/gi.test(line)) {
        return `const current = list.${name}; // 当前活动入口标志`;
      } else if (/\w+:\s*'\w+'(,?)/gi.test(line)) {
        return line.replace(/(\w+:\s*'\w+')(,?)/gi, '$1,');
      }
      return line;
    });
    return result.join('\n');
  });
  await writeFile(dist, reader, 'utf8').then(
    () => console.log(`项目入口路径修改完成! \n项目入口为: ${entry}`.green),
    () => console.log('====== 活动页面入口路径修改失败! =====\n'.underline.red)
  );
};

/**
 * @desc 按照输入的项目名称结构化项目目录
 * @param {*} input 项目名称
 */
const dirFileInit = input => {
  const dist = path.join(process.cwd(), './src/pages');
  return readdir(dist).then(async files => {
    if (files.includes(input)) {
      proInitError('pages文件夹下该项目名已存在!');
    } else {
      await proInitSuccess(input);
      setTimeout(process.exit, 1000);
    }
  });
};

const collectInput = async (prompt, name) =>
  readSyncByRl(prompt).then(async input => {
    if (input === '') {
      return collectInput(`===== ${name}为空,请重新输入：=====\n`, name);
    }
    console.log(`你输入的${name}为:   ${input}`.bold);
    return input;
  });

/**
 * @desc 初始化项目总任务调度
 */
const createTask = async () => {
  const name = await collectInput(
    '请输入英文名称用于创建项目目录(请使用驼峰命名)：',
    '项目目录英文名称'
  );
  // const note = await collectInput(
  //   '请输入注释用于本次创建项目的活动说明(请使用中文)：',
  //   '本次创建项目注释'
  // );
  await dirFileInit(name);
  // await replaceEntryForWebpack(name, note);
  console.log(`👍👍👍  项目已创建完成, Good Luck~`.green.bold);
};

module.exports = createTask;
