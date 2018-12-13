const { ENTRY } = process.env;
const { execSync } = require('child_process');

const CHECK_DIFF_MAX_COUNT = 5;

// get diff
const getEntry = cmd => {
  const pages = {};
  const diff = execSync(cmd, { encoding: 'utf8' });
  if (diff) {
    const paths = diff.split('\n');
    paths.map(p => {
      const m = /src\/pages\/([a-zA-Z]+?)\/.*/gi.exec(p);
      const entry = m && m[1];
      if (entry && !pages[entry]) {
        pages[entry] = true;
      }
    });
  }
  return Object.keys(pages);
};

// diff check
const checkDiff = () => {
  let pages = getEntry('git diff --name-only HEAD src');
  if (ENTRY) return [`${ENTRY}`];
  if (pages.length === 0) {
    const log = execSync('git log --oneline', { encoding: 'utf8' });
    const commits = log && log.split('\n').length;
    const diffCommitCounts =
      commits > CHECK_DIFF_MAX_COUNT ? CHECK_DIFF_MAX_COUNT : commits;
    for (let i = 1; i <= diffCommitCounts; i++) {
      pages = getEntry(`git diff --name-only HEAD~${i} src`);
      if (pages.length !== 0) return pages;
    }
    return ['template'];
  }
  return pages;
};

// build
const build = async entries => {
  for (const p of entries) {
    await execSync(`npm run build ${p}`);
    console.log(`❤️  已完成${p}的构建流程`);
  }
  console.log('🎉🎉🎉 Congratulations! build task finish!  🎉🎉🎉');
};

const buildTask = () => {
  const entries = checkDiff();
  console.log('The following changes were detected:\n', entries);
  build(entries).catch(() => {
    console.log('😨  打包构建流程失败! 😨');
  });
};

module.exports = buildTask;
