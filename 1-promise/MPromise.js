const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  _status = PENDING;
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];

  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  // #region status 定义
  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;

    switch (newStatus) {
      case FULFILLED: {
        this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value);
        });
        break;
      }

      case REJECTED: {
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason);
        });
        break;
      }
    }
  }

  // #endregion

  // #region resolve & reject
  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  // #endregion

  // region isFunction 定义
  isFunction(param) {
    return typeof param === "function";
  }
  // endregion

  // #region then 定义
  then(onFulfilled, onRejected) {
    const fulfilledFn = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => value;
    const rejectedFn = this.isFunction(onRejected)
      ? onRejected
      : (reason) => reason;

    const fulfilledFnWithCatch = (resolve, reject, newPromise) => {
      try {
        if (!this.isFunction(fulfilledFn)) {
          resolve(this.value);
        } else {
          const x = onFulfilled(this.value);
          this.resolvePromise(newPromise, x, resolve, reject);
        }
      } catch (e) {
        reject(e);
      }
    };

    const rejectedFnWithCatch = (resolve, reject) => {
      try {
        if (!this.isFunction(onRejected)) {
          reject(this.reason);
        } else {
          const x = onRejected(this.reason);

          this.resolvePromise(newPromise, x, resolve, reject);
        }
      } catch (e) {
        reject(e);
      }
    };

    switch (this.status) {
      case FULFILLED: {
        const newPromise = new MPromise((resolve, reject) => {
          fulfilledFnWithCatch(resolve, reject, newPromise);
        });

        return newPromise;
      }

      case REJECTED: {
        const newPromise = new MPromise((resolve, reject) => {
          rejectedFnWithCatch(resolve, reject, newPromise);
        });

        return newPromise;
      }

      case PENDING: {
        const newPromise = new MPromise((resolve, reject) => {
          this.FULFILLED_CALLBACK_LIST.push(() => {
            fulfilledFnWithCatch(resolve, reject, newPromise);
          });

          this.REJECTED_CALLBACK_LIST.push(() => {
            this.REJECTED_CALLBACK_LIST(resolve, reject, newPromise);
          });
        });

        return newPromise;
      }
    }
  }

  // endregion then 定义

  // region resolvePromise 函数定义
  resolvePromise(newPromise, x, resolve, reject) {
    if (newPromise === x) {
      return reject(new TypeError("xxxxxx"));
    }

    if (x instanceof MPromise) {
      x.then((y) => {
        this.resolvePromise(newPromise, y, resolve, reject);
      }, reject);
    } else if (typeof x === "object" || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }

      let then = null;

      try {
        then = x.then;
      } catch (error) {
        return reject(error);
      }

      if (this.isFunction(then)) {
        let called = false;

        try {
          then.call(x, (y) => {
            if (called) {
              return;
            }
            called = true;
            this.resolvePromise(newPromise, y, resolve, (r) => {
              if (called) {
                return;
              }
              called = true;
              reject(r);
            });
          });
        } catch (error) {
          if (called) {
            return;
          }
          called = true;
          reject(error);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  // endregion

  catch(onRejected) {
    this.then(null, onRejected);
  }
}

const promise = new MPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("value");
  }, 100);
});

console.log("kerita log:", promise, "promise");

promise
  .then((value) => {
    console.log("then1", value);
  })
  .catch((reason) => {
    console.log("catch1", reason);
  });

setTimeout(() => {
  console.log("kerita log:", promise, "promise");
}, 200);
