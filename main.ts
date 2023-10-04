import fs from 'fs'
import { Logger } from 'winston';

import { Settings } from './settings';
import Swapper from './protocols/Swapper';
import Withdrawal from './protocols/Withdrawal';
import NFTModule from './protocols/NFTModule';
import Dmail from './protocols/Dmail';
import Helper from './utils/Helper';
import { createLoggerInstance} from './utils/logger';
import StarknetAccount from './protocols/StarknetAccount';
import Bridges from './protocols/Bridges';


const loadWallets = async () => {
    try {
        const mmKeys = fs.readFileSync('./data/mm_keys.txt', "utf8")
            .split("\n")
            .map(row => row.trim())
            .filter(row => row !== "");
  
        const starkKeys = fs.readFileSync('./data/stark_keys.txt', "utf-8")
            .split("\n")
            .map(row => row.trim())
            .filter(row => row !== "");

        const okxWallets = fs.readFileSync('./data/okx_addresses.txt', "utf-8")
            .split("\n")
            .map(row => row.trim())
            .filter(row => row !== "");

        const walletDict: { [key: string]: string[] } = {};

        for (let i = 0; i < starkKeys.length; i++) {
            const key = starkKeys[i];
            const value = [mmKeys[i], okxWallets[i]];
            walletDict[key] = value;
        }
  
        return { starkKeys, walletDict };
    } catch (err) {
        console.error(`Error while loading wallet data: ${err}`);
        throw err;
    }
};


async function workerFunction(index: number, starkKeys: string[], walletDict: Record<string, string[]>, logger: Logger) {
    for (const funcName of Helper.shuffleArray(Settings.modules)) {
        try {
            switch (funcName) {
                case 'swapper':
                    await new Swapper(logger, starkKeys[index]).execute();
                    break;
                case 'dmail':
                    await new Dmail(logger, starkKeys[index]).execute();
                    break;
                case 'starkVerse':
                    await new NFTModule(logger, starkKeys[index]).mintStarkVerse();
                    break;
                case 'starknetId':
                    await new NFTModule(logger, starkKeys[index]).mintStarknetId();
                    break;
                case 'starkgate':
                    await new Bridges(logger, starkKeys[index], walletDict[starkKeys[index]][0]).starkgate();
                    break;
                case 'orbiter':
                    await new Bridges(logger, starkKeys[index], walletDict[starkKeys[index]][0]).orbiter();
                    break;
                case 'withdraw':
                    await new Withdrawal(logger, starkKeys[index], walletDict[starkKeys[index]][1]).withdraw();
                    break;
                case 'allToETH':
                    await new Swapper(logger, starkKeys[index]).allToETH();
                    break;
                case 'deployer':
                    await new StarknetAccount(logger, starkKeys[index]).deploy();
                    break;
                case 'upgrade':
                    await new StarknetAccount(logger, starkKeys[index]).upgrade();
                    break;
                case 'generator':
                    await Helper.generator(Settings.generateCount);
                    break;
                default:
                    console.error(`Undefined function name: ${funcName}`);
            }
            await Helper.sleep();
        } catch (err) {
            logger.error(err);
        }
    }
}


const tasksQueue: (() => Promise<void>)[] = [];

function workerTask() {
    if (tasksQueue.length > 0) {
      const task = tasksQueue.shift();
      if (task) {
        task().then(() => {
          workerTask();
        });
      }
    }
}

function addTaskToQueue(task: () => Promise<void>) {
    tasksQueue.push(task);
    if (tasksQueue.length <= Settings.maxWorkers) {
        workerTask();
    }
}

function exampleTask(index: number, starkKeys: string[], walletDict: Record<string, string[]>, logger: Logger) {
    return new Promise<void>((resolve) => {
        workerFunction(index, starkKeys, walletDict, logger);
        setTimeout(() => {
            resolve();
        }, Helper.randomInt(Settings.sleep[0]*1000, Settings.sleep[0]*1000)); 
    });
}


const main = async () => {
    const values = await loadWallets();
    let starkKeys = values.starkKeys;
    const walletDict = values.walletDict;

    if (Settings.shuffle) {
        starkKeys = Helper.shuffleArray(starkKeys);
    }

    const logger = createLoggerInstance();

    for (let i = 0; i < starkKeys.length; i++) {
        // addTaskToQueue(() => exampleTask(i, starkKeys, walletDict, logger));

        await workerFunction(i, starkKeys, walletDict, logger);
    }
    
};

main().catch(console.error);
  