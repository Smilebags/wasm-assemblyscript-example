import "allocator/arena";

// declare function sayHello(): void;

// sayHello();

export function add(x: i32, y: i32): i32 {
  return x + y;
}

export function power(base: i32, exponent: i32): i32 {
  return (base ** exponent) as i32;
}

class MemoItem {
  count: i32;
  result: i32;
}

let fibMemo: MemoItem[] = [];

function memoExists(count: i32): i32 {
  for (let i = 0; i < fibMemo.length; i++) {
    let element: MemoItem = fibMemo[i];
    if(element.count === count) {
      return element.result;
    }
  }
  return -1;
}
export function fib(count: i32): i32 {
  if(count === 1 || count === 2) {
    return 1;
  } else {
    let memoEntry: i32 = memoExists(count);
    if(memoEntry !== -1) {
      return memoEntry;
    } else {
      let result: i32 = fib(count-1) + fib(count - 2);
      fibMemo.push({count, result});
      return result;
    }
  }
}

export function fastFib(count: i32): f64 {
  if(count === 1 || count === 2) {
    return 1;
  } else {
    let a: f64 = 1;
    let b: f64 = 1;
    for (let i = 3; i <= count; i++) {
      let temp: f64 = a + b;
      b = a;
      a = temp;
    }
    return a;
  }
}
