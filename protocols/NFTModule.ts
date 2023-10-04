import { generateUsername } from "unique-username-generator";
import { CallData } from 'starknet';

import StarknetAccount from "./StarknetAccount";
import { protocols } from '../utils/config';


export default class NFTModule extends StarknetAccount {

    async mintStarknetId() {
        let i = 0;
        let status = false;
        while (i < 3 && !status) {
            try {
                await this.waitGas();

                this.logger.info(`${this.address} | Waiting for mint Starknet.id ... `);

                const username = generateUsername();

                const result = await this.account.execute(
                    {
                        contractAddress: protocols['StarknetId'].address,
                        entrypoint: protocols['StarknetId'].entrypoint,
                        calldata: CallData.compile({
                            starknet_id: username
                        })
                    }
                );

                await this.txConfirmation(result, 'Mint Starknet.id');
                status = true;
            } catch (err) {
                this.logger.error(`\x1b[31m${this.address} | Starknet.id Error | Try num: ${i+1} | ${err}\x1b[0m`);
                i++;
            }
        }
    }

    async mintStarkVerse() {
        let i = 0;
        let status = false;
        while (i < 3 && !status) {
            try {
                await this.waitGas();
                
                this.logger.info(`${this.address} | Waiting for mint StarkVerse... `);

                const result = await this.account.execute(
                    {
                        contractAddress: protocols['StarkVerse'].address,
                        entrypoint: protocols['StarkVerse'].entrypoint,
                        calldata: CallData.compile({
                            to: this.address
                        })
                    }
                );

                await this.txConfirmation(result, 'Mint StarkVerse');
                status = true;
            } catch (err) {
                this.logger.error(`\x1b[31m${this.address} | StarkVerse Error | Try num: ${i+1} | ${err}\x1b[0m`);
                i++;
            }
        }
    }

}