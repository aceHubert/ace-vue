/*
 * https://github.com/vuejs/composition-api/blob/master/test/helpers/wait-for-update.js
 */
import Vue from 'vue';

declare global {
  interface Window {
    waitForUpdate(initialCb: Callback): WaitForUpdateReturn;
  }
}

interface Callback {
  (shift?: any): any;
  wait?: boolean;
  fail?(e: Error): void;
}

interface WaitForUpdateReturn {
  then(cbNext: Callback): WaitForUpdateReturn;
  thenWaitFor(wait: any): WaitForUpdateReturn;
  end(endFu: Callback): void;
}

// helper for async assertions.
// Use like this:
//
// vm.a = 123
// waitForUpdate(() => {
//   expect(vm.$el.textContent).toBe('123')
//   vm.a = 234
// })
// .then(() => {
//   // more assertions...
// })
// .then(done)
window.waitForUpdate = initialCb => {
  let end: Callback;
  const queue = initialCb ? [initialCb] : [];

  function shift() {
    const job = queue.shift();
    if (queue.length) {
      const _job = job!;
      let hasError = false;
      try {
        _job.wait ? _job(shift) : _job();
      } catch (e) {
        hasError = true;
        const done = queue[queue.length - 1];
        if (done && done.fail) {
          done.fail(e);
        }
      }
      if (!hasError && !job!.wait) {
        if (queue.length) {
          Vue.nextTick(shift);
        }
      }
    } else if (job && (job.fail || job === end)) {
      job(); // done
    }
  }

  Vue.nextTick(() => {
    if (!queue.length || (!end && !queue[queue.length - 1].fail)) {
      console.log(JSON.stringify(queue));
      throw new Error('waitForUpdate chain is missing .then(done)');
    }
    shift();
  });

  const chainer = {
    then: (nextCb: Callback) => {
      queue.push(nextCb);
      return chainer;
    },
    thenWaitFor: (wait: any) => {
      if (typeof wait === 'number') {
        wait = timeout(wait);
      }
      wait.wait = true;
      queue.push(wait);
      return chainer;
    },
    end: (endFn: Callback) => {
      queue.push(endFn);
      end = endFn;
    },
  };

  return chainer;
};

function timeout(n: number) {
  return (next: () => any) => setTimeout(next, n);
}
