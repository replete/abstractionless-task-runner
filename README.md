# abstractionless task runner

Why? It's just another option beside these usual approaches to frontend tooling:

## CLIs (e.g npm scripts)
Implements tasks with CLIs inside npm script definitions inside `package.json`.
Beyond simple projects, these implementations can end up highly verbose and/or hide  options in separate .json files. 
Sometimes package CLIs are third-party and/or out-of-sync, and it gets really messy when you want to involve async tasks.

## Task-runners (e.g. gulp)
Implement tasks with a task runner such as gulp. Often you are interacting with an abstraction of the thing you want to use (a plugin), which can easily be out-of-sync, buggy, or at times completely broken. When it works though, it's great.

## Bundlers (e.g webpack)
Bundlers like webpack are magical and can be the perfect solution. But they can also become extremely complicated to get working, and can suffer from the same problems as task-runners because they also rely on plugins.

# Package APIs + browser-sync
Write your own script and deal with package APIs directly.

* I've found `bs.watch()` to be faster than multiple concurrent package CLI watchers and easier to orchestrate.
* `glob, fs-extra, browser-sync` are required globally, but do what you will.
* `fs-extra` exposes a useful `outputFile` method, which creates parent directories if they dont currently exist


## TODO:

- [x] Separate and expose build/reload tasks to npm scripts
- [ ] Add more package examples
- [ ] Find useful abstractions (eg, transforming path strings)