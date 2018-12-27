// WebAssembly.instantiateStreaming(fetch("../out/main.wasm"), {
//   main: {
//     sayHello: () => {
//       console.log("Hello from WebAssembly!");
//     }
//   },
//   env: {
//     abort: (msg, file, line, column) => {
//       console.error("abort called at main.ts:" + line + ":" + column);
//     }
//   },
// }).then(result => {
//   // this is where result.instance.exports is equal to the exported WASM functions
//   const { add, power } = result.instance.exports;
//   document.getElementById("add").textContent = "Result: " + add(19, 23);
//   document.getElementById("add").textContent = "Result: " + power(2, 8);
// }).catch(console.error);

/**
 * returns the exports from a wasm module after compiling and extracting the exports
 * @param moduleUrl Path to the wasm module file
 * @param imports an object of functions to import into the WASM module
 */
async function getWasmModule(moduleUrl, imports) {
  let env = {
    abort: (msg, file, line, column) => {
    }
  };
  return new Promise((resolve, reject) => {
    WebAssembly.instantiateStreaming(fetch("/out/main.wasm"), {main: imports, env }).then((result) => {
      let exportObj = {};
      Object.keys(result.instance.exports).forEach((key) => {
        console.log(`Attaching ${key} to export`);
        exportObj[key] = result.instance.exports[key];
      });
      resolve(exportObj);
    });
  });
}



(async function(){
  // let imports = {
  //   sayHello: () => {
  //     console.log("Hello from WebAssembly!");
  //   }
  // };
  let {add, power, fib: wasmFib, fastFib: wasmFastFib} = await getWasmModule("../out/main.wasm", {});
  for (let i = 1000000; i <= 1000005; i++) {
    perfCompare(
      () => console.log(wasmFastFib(i)),
      () => console.log(jsFastFib(i)),
      `wa-${i}`,
      `js-${i}`,
    );
  };
    
})();


function jsFib(count) {
  if(count === 1) {
    return 1;
  } else if(count === 2) {
    return 2;
  } else {
    return jsFib(count-1) + jsFib(count - 2);
  }
}

let jsMemo = [];

function memoExists(count) {
  for (let i = 0; i < jsMemo.length; i++) {
    let element = jsMemo[i];
    if(element.count === count) {
      return element.result;
    }
  }
  return -1;
}

function memoJsFib(count) {
  if(count === 1) {
    return 1;
  } else if(count === 2) {
    return 2;
  } else {
    let memoEntry = memoExists(count);
    if(memoEntry !== -1) {
      return memoEntry;
    } else {
      let result = memoJsFib(count-1) + memoJsFib(count - 2);
      jsMemo.push({count, result});
      return result;
    }
  }
}

function jsFastFib(count) {
  if(count === 1 || count === 2) {
    return 1;
  } else {
    let a = 1;
    let b = 1;
    for (let i = 3; i <= count; i++) {
      let temp = a + b;
      b = a;
      a = temp;
    }
    return a;
  }
}

function perfCompare(f1, f2, f1Name = "Function 1", f2Name = "Function 2") {
  console.time(f1Name);
  f1();
  console.timeLog(f1Name);  
  console.time(f2Name);
  f2();
  console.timeLog(f2Name);
}