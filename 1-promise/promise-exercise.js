const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("reason");
  }, 100);
});

promise.then(1, 2).then(
  (value) => {
    console.log("then 2", value, "value");
  },
  (error) => {
    console.log("catch 2", error, "error");
  }
);
