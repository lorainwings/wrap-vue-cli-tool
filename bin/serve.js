#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const fuzzy = require('fuzzy');
const { execSync } = require('child_process');
const autocomplete = require('inquirer-autocomplete-prompt');

inquirer.registerPrompt('autocomplete', autocomplete);

const renderDirList = () => {
  const destDir = path.resolve(__dirname, '../src/pages/');
  const files = fs.readdirSync(destDir);
  const list = files.filter(f => {
    if (!/template|^\./gi.test(f)) return true;
    return false;
  });
  return list;
};

const renderRes = async choices => {
  const ans = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'name',
      pageSize: 6,
      message: '请输入活动名称用于搜索或者通过上下方向键进行选择!',
      source(answers, input = '') {
        return new Promise(resolve => {
          setTimeout(() => {
            const fuzzyResult = fuzzy.filter(input, choices);
            resolve(fuzzyResult.map(el => el.original));
          }, 100);
        });
      }
    }
  ]);
  return ans;
};

const selectTask = async () => {
  const choices = renderDirList();
  const { name } = await renderRes(choices);
  console.log('需要开启本地服务的活动为:', name);
  execSync(`npm run vue-serve ${name}`, { stdio: 'inherit' });
};

module.exports = selectTask;
