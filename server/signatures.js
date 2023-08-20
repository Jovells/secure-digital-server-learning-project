import {utf8ToBytes, toHex, hexToBytes} from 'ethereum-cryptography/utils'
import {secp256k1 as secp} from "ethereum-cryptography/secp256k1"
import {keccak256} from "ethereum-cryptography/keccak"

// const privateKey = secp.utils.randomPrivateKey()

// console.log("privateKey: ", toHex(privateKey))


function hashMsg(msg) {
  const _bytes = utf8ToBytes(msg)
  const _hash = keccak256(_bytes)
  const _inHex = toHex(_hash)
  return _inHex
}


export const sign = (msg, privateKey) => {
    function replacer(_, value) {
        // Filtering out properties
        if (typeof value === "bigint") {
          return String(value);
        }
        return value;}
      
  return JSON.stringify(secp.sign(hashMsg(msg), privateKey), replacer)
}

// console.log("hash: ", hashMsg(msg))

// console.log("signed msg: ", signed)

// msg
// signed msg


// console.log('recovered public key: ', rPublicKey)
export const verify = (msg, signature) => {


    try { 
        const hashed_msg = hashMsg(msg)
        const jsonSignature = JSON.parse(signature)
        const secpSignature = new secp.Signature(BigInt(jsonSignature.r), BigInt(jsonSignature.s), jsonSignature.recovery);
        const rPublicKey = secpSignature.recoverPublicKey(hashed_msg).toHex()
        // const address = getAddress(rPublicKey)
        const isVerified = secp.verify(secpSignature, hashed_msg, rPublicKey)
        return {address, isVerified}
        
    } catch (error) {
        console.log('e',error)
    }
}

function getAddress(pk) {
    // create an ethereum address
    
    /*
    
    - First step, you'll need to take the first byte off the public key. The first byte indicates the format of the key, whether it is in the compressed format or not. The publicKey will be a Uint8Array so you can use the slice method to slice off the first byte.
    
    - Next, take the keccak hash of the rest of the public key.
    
    - Finally, take the last 20 bytes of the keccak hash and return this. Once again, you can make use of the slice method.
    */
    // the first byte indicates whether this is in compressed form or not
const publicKey = new Uint8Array(Buffer.from(pk, 'hex'));

// Step 1: Slice off the first byte
const slicedPublicKey = publicKey.slice(1);

// Step 2: Take the keccak hash of the rest of the public key
const hash = keccak256(slicedPublicKey);

// Step 3: Take the last 20 bytes of the keccak hash and return this
// const address = hash;

const hexAddress = toHex(hash).slice(-20);  
console.log(hexAddress);

    return hexAddress;
}
 
// check the signer's balance
// are they registered