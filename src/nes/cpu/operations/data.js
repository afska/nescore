import instructions from "../instructions";
import addressings from "../addressings";

export default [
	{
		id: 0x18,
		instruction: instructions.CLC,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xd8,
		instruction: instructions.CLD,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x58,
		instruction: instructions.CLI,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xb8,
		instruction: instructions.CLV,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xa9,
		instruction: instructions.LDA,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0xa5,
		instruction: instructions.LDA,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xb5,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0xad,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xbd,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		canTakeExtraCycles: true
	},
	{
		id: 0xb9,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		canTakeExtraCycles: true
	},
	{
		id: 0xa1,
		instruction: instructions.LDA,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0xb1,
		instruction: instructions.LDA,
		cycles: 5,
		addressing: addressings.INDEXED_INDIRECT_Y,
		canTakeExtraCycles: true
	},
	{
		id: 0xa2,
		instruction: instructions.LDX,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0xa6,
		instruction: instructions.LDX,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xb6,
		instruction: instructions.LDX,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_Y
	},
	{
		id: 0xae,
		instruction: instructions.LDX,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xbe,
		instruction: instructions.LDX,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		canTakeExtraCycles: true
	},
	{
		id: 0xa0,
		instruction: instructions.LDY,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0xa4,
		instruction: instructions.LDY,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xb4,
		instruction: instructions.LDY,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0xac,
		instruction: instructions.LDY,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xbc,
		instruction: instructions.LDY,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		canTakeExtraCycles: true
	},
	{
		id: 0x48,
		instruction: instructions.PHA,
		cycles: 3,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x08,
		instruction: instructions.PHP,
		cycles: 3,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x68,
		instruction: instructions.PLA,
		cycles: 4,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x28,
		instruction: instructions.PLP,
		cycles: 4,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x38,
		instruction: instructions.SEC,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xf8,
		instruction: instructions.SED,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x78,
		instruction: instructions.SEI,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x85,
		instruction: instructions.STA,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x95,
		instruction: instructions.STA,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x8d,
		instruction: instructions.STA,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x9d,
		instruction: instructions.STA,
		cycles: 5,
		addressing: addressings.INDEXED_ABSOLUTE_X
	},
	{
		id: 0x99,
		instruction: instructions.STA,
		cycles: 5,
		addressing: addressings.INDEXED_ABSOLUTE_Y
	},
	{
		id: 0x81,
		instruction: instructions.STA,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0x91,
		instruction: instructions.STA,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_Y
	},
	{
		id: 0x86,
		instruction: instructions.STX,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x96,
		instruction: instructions.STX,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_Y
	},
	{
		id: 0x8e,
		instruction: instructions.STX,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x84,
		instruction: instructions.STY,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x94,
		instruction: instructions.STY,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x8c,
		instruction: instructions.STY,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xaa,
		instruction: instructions.TAX,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xa8,
		instruction: instructions.TAY,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xba,
		instruction: instructions.TSX,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x8a,
		instruction: instructions.TXA,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x9a,
		instruction: instructions.TXS,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x98,
		instruction: instructions.TYA,
		cycles: 2,
		addressing: addressings.IMPLICIT
	}
];
