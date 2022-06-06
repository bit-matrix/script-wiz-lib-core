"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = exports.withIn = exports.max = exports.min = exports.graterThanOrEqual = exports.lessThanOrEqual = exports.graterThan = exports.lessThan = exports.numNotEqual = exports.numEqualVerify = exports.numEqual = exports.boolOr = exports.boolAnd = exports.rshift = exports.lshift = exports.div = exports.mul = exports.sub = exports.add = exports.notEqual0 = exports.not = exports.abs = exports.negate = exports.sub1 = exports.add1 = void 0;
var wiz_data_1 = __importDefault(require("@script-wiz/wiz-data"));
var add1 = function (wizData) {
    if (wizData.number !== undefined) {
        var numberValue = wizData.number + 1;
        return wiz_data_1.default.fromNumber(numberValue);
    }
    throw "Error: this operation requires 1 valid number wizData";
};
exports.add1 = add1;
var sub1 = function (wizData) {
    if (wizData.number !== undefined) {
        var numberValue = wizData.number - 1;
        return wiz_data_1.default.fromNumber(numberValue);
    }
    throw "Error: this operation requires 1 valid number wizData";
};
exports.sub1 = sub1;
var negate = function (wizData) {
    if (wizData.number !== undefined) {
        var negateValue = wizData.number * -1;
        return wiz_data_1.default.fromNumber(negateValue);
    }
    throw "Error: this operation requires 1 valid number wizData";
};
exports.negate = negate;
var abs = function (wizData) {
    if (wizData.number !== undefined) {
        var absValue = Math.abs(wizData.number);
        return wiz_data_1.default.fromNumber(absValue);
    }
    throw "Error: this operation requires 1 valid number wizData";
};
exports.abs = abs;
var not = function (wizData) {
    if (wizData.number !== undefined) {
        var isfalse = !wizData.number;
        return wiz_data_1.default.fromNumber(isfalse ? 1 : 0);
    }
    throw "Error: this operation requires 1 valid number wizData";
};
exports.not = not;
var notEqual0 = function (wizData) {
    if (wizData.number !== undefined) {
        var isfalse = !wizData.number;
        return wiz_data_1.default.fromNumber(isfalse ? 0 : 1);
    }
    throw "Error: this operation requires 1 valid number wizData";
};
exports.notEqual0 = notEqual0;
var add = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        var addedValue = wizData.number + wizData2.number;
        return wiz_data_1.default.fromNumber(addedValue);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.add = add;
var sub = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        var subValue = wizData.number - wizData2.number;
        return wiz_data_1.default.fromNumber(subValue);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.sub = sub;
var mul = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        var mulValue = wizData.number * wizData2.number;
        return wiz_data_1.default.fromNumber(mulValue);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.mul = mul;
var div = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        if (wizData2.number === 0)
            throw "Error: dividing can't be eqaul 0.";
        var divValue = wizData.number / wizData2.number;
        divValue = divValue > 0 ? Math.floor(divValue) : Math.ceil(divValue);
        return wiz_data_1.default.fromNumber(divValue);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.div = div;
var lshift = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        var lShiftValue = wizData.number << wizData2.number;
        return wiz_data_1.default.fromNumber(lShiftValue);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.lshift = lshift;
var rshift = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        var rShiftValue = wizData.number >> wizData2.number;
        return wiz_data_1.default.fromNumber(rShiftValue);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.rshift = rshift;
var boolAnd = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        if (wizData.number === 0 || wizData2.number === 0)
            return wiz_data_1.default.fromNumber(0);
        return wiz_data_1.default.fromNumber(1);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.boolAnd = boolAnd;
var boolOr = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        if (wizData.number === 0 && wizData2.number === 0)
            return wiz_data_1.default.fromNumber(0);
        return wiz_data_1.default.fromNumber(1);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.boolOr = boolOr;
var numEqual = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        return wiz_data_1.default.fromNumber(wizData.number === wizData2.number ? 1 : 0);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.numEqual = numEqual;
var numEqualVerify = function (wizData, wizData2) {
    return (0, exports.numEqual)(wizData, wizData2);
};
exports.numEqualVerify = numEqualVerify;
var numNotEqual = function (wizData, wizData2) {
    var equal = (0, exports.numEqual)(wizData, wizData2).number === 1;
    return wiz_data_1.default.fromNumber(equal ? 0 : 1);
};
exports.numNotEqual = numNotEqual;
var lessThan = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        return wiz_data_1.default.fromNumber(wizData.number < wizData2.number ? 1 : 0);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.lessThan = lessThan;
var graterThan = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        return wiz_data_1.default.fromNumber(wizData.number > wizData2.number ? 1 : 0);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.graterThan = graterThan;
var lessThanOrEqual = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        return wiz_data_1.default.fromNumber(wizData.number <= wizData2.number ? 1 : 0);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.lessThanOrEqual = lessThanOrEqual;
var graterThanOrEqual = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        return wiz_data_1.default.fromNumber(wizData.number >= wizData2.number ? 1 : 0);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.graterThanOrEqual = graterThanOrEqual;
var min = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        if (wizData.number >= wizData2.number)
            return wizData2;
        if (wizData2.number > wizData.number)
            return wizData;
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.min = min;
var max = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        if (wizData.number >= wizData2.number)
            return wizData;
        if (wizData2.number > wizData.number)
            return wizData2;
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.max = max;
var withIn = function (wizData, wizData2, wizData3) {
    var currentNumber = wizData.number;
    var minValue = wizData2.number;
    var maxValue = wizData3.number;
    if (currentNumber !== undefined && minValue !== undefined && maxValue !== undefined) {
        if (currentNumber >= minValue && currentNumber < maxValue)
            return wiz_data_1.default.fromNumber(1);
        return wiz_data_1.default.fromNumber(0);
    }
    throw "Error: this operation requires 3 valid number wizData";
};
exports.withIn = withIn;
var mod = function (wizData, wizData2) {
    if (wizData.number !== undefined && wizData2.number !== undefined) {
        var modResult = wizData.number % wizData2.number;
        return wiz_data_1.default.fromNumber(modResult);
    }
    throw "Error: this operation requires 2 valid number wizData";
};
exports.mod = mod;
//# sourceMappingURL=arithmetics.js.map