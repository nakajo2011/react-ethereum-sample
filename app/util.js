// see https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api
export function promisifyWeb3(web3) {
  // Pipes values from a Web3 callback.
  // List synchronous functions masquerading as values.
  let syncGetters = {
    db: [],
    eth: ["accounts", "blockNumber", "coinbase", "gasPrice", "hashrate",
      "mining", "protocolVersion", "syncing"],
    net: ["listening", "peerCount"],
    personal: ["listAccounts"],
    shh: [],
    version: ["ethereum", "network", "node", "whisper"]
  }

  Object.keys(syncGetters).forEach(function (group) {
    Object.keys(web3[group]).forEach(function (method) {
      if (syncGetters[group].indexOf(method) > -1) {
        // Skip
      } else if (typeof web3[group][method] === "function" && method.indexOf("Promise") == -1) {
        web3[group][method + "Promise"] = function () {
          let args = arguments;
          return new Promise(function (resolve, reject) {
            args[args.length] = callbackToResolve(resolve, reject)
            args.length++;
            web3[group][method].apply(web3[group], args);
          })
        }
      }
    })
  })
}

export function promisefy(func, ...args) {
  return new Promise(function (resolve, reject) {
    func(...args, callbackToResolve(resolve, reject));
  })
}

let callbackToResolve = function (resolve, reject) {
  return function (error, value) {
    if (error) {
      reject(error);
    } else {
      resolve(value);
    }
  };
};

export const delay = time => new Promise(res => setTimeout(() => res(), time));
