import implicit from "./implicit";
import immediate from "./immediate";
import absolute from "./absolute";
import indexedAbsoluteX from "./indexedAbsoluteX";
import indexedAbsoluteY from "./indexedAbsoluteY";
import zeroPage from "./zeroPage";
import indexedZeroPageX from "./indexedZeroPageX";
import indexedZeroPageY from "./indexedZeroPageY";
import indirect from "./indirect";
import indexedIndirectX from "./indexedIndirectX";
import indexedIndirectY from "./indexedIndirectY";
import relative from "./relative";
import accumulator from "./accumulator";
import _ from "lodash";

export default _.keyBy(
	[
		implicit,
		immediate,
		absolute,
		indexedAbsoluteX,
		indexedAbsoluteY,
		zeroPage,
		indexedZeroPageX,
		indexedZeroPageY,
		indirect,
		indexedIndirectX,
		indexedIndirectY,
		relative,
		accumulator
	],
	"id"
);
