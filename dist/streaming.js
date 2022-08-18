"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Initializer = exports.sha256Updater = exports.sha256Finalizer = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var sha256streaming_1 = __importDefault(require("@bitmatrix/sha256streaming"));
var sha256Finalizer = function (wizData, wizData2) {
    var result = sha256streaming_1.default.sha256Finalizer(wizData.hex, wizData2.hex);
    return wiz_data_1.default.fromHex(result);
};
exports.sha256Finalizer = sha256Finalizer;
var sha256Updater = function (wizData, wizData2) {
    var result = sha256streaming_1.default.sha256Updater(wizData.hex, wizData2.hex);
    return wiz_data_1.default.fromHex(result);
};
exports.sha256Updater = sha256Updater;
var sha256Initializer = function (wizData) {
    var result = sha256streaming_1.default.sha256Initializer(wizData.hex);
    return wiz_data_1.default.fromHex(result);
};
exports.sha256Initializer = sha256Initializer;
//# sourceMappingURL=streaming.js.map