define("a", ["lodash"], (_) => {
  console.log("kerita log:", "module a load");

  return {
    str: function () {
      console.log("kerita log:", "module a run");
      return _.repeat(">>>", 10);
    },
  };
});
