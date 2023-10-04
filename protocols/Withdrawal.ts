import { CallData, AllowArray, Call } from 'starknet';
import { Logger } from 'winston';

import StarknetAccount from "./StarknetAccount";
import { Settings } from '../settings';
import { tokenAddresses } from '../utils/config';


export default class Withdrawal extends StarknetAccount {

    okxWallet: string;
    
    constructor(logger: Logger, starkKey: string, okxWallet: string) {
        super(logger, starkKey);
        
        this.okxWallet = okxWallet;
    }


    async withdraw() {
        let i = 0;
        let status = false;
        while (i < 3 && !status) {
            try {
                const valueToWithdrawal = BigInt(Settings.withdrawAmount * 10 ** 18);
            
                this.logger.info(`${this.address} | Waiting for withdraw... `);

                const result = await this.account.execute({
                    contractAddress : tokenAddresses.ETH, 
                    entrypoint: "transfer", 
                    calldata: CallData.compile({
                        recipient: this.okxWallet,
                        amount: {low: valueToWithdrawal, high: 0},
                    })
                });

                await this.txConfirmation(result, 'Withdraw');
            } catch (err) {
                this.logger.error(`\x1b[31m${this.address} | Withdraw Error | Try num: ${i+1} | ${err}\x1b[0m`);
                i++;
            }
        }
    }
}