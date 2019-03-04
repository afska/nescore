import instructions from "../instructions";
import addressings from "../addressings";

export default [
	{
		id: 0x69,
		instruction: instructions.ADC,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0x65,
		instruction: instructions.ADC,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x75,
		instruction: instructions.ADC,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x6d,
		instruction: instructions.ADC,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x7d,
		instruction: instructions.ADC,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x79,
		instruction: instructions.ADC,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x61,
		instruction: instructions.ADC,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0x71,
		instruction: instructions.ADC,
		cycles: 5,
		addressing: addressings.INDEXED_INDIRECT_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x0a,
		instruction: instructions.ASL,
		cycles: 2,
		addressing: addressings.ACCUMULATOR
	},
	{
		id: 0x06,
		instruction: instructions.ASL,
		cycles: 5,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x16,
		instruction: instructions.ASL,
		cycles: 6,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x0e,
		instruction: instructions.ASL,
		cycles: 6,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x1e,
		instruction: instructions.ASL,
		cycles: 7,
		addressing: addressings.INDEXED_ABSOLUTE_X
	},
	{
		id: 0xc6,
		instruction: instructions.DEC,
		cycles: 5,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xd6,
		instruction: instructions.DEC,
		cycles: 6,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0xce,
		instruction: instructions.DEC,
		cycles: 6,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xde,
		instruction: instructions.DEC,
		cycles: 7,
		addressing: addressings.INDEXED_ABSOLUTE_X
	},
	{
		id: 0xca,
		instruction: instructions.DEX,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x88,
		instruction: instructions.DEY,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xe6,
		instruction: instructions.INC,
		cycles: 5,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xf6,
		instruction: instructions.INC,
		cycles: 6,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0xee,
		instruction: instructions.INC,
		cycles: 6,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xfe,
		instruction: instructions.INC,
		cycles: 7,
		addressing: addressings.INDEXED_ABSOLUTE_X
	},
	{
		id: 0xe8,
		instruction: instructions.INX,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xc8,
		instruction: instructions.INY,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x4a,
		instruction: instructions.LSR,
		cycles: 2,
		addressing: addressings.ACCUMULATOR
	},
	{
		id: 0x46,
		instruction: instructions.LSR,
		cycles: 5,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x56,
		instruction: instructions.LSR,
		cycles: 6,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x4e,
		instruction: instructions.LSR,
		cycles: 6,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x5e,
		instruction: instructions.LSR,
		cycles: 7,
		addressing: addressings.INDEXED_ABSOLUTE_X
	},
	{
		id: 0x2a,
		instruction: instructions.ROL,
		cycles: 2,
		addressing: addressings.ACCUMULATOR
	},
	{
		id: 0x26,
		instruction: instructions.ROL,
		cycles: 5,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x36,
		instruction: instructions.ROL,
		cycles: 6,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x2e,
		instruction: instructions.ROL,
		cycles: 6,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x3e,
		instruction: instructions.ROL,
		cycles: 7,
		addressing: addressings.INDEXED_ABSOLUTE_X
	},
	{
		id: 0x6a,
		instruction: instructions.ROR,
		cycles: 2,
		addressing: addressings.ACCUMULATOR
	},
	{
		id: 0x66,
		instruction: instructions.ROR,
		cycles: 5,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x76,
		instruction: instructions.ROR,
		cycles: 6,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x6e,
		instruction: instructions.ROR,
		cycles: 6,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x7e,
		instruction: instructions.ROR,
		cycles: 7,
		addressing: addressings.INDEXED_ABSOLUTE_X
	},
	{
		id: 0xe9,
		instruction: instructions.SBC,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0xe5,
		instruction: instructions.SBC,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xf5,
		instruction: instructions.SBC,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0xed,
		instruction: instructions.SBC,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xfd,
		instruction: instructions.SBC,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0xf9,
		instruction: instructions.SBC,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0xe1,
		instruction: instructions.SBC,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0xf1,
		instruction: instructions.SBC,
		cycles: 5,
		addressing: addressings.INDEXED_INDIRECT_Y,
		extraCycleIfPageCrossed: true
	}
];
