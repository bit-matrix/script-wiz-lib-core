// import { numberTestData } from "./data/number";
import WizData from "@script-wiz/wiz-data";
import { ecdsaVerify, hash160, hash256, secp256k1KeyGenerator, secp256k1CreatePublicKey, schnorrKeyGenerator, schnorrCreatePublicKey, secp256k1Sign, schnorrSign } from "../crypto";
import { TxData } from "../model";

// test("Crypto ripemd160 test", () => {
//   const wizData: WizData = WizData.fromHex("ffffffff");

//   const signature = ripemd160(wizData);

//   expect(signature.sigBytes).toBe(20);
//   expect(signature.toString().length).toBe(40);
//   expect(signature.toString()).toBe("1d93841f0d404ce436f63143a0f09a7a9cbf9afd");
// });

// test("Crypto sha1 test", () => {
//   const wizData: WizData = WizData.fromHex("ffffffff");

//   const signature = sha1(wizData);

//   expect(signature.sigBytes).toBe(20);
//   expect(signature.toString().length).toBe(40);
//   expect(signature.toString()).toBe("f44fe052b6bae5efcb693c23071b0f6d3a4e1955");
// });

// test("Crypto sha256 test", () => {
//   const wizData: WizData = WizData.fromHex("ffffffff");

//   const signature = sha256(wizData);

//   expect(signature.sigBytes).toBe(32);
//   expect(signature.toString().length).toBe(64);
//   expect(signature.toString()).toBe("a44ba123189855990795e3260a64b34cdae6b29bf1c941818a34cba8bbc45575");
// });

// test("Crypto hash160 test", () => {
//   const wizData: WizData = WizData.fromHex("ffffffff");

//   const signature = hash160(wizData);

//   expect(signature.sigBytes).toBe(20);
//   expect(signature.toString().length).toBe(40);
//   expect(signature.toString()).toBe("929a0fdb637870bca1f72651eba9736eed59848b");
// });

// test("Crypto hash256 test", () => {
//   const wizData: WizData = WizData.fromHex("ffffffff");

//   const signature = hash256(wizData);

//   expect(signature.sigBytes).toBe(32);
//   expect(signature.toString().length).toBe(64);
//   expect(signature.toString()).toBe("02358e9106e9c481380f7060385afec5208603a2038a0443d5826fd144d88809");
// });

// test("Crypto ecdsaVerify test", () => {
//   const signatureData: WizData = WizData.fromHex(
//     "3044022002748547ba97e986d26b48dc2093c21f04334aea4694470328d605c15971a8f302207501b30f114d1c27e5d8fa903635d9485dca60c705dbdf2a12daf795239d5e5e"
//   );
//   const messageData: WizData = WizData.fromHex("68656c6c6ff09f8c8e");
//   const publicKeyData: WizData = WizData.fromHex("02211862a1f993b4578d595c3e00b0935cd9ccc29a869cab7a680e36efc2e7b548");

//   const signature = ecdsaVerify(signatureData, messageData, publicKeyData);

//   expect(signature.number).toBe(1);
// });

// test("secp256k1 key generator", () => {
//   const uncompressedKeys = secp256k1KeyGenerator(false);
//   const compressedKeys = secp256k1KeyGenerator(true);

//   expect(uncompressedKeys.publicKey.bytes.length).toBe(65);
//   expect(uncompressedKeys.publicKey.bytes[0]).toBe(4);
//   expect(uncompressedKeys.privateKey.bytes.length).toBe(32);

//   expect(compressedKeys.publicKey.bytes.length).toBe(33);
//   expect(compressedKeys.privateKey.bytes.length).toBe(32);
// });

// test("schnorr key generator", () => {
//   const uncompressedKeys = schnorrKeyGenerator(false);
//   const compressedKeys = schnorrKeyGenerator(true);

//   expect(uncompressedKeys.publicKey.bytes.length).toBe(65);
//   expect(uncompressedKeys.publicKey.bytes[0]).toBe(4);
//   expect(uncompressedKeys.privateKey.bytes.length).toBe(32);

//   expect(compressedKeys.publicKey.bytes.length).toBe(32);
//   expect(compressedKeys.privateKey.bytes.length).toBe(32);
// });

// test("secp256k1 sign", () => {
//   const message = WizData.fromText("merhaba");
//   const privateKey = secp256k1KeyGenerator().privateKey;
//   const result = secp256k1Sign(message, privateKey);
//   console.log(result);
// });

// test("schnorr sign", () => {
//   // const message = WizData.fromHex("17d9136b9bfabe56ee84681bc9f192d076bb5981543c7cfe1cbc8b0362ac2da2");
//   const privateKey = WizData.fromHex("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
//   // const message = WizData.fromHex("e0f033ef0a55b0d94520e7b0501f4bb2f1a8a9a632497ef33e868aa27f86393b");
//   // // const result = schnorrSign(message, privateKey);

//   // console.log(schnorrSign(message, privateKey));

//   console.log(secp256k1CreatePublicKey(privateKey));
// });

// test("checkMultiSig", () => {
//   const data: TxData = {
//     inputs: [
//       {
//         previousTxId: "0930a48bd0b7ac94822b838b733ad0e9691bce1c6046fbd62e150788fce297f9",
//         vout: "3",
//         sequence: "ffffffff",
//         scriptPubKey:
//           "52210375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c2103a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff2103c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f88053ae",
//         amount: "0.01662577",
//       },
//     ],
//     outputs: [
//       { scriptPubKey: "a914789b9183bc04977e34aaf9d22d41c6ff8867fc4087", amount: "0.013" },
//       { scriptPubKey: "0020701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d", amount: "0.00302577" },
//     ],
//     version: "1",
//     timelock: "0",
//     currentInputIndex: 0,
//   };

//   const publicKeyList: WizData[] = [
//     WizData.fromHex("0375e00eb72e29da82b89367947f29ef34afb75e8654f6ea368e0acdfd92976b7c"),
//     WizData.fromHex("03a1b26313f430c4b15bb1fdce663207659d8cac749a0e53d70eff01874496feff"),
//     WizData.fromHex("03c96d495bfdd5ba4145e3e046fee45e84a8a48ad05bd8dbb395c011a32cf9f880"),
//   ];

//   const signatureList: WizData[] = [
//     WizData.fromHex("304402202298e0668fb29c3b2d8e18592e1fc22b7d452fe79783421b742f43d4dbdb600402201b770e603ef2776608b935e82c1da973bd008107cb16806d99725929b9e7b406"),
//     WizData.fromHex("30440220428802fe653c7b864a24515932a4ea61842da59110a86c7771f28d3af3f230ec02200a199b60f9f3877d97c9898746775a2b3138627c9b3226a79bef3dfd720606d6"),
//   ];

//   const checkMultiSigValue = checkMultiSig(publicKeyList, signatureList, data);
//   console.log(checkMultiSigValue);
// });
