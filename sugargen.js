var ecc = require('tiny-secp256k1')
const { ECPairFactory } = require("ecpair")
const { writeFileSync, readFileSync } = require("fs")
var bitcoin = require("bitcoinjs-lib")
const ECPair = ECPairFactory(ecc);

function getAddress(keys) {
    var address = undefined
    address = bitcoin.payments.p2wpkh({
        'pubkey': keys.publicKey,
        'network': { 'messagePrefix': '\x19Sugarchain Signed Message:\n', 'bip32': { 'public': 0x0488b21e, 'private': 0x0488ade4 }, 'bech32': 'sugar', 'pubKeyHash': 0x3F, 'scriptHash': 0x7D, 'wif': 0x80 }
    }).address

    return address
}

function generate_wallet() {
    if (process.argv[2] == undefined) {
         console.log("Usage: node homemade.js [prefix/-pf {prefix file}] [option]")
         console.log("Options:")
         console.log("-k: keep looking after finding")
         console.log("-s: save address's private and public key in a file with the name of the address")
    } else {
        if (process.argv[2] == "-pf") {
            prefixes = readFileSync(process.argv[3], "utf-8").split("\r\n")
            while (true) {
                var keys = ECPair.makeRandom({'network': { 'messagePrefix': '\x19Sugarchain Signed Message:\n', 'bip32': { 'public': 0x0488b21e, 'private': 0x0488ade4 }, 'bech32': 'sugar', 'pubKeyHash': 0x3F, 'scriptHash': 0x7D, 'wif': 0x80 }})
                var address = getAddress(keys)
                for (i = 0; i < prefixes.length; i++) {
                    if (address.includes(prefixes[i])) {
                        console.log(prefixes[i])
                        pubkey = keys.publicKey.toString('hex')
                        privkey = keys.toWIF()
                        console.log("Address:", address)
                        console.log("Public key:", pubkey)
                        console.log("Private key:", privkey + "\n")
                        if (process.argv.includes("-s")) {
                            writeFileSync("" + address + ".txt", [pubkey, privkey].join("\r\n"))
                        }
                        if (!process.argv.includes("-k"))
                        break
                    } else {
                        continue
                    }
                }
            }
        } else {
            var prefix = process.argv[2]
            while (true) {
                var keys = ECPair.makeRandom({'network': { 'messagePrefix': '\x19Sugarchain Signed Message:\n', 'bip32': { 'public': 0x0488b21e, 'private': 0x0488ade4 }, 'bech32': 'sugar', 'pubKeyHash': 0x3F, 'scriptHash': 0x7D, 'wif': 0x80 }})
                var address = getAddress(keys)
                if (address.includes(prefix)) {
                    pubkey = keys.publicKey.toString('hex')
                    privkey = keys.toWIF()
                    console.log("Address:", address)
                    console.log("Public key:", pubkey)
                    console.log("Private key:", privkey + "\n")
                    if (process.argv.includes("-s")) {
                        writeFileSync("" + address + ".txt", [pubkey, privkey].join("\r\n"))
                    }
                    if (!process.argv.includes("-k")) break
                } else {
                    continue
                }
            }  
        }
    }
}

generate_wallet()
