const modules = {};
const exports = {};

window.sj = {};

toUrl = (dep) => {
  const pathname = location.pathname;
  const url = pathname.slice(0, pathname.lastIndexOf("/") + 1) + dep + ".js";
  return url;
};

const __load = (url) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName("head")[0];
    const node = document.createElement("script");
    node.type = "text/javascript";
    node.src = url;
    node.async = true;
    node.onload = resolve;
    node.onerror = reject;
    head.appendChild(node);
  });
};

const getDepsFromFn = (fn) => {
  // 1.require()
  // 2.a
  // 3.')
  // [?:] 正则避免回溯，
  let reg = /(?:require\(['"])(.+)(?:['"]\))/g;

  let matches = [];

  let r = null;

  while ((r = reg.exec(fn)) !== null) {
    matches.push(r[1]);
  }

  return matches;
};

define = (id, factory) => {
  const url = toUrl(id);
  const deps = getDepsFromFn(factory);

  if (!modules[id]) {
    modules[id] = {
      id,
      url,
      factory,
      deps,
    };
  }
};

const __require = (id) => {
  return __load(toUrl(id)).then(() => {
    const { factory, deps } = modules[id];

    if (!deps || deps.length) {
      factory(__require, __exports(id), __module);
      return __exports[id];
    }

    return sj.use(deps, factory);
  });
};

const __exports = (id) => exports[id] || (exports[id] = {});
const __module = this;

sj.use = (mods, callback) => {
  mods = Array.isArray(mods) ? mods : [mods];

  return Promise.all(
    mods.map(
      modules.map((mod) => {
        const { factory } = modules[mod];
        return factory(__require, __exports(mod), __module);
      })
    )
  ).then((modules) => {
    callback && callback(modules);
  });
};
