const def = new Map();

const defaultOptions = {
  paths: {},
};

rj = {};

rj.config = (options) => Object.assign(defaultOptions, options);

define = (dep, deps, factory) => {
  def.set(dep, {
    dep,
    deps,
    factory,
  });
};

__import = (url) => {
  return System.import(url);
};

__getUrl = (dep) => {
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

require = (deps, factory) => {
  return Promise.all(
    deps.map((dep) => {
      if (defaultOptions.paths[dep]) return __import(defaultOptions.paths[dep]);

      return __load(__getUrl(dep)).then(() => {
        const { deps, factory } = def.get(dep);

        if (deps.length === 0) {
          return factory(null);
        }

        return require(deps, factory);
      });
    })
  ).then((modules) => factory(...modules));
};
