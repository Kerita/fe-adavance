function promiseAll(promiseList) {
  let fulfilledCount = 0;
  let resultList = [];

  return new Promise((resolve, reject) => {
    const onFulfilled = (index, value) => {
      resultList[index] = value;
      fulfilledCount += 1;

      if (fulfilledCount === promiseList.length) {
        resolve(resultList);
      }
    };

    const onRejected = (reason) => {
      reject(reason);
    };

    promiseList.forEach((item, index) => {
      item.then(
        (value) => {
          onFulfilled(index, value);
        },
        (reason) => {
          onRejected(reason);
        }
      );
    });
  });
}

promiseAll([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(2);
    }, 2000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(3);
    }, 3000);
  }),
]).then(
  (list) => {
    console.log("kerita log:", list, "list");
  },
  (reason) => {
    console.log("kerita log:", reason, "reason");
  }
);
