const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
const PENDING = "PENDING";

class MPromise {
  constructor(fn) {
    this._status = PENDING;
    this.value = null;
    this.reason = null;

    this.FULFILLED_CALLBACK_LIST = [];
    this.REJECTED_CALLBACK_LIST = [];

    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }

  get status() {
    return this._status;
  }

  set status(newStatus) {
    switch (newStatus) {
      case FULFILLED:
        this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value);
        });
        break;

      case REJECTED:
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason);
        });
        break;

      default:
        break;
    }
  }

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

  isFunction(fn) {
    return typeof fn === "function";
  }

  then(onFullfilled, onRejected) {
    const fulfilledFn = this.isFunction(onFullfilled)
      ? onFullfilled
      : (value) => {
          return value;
        };

    const rejectedFn = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };

    const fulfilledFnWithCatch = (resolve, reject) => {
      try {
        fulfilledFn(this.value);
        resolve(this.value);
      } catch (e) {
        reject(e);
      }
    };

    const rejectedFnWithCatch = (resolve, reject) => {
      try {
        rejectedFn(this.reason);

        if (this.isFunction(onRejected)) {
          resolve();
        }
      } catch (e) {
        reject(e);
      }
    };

    switch (this.status) {
      case FULFILLED:
        return new MPromise(fulfilledFnWithCatch);

      case REJECTED:
        return new MPromise(rejectedFnWithCatch);

      case PENDING:
        return new MPromise((resolve, reject) => {
          this.FULFILLED_CALLBACK_LIST.push(fulfilledFn);
          this.REJECTED_CALLBACK_LIST.push(rejectedFn);
        });

      default:
        break;
    }
  }
}

export default MPromise;
