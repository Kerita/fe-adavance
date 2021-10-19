const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("value");
  }, 100);
});

promise
  .then((value1) => {
    console.log("kerita log:", value1, "value1");

    return new Promise((resolve, reject) => {
      // resolve("second promise");
      reject("promise reject");
    });
  })
  .then(
    (value11) => {
      console.log("kerita log:", value11, "value11");
    },
    (reason11) => {
      console.log("kerita log:", reason11, "reason11");
    }
  );

promise.then((value2) => {
  console.log("kerita log:", value2, "value2");
});
