import fs from 'fs'
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { HDNodeWallet, Wallet } from 'ethers';
import { ec, CallData, hash, } from 'starknet';

import { Settings } from "../settings";


export default class Helper {

    static shuffleArray<T>(array: T[]): T[] {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

    static randomChoice<T>(array: T[]): T {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static sleep(): Promise<void> {
        const ms = Helper.randomInt(Settings.sleep[0]*1000, Settings.sleep[0]*1000);
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static getPrivateKey(mnemonic: string) {
        try {
            const signer = (Wallet.fromPhrase(mnemonic)).privateKey;
            const masterNode = HDNodeWallet.fromSeed(this.toHexString(signer));
            const childNode = masterNode.derivePath("m/44'/9004'/0'/0/0");
        
            return '0x' + ec.starkCurve.grindKey(childNode.privateKey).toString();
        } catch (err) {
            console.log(`\x1b[31m${err}\x1b[0m`);
            return '';
        }
    }
    
    static toHexString = (value: string) => {
        let hex = BigInt(value).toString(16);
        if (hex.length % 2 !== 0) {
            hex = '0' + hex;
        }
        return '0x' + hex;
    };

    static getArgentAddress(key: string) {
        const argentXproxyClassHash = "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
        const argentXaccountClassHash = "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

        const StarkpublicKey = ec.starkCurve.getStarkKey(key);

        const ConstructorCallData = CallData.compile({
            implementation: argentXaccountClassHash,
            selector: hash.getSelectorFromName("initialize"),
            calldata: CallData.compile({ signer: StarkpublicKey, guardian: "0" }),
        });

        return hash.calculateContractAddressFromHash(
            StarkpublicKey,
            argentXproxyClassHash,
            ConstructorCallData,
            0
        );
    }

    static async generator(counter: number) {

        const stream = fs.createWriteStream('./data/generated.csv', {flags: 'a'});
    
        for (let i = 0; i<counter;i++){
            const mnemonic = generateMnemonic(wordlist, 128);
            const privateKey = Helper.getPrivateKey(mnemonic);
            const address = Helper.getArgentAddress(privateKey);
    
            stream.write(`${address},${mnemonic},${privateKey}\n`);
        }
    
        stream.end();
        console.log('Data Saved successfully to generated.csv');
        
    }

}