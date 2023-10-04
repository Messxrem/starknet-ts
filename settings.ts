
export class Settings {
  
    static shuffle = true
    static maxGwei = 15
    static maxWorkers = 1
    static sleep = [100, 300]

    // swapper | lp | allToETH | starkgate | orbiter | starknetId | starkVerse | dmail | withdraw | generator | deploy | upgrade
    static modules = ['swapper', 'starknetId', 'starkVerse', 'dmail'] 

    static bridgeAmount = [0.001, 0.002]
  
    // ['_10KSwap', 'JediSwap', 'SithSwap', 'MySwap', 'Protoss', 'Avnu', 'Fibrous']
    static swapModules = ['_10KSwap', 'JediSwap', 'SithSwap', 'MySwap', 'Protoss', 'Avnu', 'Fibrous'] 
    static swapPercentage = [50, 60]
    static txCount = [6, 12]

    static module_lp = 'JediSwap'
    static poolForAddLP = ['ETH', 'USDC']
    static lpPercentage = [10, 10]

    static dmailTxCount = [1, 3]

    static withdrawAmount = 0.001

    static generateCount = 90
  
}