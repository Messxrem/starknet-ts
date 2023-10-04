import { CallData } from 'starknet';
import crypto from "crypto";

import StarknetAccount from "./StarknetAccount";
import { protocols } from '../utils/config';
import Helper from '../utils/Helper';
import { Settings } from '../settings';


export default class Dmail extends StarknetAccount {

    async execute() {
        const txCount = Helper.randomInt(Settings.dmailTxCount[0], Settings.dmailTxCount[1]);

        for (let i = 0; i < txCount; i++) {

            let i = 0;
            let status = false;
            while (i < 3 && !status) {
                try {
                    await this.waitGas();
                    
                    this.logger.info(`${this.address} | Waiting for Dmail... `);

                    const emailToSend = this.getRandomEmail();

                    let emailToSendHas = this.hashString(emailToSend)
                    let emailToSendEncoded =  ((this.encoder(`${emailToSendHas}`))).substring(0, 65)

                    let NewAddress = `${this.removeLeadingZeroes(this.address)}@dmail.ai`;
                    let NewAddressHash = this.hashString(NewAddress);
                    let NewAddressEncoded = ((this.encoder(`${NewAddressHash}`))).substring(0, 65);

                    const result = await this.account.execute(
                        {
                            contractAddress: protocols['Dmail'].address,
                            entrypoint: protocols['Dmail'].entrypoint,
                            calldata: CallData.compile({
                                NewAddressEncoded,
                                emailToSendEncoded
                            })
                        }
                    );

                    await this.txConfirmation(result, 'Dmail');
                    status = true;
                } catch (err) {
                    this.logger.error(`\x1b[31m${this.address} | Dmail Error | Try num: ${i+1} | ${err}\x1b[0m`);
                    i++;
                }
            }
        }
    }

    getRandomEmail(){
        const domains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"];
        const randomDomain = domains[Math.floor(Math.random() * domains.length)];
        const randomUsername = Math.random().toString(36).substring(2, 10);

        return randomUsername + randomDomain;
    }

    hashString(someString: string) {
        return crypto.createHash('sha256').update(someString).digest('hex');
    }

    encoder(message: string) {
        if ("" === message)
            return "";
        let t = [];
        t.push("0x");
        for (let n = 0; n < message.length; n++)
            t.push(message.charCodeAt(n).toString(16));
        return t.join("")
    }

    removeLeadingZeroes(someString: string): string {
        if (someString[2] !== '0') {
            return someString;
        }
        const newStr = someString.slice(0, 2) + someString.slice(3);
        return this.removeLeadingZeroes(newStr);
    }

}