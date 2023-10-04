import StarknetAccount from "./StarknetAccount";
import { orbiterBridgesAddresses, protocols, tokenAddresses } from '../utils/config';
import Helper from '../utils/Helper';
import { Settings } from "../settings";
import { Web3 } from 'web3';
import {CallData} from "starknet";
import {Logger} from "winston";


export default class Bridges extends StarknetAccount {

    mmKey: string;

    constructor(logger: Logger, starkKey: string, mmKey: string) {
        super(logger, starkKey);
        this.mmKey = mmKey;
    }

    async orbiter() {
        try {
            await this.waitGas();

            const amount = BigInt(Helper.randomInt(Settings.bridgeAmount[0], Settings.bridgeAmount[1]) * 10 ** 18);

            const web3 = new Web3(new Web3.providers.HttpProvider('https://eth.llamarpc.com'));
            const mmAdress = web3.eth.accounts.privateKeyToAccount(this.mmKey);
            const result = await this.account.execute(
                {
                    contractAddress: protocols['Orbiter'].address,
                    entrypoint: protocols['Orbiter'].entrypoint,
                    calldata:  CallData.compile({
                        _token: tokenAddresses.ETH,
                        _to: Helper.randomChoice(orbiterBridgesAddresses),
                        _amount: {low: BigInt(amount), high: '0'},
                        _ext: mmAdress,
                    })
                }
            );

            await this.txConfirmation(result, 'Orbiter bridge');
        } catch (err) {
            console.log(err);
        }
    }

    async starkgate() {
        try {
            await this.waitGas();

            const amount = BigInt(Helper.randomInt(Settings.bridgeAmount[0], Settings.bridgeAmount[1]) * 10 ** 18);
            const web3 = new Web3(new Web3.providers.HttpProvider('https://eth.llamarpc.com'));
            const mmAdress = web3.eth.accounts.privateKeyToAccount(this.mmKey);

            const result = await this.account.execute(
                {
                    contractAddress: protocols['Starkgate'].address,
                    entrypoint: protocols['Starkgate'].entrypoint,
                    calldata: CallData.compile({
                        _l1_recipient: mmAdress,
                        _amount: {low: amount, high: 0},
                    })
                }
            );

            await this.txConfirmation(result, 'StarkNet bridge');
        } catch (err) {
            console.log(err);
        }
    }

}
