import WizData from "@script-wiz/wiz-data";
export declare const convert64: (wizData: WizData) => WizData;
export declare const numToLE64: (wizData: WizData) => WizData;
export declare const numToLE32: (wizData: WizData) => WizData;
export declare const convert32: (wizData: WizData) => WizData;
export declare const LE64ToNum: (wizData: WizData) => WizData;
export declare const LE32toLE64: (wizData: WizData) => WizData;
export declare const LE32ToNum: (wizData: WizData) => WizData;
export declare const inputConverter: (value: string, type: "BE" | "LE" | "Decimal", byteLength: "4-bytes" | "8-bytes") => {
    be: string;
    le: string;
    decimal: string;
};
