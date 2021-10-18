const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
  _status = PENDING;
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];

  constructor(fn) {
    this.value = null;
    this.reason = null;

    if (this.isFunction(fn)) {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } else {
      throw new Error(`MPromise resolver ${fn} is not a function`);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;

    if (newStatus === FULFILLED) {
      this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
        callback(this.value);
      });
    }

    if (newStatus) {
      this.REJECTED_CALLBACK_LIST.forEach((callback) => {
        callback(this.reason);
      });
    }
  }

  isFunction(param) {
    return typeof param === "function";
  }

  resolve(value) {
    this.value = value;
    this.status = FULFILLED;
  }

  reject(reason) {
    this.reason = reason;
    this.status = REJECTED;
  }

  then(onFulfilled, onRejected) {
    const isOnFulfilledFunction = this.isFunction(onFulfilled);
    const isOnRejectedFunction = this.isFunction(onRejected);

    const onFulfilledFnWithCatch = (resolve, reject, newPromise) => {
      try {
        if (isOnFulfilledFunction) {
          const x = onFulfilled(this.value);
          this.resolvePromise(newPromise, x, resolve, reject);
        } else {
          resolve(this.value);
        }
      } catch (e) {
        reject(e);
      }
    };

    const onRejectedFnWithCatch = (resolve, reject) => {
      try {
        if (isOnRejectedFunction) {
          const x = onRejected(this.reason);

          this.resolvePromise(newPromise, x, resolve, reject);
        } else {
          reject(this.reason);
        }
      } catch (e) {
        reject(e);
      }
    };

    switch (this.status) {
      case FULFILLED: {
        const newPromise = new MPromise((resolve, reject) => {
          onFulfilledFnWithCatch(resolve, reject, newPromise);
        });
        return newPromise;
      }

      case REJECTED: {
        const newPromise = new MPromise((resolve, reject) => {
          onRejectedFnWithCatch(resolve, reject, newPromise);
        });
        return newPromise;
      }

      case PENDING: {
        const newPromise = new MPromise((resolve, reject) => {
          this.FULFILLED_CALLBACK_LIST.push(() => {
            onFulfilledFnWithCatch(resolve, reject, newPromise);
          });
          this.REJECTED_CALLBACK_LIST.push(() => {
            onRejectedFnWithCatch(resolve, reject, newPromise);
          });
        });

        return newPromise;
      }
    }

    if (isOnFulfilledFunction) {
    } else {
    }

    if (isOnRejectedFunction) {
    } else {
    }
  }

  resolvePromise(newPromise, x, resolve, reject) {
    if (newPromise === x) {
      return new Error("onFulfilled return value error");
    }

    if (x instanceof MPromise) {
      x.then((y) => {
        this.resolvePromise(newPromise, y, resolve, reject);
      }, reject);
    } else {
      resolve(x);
    }
  }

  catch(onRejected) {
    this.then(null, onRejected);
  }

  static all() {}

  static race() {}

  static resolve() {}

  static reject() {}
}

const promise = new MPromise((resolve, reject) => {
  setTimeout(() => {
    reject("reject");
  }, 100);
})
  .then((value) => {
    console.log("kerita log:then1", value, "value");
  })
  .then((value) => {
    console.log("kerita log:then2", value, "value");
  })
  .catch((error) => {
    console.log("kerita log:", error, "error");
  });
