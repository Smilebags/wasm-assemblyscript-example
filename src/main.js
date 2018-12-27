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
 * @param moduleUrl: Path to the wasm module file
 * @param imports: an object of functions to import into the WASM module
 */
async function getWasmModule(moduleUrl, imports) {
  let env = {
    abort: (msg, file, line, column) => {
      console.error("abort called at main.ts:" + line + ":" + column);
    }
  };
  return new Promise((resolve, reject) => {
    WebAssembly.instantiateStreaming(fetch("../out/main.wasm"), {main: imports, env }).then((result) => {
      let exportObj = {};
      Object.keys(result.instance.exports).forEach((key) => {
        exportObj[key] = result.instance.exports[key];
      });
      resolve(exportObj);
    });
  });
}

(async function(){
  let imports = {
    sayHello: () => {
      console.log("Hello from WebAssembly!");
    }
  };
  let {add, power} = await getWasmModule("../out/main.wasm", imports);
  document.getElementById("add").textContent = "Result: " + add(19, 23);
  document.getElementById("power").textContent = "Result: " + power(2, 8);
})();