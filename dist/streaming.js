"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sha256Initializer = exports.Sha256Updater = exports.Sha256Finalizer = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var sha256streaming_1 = __importDefault(require("@bitmatrix/sha256streaming"));
var Sha256Finalizer = function (wizData, wizData2) {
    var result = sha256streaming_1.default.mod.modsha256Finalizer(wizData.hex, wizData2.hex);
    return wiz_data_1.default.fromHex(result);
};
exports.Sha256Finalizer = Sha256Finalizer;
var Sha256Updater = function (wizData, wizData2) {
    var result = sha256streaming_1.default.mod.sha256Updater(wizData.hex, wizData2.hex);
    return wiz_data_1.default.fromHex(result);
};
exports.Sha256Updater = Sha256Updater;
var Sha256Initializer = function (wizData) {
    var result = sha256streaming_1.default.mod.sha256Initializer(wizData.hex);
    return wiz_data_1.default.fromHex(result);
};
exports.Sha256Initializer = Sha256Initializer;
//# sourceMappingURL=streaming.js.map