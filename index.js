const FULFILLED = 'fulfilled';
const PENDING = 'pending';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.result = undefined;
    this.onFulfilledFn = [];
    this.onRejectedFn = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.result = value;
        this.onFulfilledFn.forEach((fn) => fn(value));
      }
    };

    const reject = (error) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.result = error;
        this.onRejectedFn.forEach((fn) => fn(error));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.state === PENDING) {
        if (onFulfilled) {
          this.onFulfilledFn.push(() => {
            try {
              const newResult = onFulfilled(this.result);
              if (newResult instanceof MyPromise) {
                newResult.then(resolve, reject);
              } else {
                resolve(newResult);
              }
            } catch (error) {
              reject(error);
            }
          });
        }
        if (onRejected) {
          this.onRejectedFn.push(() => {
            try {
              const newResult = onRejected(this.result);
              if (newResult instanceof MyPromise) {
                newResult.then(resolve, reject);
              } else {
                reject(newResult);
              }
            } catch (error) {
              reject(error);
            }
          });
        }
        return;
      }

      if (onFulfilled && this.state === FULFILLED) {
        try {
          const newResult = onFulfilled(this.result);
          if (newResult instanceof MyPromise) {
            newResult.then(resolve, reject);
          } else {
            resolve(newResult);
          }
        } catch (error) {
          reject(error);
        }

        return;
      }

      if (onRejected && this.state === REJECTED) {
        try {
          const newResult = onRejected(this.result);
          if (newResult instanceof MyPromise) {
            newResult.then(resolve, reject);
          } else {
            reject(newResult);
          }
        } catch (error) {
          reject(error);
        }
        return;
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// first test
// const promise = new MyPromise((resolve, reject) => {
//   resolve('success');
// });

// const promise2 = new MyPromise((resolve, reject) => {
//   reject('error');
// });

// console.log(promise);
// console.log(promise2);

// with setTimeout
// const promiseST = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve('success -> promiseST'), 1000);
// });

// setTimeout(() => console.log(promiseST), 1500);

// resolve, reject is called only once
// const promiseST2 = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve('success -> promiseST2'), 100);
//   setTimeout(() => reject('error -> promiseST2'), 200);
//   resolve('success -> promiseST2 one');
// });

// setTimeout(() => console.log(promiseST2), 400);

// then()
// const promiseThen = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve('success'), 100);
// }).then((value) => {
//   console.log('promise then ->', value);
// });

// then()  err
// const promiseThenErr = new MyPromise((resolve, reject) => {
//   setTimeout(() => reject(new Error('ERROR!')), 1500);
// }).then(
//   (value) => {
//     console.log('then', value);
//   },
//   (error) => {
//     console.log('then error', error);
//   }
// );

// catch err

// const promiseCatch = new MyPromise((resolve, reject) => {
//   setTimeout(() => reject(new Error('CATCH ERROR!')), 2500);
// }).catch((error) => {
//   console.log('catch', error);
// });

// promise chain
// const promiseChain = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve('success '), 500);
// })
//   .then((value) => {
//     return value + 'first then ';
//   })
//   .then((value) => {
//     return value + 'second then';
//   })
//   .then((value) => {
//     console.log(value);
//   });

//return in then new Promise
const promise = new MyPromise((resolve, reject) => {
  resolve('succes  ');
})
  .then((value) => {
    return new MyPromise((resolve, reject) => {
      setTimeout(() => resolve(value + 'new promise'), 500);
    });
  })
  .then((value) => {
    console.log('TEST', value);
  });
