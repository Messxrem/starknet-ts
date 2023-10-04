import { CallData, Contract, uint256 } from "starknet";

import StarknetAccount from "./StarknetAccount";
import Helper from "../utils/Helper";
import {Settings} from "../settings";
import { abi10KSwap, protocols } from '../utils/config';

export default class LPModule extends StarknetAccount {

    getCallData(moduleName: string, src: string, dst: string, amountIn: bigint, amountOut: bigint, amountInMin: bigint, amountOutMin: bigint): any{
        switch(moduleName) {
    case "10KSwap":
    case "JediSwap":
        return CallData.compile({
            tokenA: src,
            tokenB: dst,
            amountADesired: {low: amountIn, high: 0n},
            amountBDesired: {low: amountOut, high: 0n},
            amountAMin: {low: amountInMin, high: 0n},
            amountBMin: {low: amountOutMin, high: 0n},
            to: this.address,
            deadline: Math.floor(Date.now() / 1000) + (60 * 60)
        });

    case 'SithSwap':
        return CallData.compile({
            token_a: src,
            token_b: dst,
            stable: '0',
            amount_a_desired: {low: amountIn, high: 0n},
            amount_b_desired: {low: amountOut, high: 0n},
            amount_a_min: {low: amountInMin, high: 0n},
            amount_b_min: {low: amountOutMin, high: 0n},
            to: this.address,
            deadline: Math.floor(Date.now() / 1000) + (60 * 60)
        });

    case 'MySwap':
        return CallData.compile({
            a_address: src,
            a_amount: {low: amountIn, high: 0n},
            a_min_amount: {low: amountOut, high: 0n},
            b_address: dst,
            b_amount: {low: amountInMin, high: 0n},
            b_min_amount: {low: amountOutMin, high: 0n},
        });
    }
}



    async execute() {
        try {
            const moduleName = Settings.module_lp;
            const router = protocols[moduleName].address;
            // const src = tokenAddresses[Settings.poolForAddLP[0]];
            // const dst = Settings.poolForAddLP[1];
            const addLpContract = new Contract(abi10KSwap, protocols['_10KSwap'].address, this.provider);

            const src = '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
            const dst = '0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8';

            let amountIn = await this.getTokenBalance(src)
            amountIn = Math.floor(Number(amountIn) / 100 * Helper.randomInt(Settings.lpPercentage[0], Settings.lpPercentage[1]));

            const res = await addLpContract.getAmountsOut(uint256.bnToUint256(amountIn), [src, dst])

            amountIn  = BigInt(res.amounts[0].low);
            const amountInMin = (amountIn * BigInt(995)) / BigInt(1000);
            const amountOut = BigInt(res.amounts[1].low);
            const amountOutMin = (amountOut * BigInt(995)) / BigInt(1000);

            await this.waitGas();

            const result = await this.account.execute(
                [
                    await this.approve(router, src, amountIn),
                    await this.approve(router, dst, amountOut),
                    {
                        contractAddress: router,
                        entrypoint: 'add_liquidity',
                        calldata: this.getCallData(moduleName, src, dst, amountIn, amountOut, amountInMin, amountOutMin)
                    }
                    ]
            );
            await this.txConfirmation(result, 'Add LP');
            await Helper.sleep();
        } catch (err) {
            console.log(err);
        }
    }

}