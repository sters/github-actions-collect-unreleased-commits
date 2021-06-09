// @ts-nocheck
import { getInput, setFailed, setOutput } from '@actions/core';
import { execFile } from 'child_process';
import { Readable } from 'stream';
import through from 'through2';

const modes = {
  onlyPullRequests: 'only-pull-requests',
  onlyMergeCommit: 'only-merge-commit',
  allCommit: 'all-commit',
};

const parseInputs = () => {
  return {
    workspace: getInput('workspace'),
    mode: getInput('mode'),
    format: getInput('format'),
  };
};

const run = async (cmd, args, cwd) => {
  const readable = new Readable();
  readable._read = () => { };

  let isError = false;

  const child = execFile(cmd, args, {
    cwd: cwd,
    maxBuffer: Infinity
  });

  child.stdout
    .pipe(through((chunk, enc, cb) => {
      readable.push(chunk);
      isError = false;
      cb();
    }, (cb) => {
      setImmediate(() => {
        if (!isError) {
          readable.push(null);
          readable.emit('close');
        }
        cb();
      })
    }));

  child.stderr
    .pipe(through.obj((chunk) => {
      isError = true;
      readable.emit('error', new Error(chunk));
      readable.emit('close');
    }));

  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}

const getLatestTag = async (workspace) => {
  const cmd = `git`;
  const args = ['log', `--format=%D`, '--decorate-refs=tags'];
  const result = await run(cmd, args, workspace);
  const m = [...result.matchAll(/tag:\s([^\s,]+)/gm)];
  if (m.length === 0) {
    return '';
  }
  return m[0][1];
};

const getCommits = async (workspace, format, mode, latestTag) => {
  const cmd = `git`;
  const range = latestTag === '' ? 'HEAD' : `${latestTag}..HEAD`;
  const args = ['log', range, `--format={{filter:%B}}${format}//`];
  const result = await run(cmd, args, workspace);

  return result.split('//\n').filter((s) => {
    switch (mode) {
      case modes.onlyPullRequests:
        return s.match(/#\d+/) !== null;

      case modes.onlyMergeCommit:
        return s.match(/Merge/) !== null;

      default:
        return true;
    }
  }).map((s) => {
    return s.replace(/{{filter:.+?}}/gs, '');
  }).join('\n');
};

const main = async () => {
  const inputs = parseInputs();

  const latestTag = await getLatestTag(inputs.workspace);
  setOutput(
    'latest-tag',
    latestTag,
  );

  setOutput(
    'commits',
    await getCommits(inputs.workspace, inputs.format, inputs.mode, latestTag),
  );
};

try {
  await main();
} catch (error) {
  setFailed(error.message);
}
