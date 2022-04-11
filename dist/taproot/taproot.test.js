"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var model_1 = require("../model");
var __1 = require("..");
// test("xxx", () => {
//   const x = "038a759932b19c2bf441e4e37a0243f03364df38cec1c658743dffa56c334dfb2d";
//   const data = WizData.fromHex(x);
//   console.log(data.bytes[0] & 1);
// });
// test("taghash test", () => {
//   // let byteArrayData = new Uint8Array(1);
//   // byteArrayData[0] = 10;
//   const tag = "TapBranch";
//   const result = tagHash(
//     tag,
//     WizData.fromHex("c81451874bd9ebd4b6fd4bba1f84cdfb533c532365d22a0a702205ff658b17c9" + "632c8632b4f29c6291416e23135cf78ecb82e525788ea5ed6483e3c6ce943b42")
//   );
//   console.log("res", result);
// });
// test("taghash2 test", () => {
//   const tag = "TapBranch";
//   const result = treeHelper(WizData.fromHex("029000b275209997a497d964fc1a62885b05a51166a65a90df00492c8d7cf61d6accf54803beac"), "c0");
//   const result2 = treeHelper(
//     WizData.fromHex("a8206c60f404f8167a38fc70eaf8aa17ac351023bef86bcb9d1086a19afe95bd533388204edfcf9dfe6c0b5c83d1ab3f78d1b39a46ebac6798e08e19761f5ed89ec83c10ac"),
//     "c0"
//   );
//   const final = tagHash(tag, WizData.fromHex(result.h + result2.h));
//   console.log("final", final);
// });
// test("tree helper test", () => {
//   const data = "55935787";
//   const result = treeHelper(WizData.fromHex(data), "c0");
//   expect(result.data).toBe("c00455935787");
//   expect(result.h).toBe("0f20d41260bd81c46f4ee8a388b0f139d107f707e38fb2525f191b83a49c5013");
//   WizData.fromHex("021dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624").bytes,
//     WizData.fromHex("542d433b81daf3e28069bccbb0d951d7d9ca57cc0f563f2de126e91deba7d6a6").bytes;
// });
// test("tweakAdd test", () => {
//   const pubkey = WizData.fromHex("021dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624").bytes;
//   const tweak = WizData.fromHex("542d433b81daf3e28069bccbb0d951d7d9ca57cc0f563f2de126e91deba7d6a6").bytes;
//   const result = tweakAdd(pubkey, tweak);
//   expect(result.hex).toBe("0326fef75b96729c1753eeac93309ae90c8a06192ea5b1b13175e239743ec11c4a");
// });
// test("taproot test", () => {
//   const pubkey = "021dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624";
//   const script1 = WizData.fromHex("52935387");
//   // const script2 = WizData.fromHex("a8206c60f404f8167a38fc70eaf8aa17ac351023bef86bcb9d1086a19afe95bd533388204edfcf9dfe6c0b5c83d1ab3f78d1b39a46ebac6798e08e19761f5ed89ec83c10ac");
//   const result = tapRoot(WizData.fromHex(pubkey), [script1]);
//   // console.log(result.tweak.hex);
// });
// test("demo", () => {
//   // const tag = "TapLeaf";
//   // const input = "029000b275209997a497d964fc1a62885b05a51166a65a90df00492c8d7cf61d6accf54803beac";
//   // const result = treeHelper([WizData.fromHex(input)], "c0");
//   const pubkey = WizData.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
//   const scripts = [
//     WizData.fromHex(
//       "20cd7f33bab8a5a73182b2a1542854ba821374a36d9ee3b37ae586e28ceff4a2431b20766b6b6351b27500c8696c876700c8696c87916960b27521ac68201dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624105461704c6561662f656c656d656e747311546170547765616b2f656c656d656e747300c869557988cd5388d45688d5588853c9696b51c9696b52c9696b006b04ffffff7f6b567a766e6e6eaa7654c70100880401000000888855c7010088040200000088886d6d6d6d6d6d7551"
//     ),
//   ];
//   const version = "c4";
//   // const treeHelperResult = treeHelper(scripts, version);
//   // console.log(tapRoot(pubkey, scripts, TAPROOT_VERSION.LIQUID));
// });
// test("tapBranchtag test", () => {
//   const script1 = WizData.fromHex("632c8632b4f29c6291416e23135cf78ecb82e525788ea5ed6483e3c6ce943b42");
//   const script2 = WizData.fromHex("c81451874bd9ebd4b6fd4bba1f84cdfb533c532365d22a0a702205ff658b17c9");
//   const tag = "TapBranch";
//   const result = tagHash(tag, WizData.fromHex(script1.hex.concat(script2.hex)));
//   console.log(result);
// });
test("multileaf", function () {
    var scripts = [wiz_data_1.default.fromHex("517551")];
    var version = model_1.TAPROOT_VERSION.BITCOIN;
    var pubkey = wiz_data_1.default.fromHex("1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624");
    var treeHelperResult = __1.taproot.controlBlockCalculation(scripts, "c0", pubkey.hex, 0);
    console.log(treeHelperResult);
    // console.log("multileaf", treeHelperResult);
});
//# sourceMappingURL=taproot.test.js.map