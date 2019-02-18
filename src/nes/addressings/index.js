import implicit from "./implicit";
import immediate from "./immediate";
import absolute from "./absolute";
import indexedAbsoluteX from "./indexedAbsoluteX";
import indexedAbsoluteY from "./indexedAbsoluteY";
import zeroPage from "./zeroPage";
import indexedZeroPageX from "./indexedAbsoluteX";
import indexedZeroPageY from "./indexedAbsoluteY";
import indirect from "./indirect";
import indexedIndirectX from "./indexedAbsoluteX";
import indexedIndirectY from "./indexedAbsoluteY";
import relative from "./relative";
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
		relative
	],
	"id"
);
