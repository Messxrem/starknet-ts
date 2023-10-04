import { Provider, InvokeFunctionResponse, Account, Contract, ec, hash, CallData, constants, BigNumberish } from 'starknet';
import { JsonRpcProvider, formatUnits } from 'ethers';
import { Logger } from 'winston';

import { abiERC20 } from '../utils/config';
import Helper from '../utils/Helper';
import { Settings } from '../settings';


export default class StarknetAccount {

    key: string;
    logger: Logger;
    provider: Provider;
    address: string;
    account: Account;

    constructor(logger: Logger, starkKey: string) {
        this.key = starkKey;

        this.logger = logger;
        
        this.provider = new Provider({ sequencer: { network: constants.NetworkName.SN_MAIN } });

        this.address = Helper.getArgentAddress(starkKey);
        
        this.account = new Account(this.provider, this.address, starkKey, '1');
    }

    async approve(spender: string, token: string, amount: bigint) {
        return {
            contractAddress: token,
            entrypoint: "approve",
            calldata: CallData.compile({
                spender: spender,
                amount: {low: amount, high: 0n},
            })
        }
    }

    async getTokenBalance(tokenAddress: string): Promise<BigNumberish> {
        const contract = new Contract(abiERC20, tokenAddress, this.provider);
        
        const balanceInitial = await contract.balanceOf(this.address)
        
        return balanceInitial.balance.low
    }

    async txConfirmation(txData: InvokeFunctionResponse, moduleName: string) {
        let i = 0;
        let status = false;
        while (i < 3 && !status) {
            try {
                const txReciept = await this.provider.waitForTransaction(txData.transaction_hash);

                if (txReciept.status === 'ACCEPTED_ON_L2') {
                    this.logger.warn(`\x1b[32m${this.address} | ${moduleName} | Success: https://starkscan.co/tx/${txData.transaction_hash}\x1b[0m`);
                    status = true;
                } else {
                    this.logger.error(`\x1b[31m${this.address} | ${moduleName} | Tx Error | Try num: ${i}\x1b[0m`);
                    i++;
                }
            } catch (err) {
                this.logger.error(`\x1b[31m${this.address} | ${moduleName} | Tx Error | Try num: ${i}\x1b[0m`);
                i++;
            }
        }
    }

    async deploy() {
        const publicKey = ec.starkCurve.getStarkKey(this.key);

        const constructorCallData = CallData.compile({
            implementation: '0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2',
            selector: hash.getSelectorFromName("initialize"),
            calldata: CallData.compile({ signer: publicKey, guardian: "0" }),
        });

        const txPayload = {
            classHash: '0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918',
            constructorCalldata: constructorCallData,
            contractAddress: this.address,
            addressSalt: publicKey 
        };

        const txData = await this.account.deployAccount(txPayload);

        await this.txConfirmation(txData, 'Deploy');
    }

    async upgrade() {
        try {
            const implementation = await this.provider.getClassHashAt(this.address);

            if (implementation !== '0x1a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003') {
                const txPayload = [{
                    contractAddress: this.address,
                    entrypoint: 'upgrade',
                    calldata: CallData.compile({
                        implementation: '0x1a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003',
                        calldata: ['0'],
                    })
                }];

                const executeHash = await this.account.execute(txPayload);
                await this.txConfirmation(executeHash, 'Upgrade');

            } else {
                console.log(`Wallet has already been upgraded | ${this.address}`);
                return null;
            }

        } catch (error) {
            console.log('An error occurred', error);
        }
     }

     async waitGas() {
        const provider = new JsonRpcProvider('https://eth.llamarpc.com');
        while (true) {
            const latestBlock = await provider.getBlock('latest');
            if (latestBlock !== null) {
                let baseFee = latestBlock.baseFeePerGas;

                if (baseFee !== null) {
                    let current_gas = parseFloat(formatUnits(baseFee, 'gwei'));
                    if (current_gas >= Settings.maxGwei) {
                        this.logger.info(`Gas is high, waiting for 1 min.... current ${current_gas} | max ${Settings.maxGwei}`);
                        await new Promise(resolve => setTimeout(resolve, 60000));
                    } else {
                        return true;
                    }
                } else {
                    console.log(`Failed to retrieve gwei.`)
                }

            } else {
                console.log(`Failed to retrieve gwei.`);
            }

        }
     }

}