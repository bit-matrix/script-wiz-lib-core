"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.greaterThanOrEqual64 = exports.greaterThan64 = exports.lessThanOrEqual64 = exports.lessThan64 = exports.neg64 = exports.div64 = exports.mul64 = exports.sub64 = exports.add64 = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var bn_js_1 = __importDefault(require("bn.js"));
var utils_1 = require("./utils");
var add64 = function (wizData, wizData2) {
    if (wizData.bytes.length != 8 || wizData2.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var a = new bn_js_1.default(wizData.bin, 2);
    var b = new bn_js_1.default(wizData2.bin, 2);
    var addedValue = a.add(b);
    if (addedValue.byteLength() > 8) {
        return [wiz_data_1.default.fromNumber(0)];
    }
    var addedValueBin = addedValue.toString(2, 64);
    var modifiedAddedValueBin = addedValueBin.slice(-64);
    return [wiz_data_1.default.fromBin(modifiedAddedValueBin), wiz_data_1.default.fromNumber(1)];
};
exports.add64 = add64;
var sub64 = function (wizData, wizData2) {
    if (wizData.bytes.length != 8 || wizData2.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var a = new bn_js_1.default(wizData.bin, 2);
    var b = new bn_js_1.default(wizData2.bin, 2);
    var subValue = a.sub(b);
    if (subValue.byteLength() > 8) {
        return [wiz_data_1.default.fromNumber(0)];
    }
    var subValueBin = subValue.toString(2, 64);
    if (subValue.isNeg())
        subValueBin = subValue.toTwos(64).toString(2, 64);
    var modifiedSubValueBin = subValueBin.slice(-64);
    return [wiz_data_1.default.fromBin(modifiedSubValueBin), wiz_data_1.default.fromNumber(1)];
};
exports.sub64 = sub64;
var mul64 = function (wizData, wizData2) {
    if (wizData.bytes.length !== 8 || wizData2.bytes.length !== 8)
        throw "Input bytes length must be equal 8 byte";
    var a = new bn_js_1.default(wizData.bin, 2);
    var b = new bn_js_1.default(wizData2.bin, 2);
    var mulValue = a.mul(b);
    if (mulValue.byteLength() > 8) {
        return [wiz_data_1.default.fromNumber(0)];
    }
    var mulValueBin = mulValue.toString(2, 64);
    var modifiedMulValueBin = mulValueBin.slice(-64);
    return [wiz_data_1.default.fromBin(modifiedMulValueBin), wiz_data_1.default.fromNumber(1)];
};
exports.mul64 = mul64;
var div64 = function (wizData, wizData2) {
    if (wizData.bytes.length != 8 || wizData2.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var a = new bn_js_1.default(wizData.bin, 2);
    var b = new bn_js_1.default(wizData2.bin, 2);
    if (b.eq(utils_1.ZERO_64) || (b.eq(utils_1.NEGATIVE_1_64) && a.eq(utils_1.MIN_INTEGER_64))) {
        return [wiz_data_1.default.fromNumber(0)];
    }
    var r = a.mod(b);
    var q = a.div(b);
    if (r.lt(utils_1.ZERO_64) && b.gt(utils_1.ZERO_64)) {
        r = r.add(b);
        q = q.sub(new bn_js_1.default(1));
    }
    else if (r.lt(utils_1.ZERO_64) && b.lt(utils_1.ZERO_64)) {
        r = r.sub(b);
        q = q.add(new bn_js_1.default(1));
    }
    return [wiz_data_1.default.fromBin(r.toString(2, 64)), wiz_data_1.default.fromBin(q.toString(2, 64)), wiz_data_1.default.fromNumber(1)];
};
exports.div64 = div64;
var neg64 = function (wizData) {
    if (wizData.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var data = new bn_js_1.default(wizData.bin, 2);
    if (data.eq(utils_1.MIN_INTEGER_64))
        return [wiz_data_1.default.fromNumber(0)];
    var negateValue = data.neg();
    var twosNegateValue = negateValue.toTwos(64);
    var twosNegateValue64 = twosNegateValue.toString(2, 64);
    return [wiz_data_1.default.fromBin(twosNegateValue64), wiz_data_1.default.fromNumber(1)];
};
exports.neg64 = neg64;
var lessThan64 = function (wizData, wizData2) {
    if (wizData.bytes.length != 8 || wizData2.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var bigA = new bn_js_1.default(wizData.bin, 2);
    var bigB = new bn_js_1.default(wizData2.bin, 2);
    var isANeg = wizData.bin.charAt(0) === "1";
    var isBNeg = wizData2.bin.charAt(0) === "1";
    if (isANeg && !isBNeg) {
        return wiz_data_1.default.fromNumber(1);
    }
    else if (!isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(0);
    }
    else if (isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(bigB.neg().lt(bigA.neg()) ? 1 : 0);
    }
    return wiz_data_1.default.fromNumber(bigA.lt(bigB) ? 1 : 0);
};
exports.lessThan64 = lessThan64;
var lessThanOrEqual64 = function (wizData, wizData2) {
    if (wizData.bytes.length != 8 || wizData2.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var bigA = new bn_js_1.default(wizData.bin, 2);
    var bigB = new bn_js_1.default(wizData2.bin, 2);
    var isANeg = wizData.bin.charAt(0) === "1";
    var isBNeg = wizData2.bin.charAt(0) === "1";
    if (isANeg && !isBNeg) {
        return wiz_data_1.default.fromNumber(1);
    }
    else if (!isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(0);
    }
    else if (isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(bigB.neg().lte(bigA.neg()) ? 1 : 0);
    }
    return wiz_data_1.default.fromNumber(bigA.lte(bigB) ? 1 : 0);
};
exports.lessThanOrEqual64 = lessThanOrEqual64;
var greaterThan64 = function (wizData, wizData2) {
    if (wizData.bytes.length != 8 || wizData2.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var bigA = new bn_js_1.default(wizData.bin, 2);
    var bigB = new bn_js_1.default(wizData2.bin, 2);
    var isANeg = wizData.bin.charAt(0) === "1";
    var isBNeg = wizData2.bin.charAt(0) === "1";
    if (isANeg && !isBNeg) {
        return wiz_data_1.default.fromNumber(0);
    }
    else if (!isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(1);
    }
    else if (isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(bigB.neg().gt(bigA.neg()) ? 1 : 0);
    }
    return wiz_data_1.default.fromNumber(bigA.gt(bigB) ? 1 : 0);
};
exports.greaterThan64 = greaterThan64;
var greaterThanOrEqual64 = function (wizData, wizData2) {
    if (wizData.bytes.length != 8 || wizData2.bytes.length != 8)
        throw "Input bytes length must be equal 8 byte";
    var bigA = new bn_js_1.default(wizData.bin, 2);
    var bigB = new bn_js_1.default(wizData2.bin, 2);
    var isANeg = wizData.bin.charAt(0) === "1";
    var isBNeg = wizData2.bin.charAt(0) === "1";
    if (isANeg && !isBNeg) {
        return wiz_data_1.default.fromNumber(0);
    }
    else if (!isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(1);
    }
    else if (isANeg && isBNeg) {
        return wiz_data_1.default.fromNumber(bigB.neg().gte(bigA.neg()) ? 1 : 0);
    }
    return wiz_data_1.default.fromNumber(bigA.gte(bigB) ? 1 : 0);
};
exports.greaterThanOrEqual64 = greaterThanOrEqual64;
//# sourceMappingURL=arithmetics64.js.map