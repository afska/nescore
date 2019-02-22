import instructions from "../instructions";
import addressings from "../addressings";

export default [
	{
		id: 0x29,
		instruction: instructions.AND,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0x25,
		instruction: instructions.AND,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x35,
		instruction: instructions.AND,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x2d,
		instruction: instructions.AND,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x3d,
		instruction: instructions.AND,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x39,
		instruction: instructions.AND,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x21,
		instruction: instructions.AND,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0x31,
		instruction: instructions.AND,
		cycles: 5,
		addressing: addressings.INDEXED_INDIRECT_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x49,
		instruction: instructions.EOR,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0x45,
		instruction: instructions.EOR,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x55,
		instruction: instructions.EOR,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x4d,
		instruction: instructions.EOR,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x5d,
		instruction: instructions.EOR,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x59,
		instruction: instructions.EOR,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x41,
		instruction: instructions.EOR,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0x51,
		instruction: instructions.EOR,
		cycles: 5,
		addressing: addressings.INDEXED_INDIRECT_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x09,
		instruction: instructions.ORA,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0x05,
		instruction: instructions.ORA,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0x15,
		instruction: instructions.ORA,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0x0d,
		instruction: instructions.ORA,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x1d,
		instruction: instructions.ORA,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x19,
		instruction: instructions.ORA,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x01,
		instruction: instructions.ORA,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0x11,
		instruction: instructions.ORA,
		cycles: 5,
		addressing: addressings.INDEXED_INDIRECT_Y,
		extraCycleIfPageCrossed: true
	}
];
