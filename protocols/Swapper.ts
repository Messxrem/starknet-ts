import {CallData, Contract, uint256} from 'starknet';

import { abi10KSwap, tokenAddresses, tokensArray, protocols, poolIds, TokensData, jediSwapPoolAddresses } from '../utils/config';
import StarknetAccount from "./StarknetAccount";
import Helper from "../utils/Helper";
import { Settings } from '../settings';


export default class Swapper extends StarknetAccount {

    async execute() {
        const txCount = Helper.randomInt(Settings.txCount[0], Settings.txCount[1]);

        for (let i = 0; i < txCount; i++) {
            const module = Helper.randomChoice(Settings.swapModules);
            const tokensData = await this.getTokensData();

            await this.swap(tokensData, protocols[module].address, protocols[module].entrypoint, module)

            await Helper.sleep();

        }
    }

    async allToETH() {
        for (const tokenAddress of tokensArray) {

            const balance = await this.getTokenBalance(tokenAddress);

            if (Number(balance) > 0) {
                const module = Helper.randomChoice(Settings.modules);
                const tokensData = {path: [tokenAddress, tokenAddresses.ETH], poolId: poolIds[tokenAddress], jediSwapPoolAddress: jediSwapPoolAddresses[tokenAddress]};
                await this.swap(tokensData, protocols[module].address, protocols[module].entrypoint, module);

            }
        }
    }

    async swap(tokensData: TokensData, contractAddress: string, entrypoint: string, moduleName: string) {
        let i = 0;
        let status = false;
        while (i < 1 && !status) {
            try {
                const swapContract = new Contract(abi10KSwap, protocols['_10KSwap'].address, this.provider);

                let amountIn = await this.getTokenBalance(tokensData.path[0]);
                if (tokensData.path[0] == tokenAddresses.ETH) {
                    amountIn = Math.floor(Number(amountIn) / 100 * Helper.randomInt(Settings.swapPercentage[0], Settings.swapPercentage[1]));
                }

                let amountOutMin: bigint = BigInt(0)
                if (moduleName == 'Protoss') {

                } else {
                    const res = await swapContract.getAmountsOut(uint256.bnToUint256(amountIn), tokensData.path)
                    const amountOutInitial = BigInt(res.amounts[1].low);
                    amountOutMin = (amountOutInitial * BigInt(995)) / BigInt(1000);
                }

                const deadline = Math.floor(Date.now() / 1000) + 60 * 60;

                this.logger.info(`${this.address} | ${moduleName} | Waiting for swap... `);

                const callData = await this.getCallData(moduleName, BigInt(amountIn), amountOutMin, tokensData, deadline);

                await this.waitGas();
                const result = await this.account.execute(
                 [
                     await this.approve(contractAddress, tokensData.path[0],  BigInt(amountIn)),
                     {
                         contractAddress: contractAddress,
                         entrypoint: entrypoint,
                         calldata: callData
                    }
                    ]
                );
                    
                await this.txConfirmation(result, moduleName);
                status = true;
            } catch (err) {
                this.logger.error(`\x1b[31m${this.address} | ${moduleName} Error | Try num: ${i+1} | ${err}\x1b[0m`);
                i++;
            }
        }
    }

    async getCallData(moduleName: string, amountIn: bigint, amountOutMin: bigint, tokensData: TokensData, deadline: number) {
        switch (moduleName) {
            case '_10KSwap':
            case 'JediSwap':
            case 'Protoss':

                return  CallData.compile({
                    amountIn: {low: amountIn, high: '0'},
                    amountOutMin: {low: amountOutMin, high: '0'},
                    path: tokensData.path,
                    to: this.address,
                    deadline: deadline
                });

            case 'SithSwap':

                return CallData.compile({
                    amountIn: {low: amountIn, high: '0'},
                    amountOutMin: {low: amountOutMin, high: '0'},
                    routes: [{from_address: tokensData.path[0], to_address: tokensData.path[1], stable: 0}],
                    to: this.address,
                    deadline: deadline
                });

            case 'MySwap':

                return CallData.compile( {
                    pool_id: tokensData.poolId, 
                    token_from_addr: tokensData.path[0],
                    amount_from: {low: amountIn, high: '0'},
                    amount_to_min: {low: amountOutMin, high: '0'}
                });
            
            case 'Avnu':

                return CallData.compile( {
                    token_from_address: tokensData.path[0],
                    token_from_amount: {low: amountIn, high: '0'},
                    token_to_address: tokensData.path[1],
                    token_to_amount: {low: amountOutMin + BigInt(Math.round(Number(amountOutMin)*0.985)), high: '0'},
                    token_to_min_amount: {low: amountOutMin, high: '0'},
                    beneficiary: this.address,
                    integrator_fee_amount_bps: '0',
                    integrator_fee_recipient: '0',
                    routes: [
                        {
                            token_from: tokensData.path[0],
                            token_to: tokensData.path[1],
                            exchange_address: protocols['SithSwap'].address,
                            percent: 100,
                            additional_swap_params: [0]
                        }
                    ]
                });

            case 'Fibrous':

                return CallData.compile({
                    swaps: [
                        {
                            token_in: tokensData.path[0],
                            token_out: tokensData.path[1],
                            rate: 1000000,
                            protocol: '0x2',
                            pool_address: tokensData.jediSwapPoolAddress
                        }],
                    params:
                        {
                            token_in: tokensData.path[0],
                            token_out: tokensData.path[1],
                            amount: {low: amountIn, high: '0'},
                            min_received: {low: amountOutMin, high: '0'},
                            destination: this.address
                        },
                });
        }
    }

    async getTokensData(): Promise<TokensData> {
        for (const tokenAddress of tokensArray) {
            const balance = await this.getTokenBalance(tokenAddress);
            if (Number(balance) > 0) {
                return {path: [tokenAddress, tokenAddresses.ETH], poolId: poolIds[tokenAddress], jediSwapPoolAddress: jediSwapPoolAddresses[tokenAddress]};
            }
        }
        
        const tokenToAddress = Helper.randomChoice(tokensArray);
        return {path: [tokenAddresses.ETH, tokenToAddress], poolId: poolIds[tokenToAddress], jediSwapPoolAddress: jediSwapPoolAddresses[tokenToAddress]};
    }

}