import instructions from "../instructions";
import addressings from "../addressings";

export default [
  {
    id: 0x24,
    instruction: instructions.BIT,
    cycles: 3,
    addressing: addressings.ZERO_PAGE
  },
  {
    id: 0x2c,
    instruction: instructions.BIT,
    cycles: 4,
    addressing: addressings.ABSOLUTE
  },
  {
    id: 0xc9,
    instruction: instructions.CMP,
    cycles: 2,
    addressing: addressings.IMMEDIATE
  },
  {
    id: 0xc5,
    instruction: instructions.CMP,
    cycles: 3,
    addressing: addressings.ZERO_PAGE
  },
  {
    id: 0xd5,
    instruction: instructions.CMP,
    cycles: 4,
    addressing: addressings.INDEXED_ZERO_PAGE_X
  },
  {
    id: 0xcd,
    instruction: instructions.CMP,
    cycles: 4,
    addressing: addressings.ABSOLUTE
  },
  {
    id: 0xdd,
    instruction: instructions.CMP,
    cycles: 4,
    addressing: addressings.INDEXED_ABSOLUTE_X,
    extraCycleIfPageCrossed: true
  },
  {
    id: 0xd9,
    instruction: instructions.CMP,
    cycles: 4,
    addressing: addressings.INDEXED_ABSOLUTE_Y,
    extraCycleIfPageCrossed: true
  },
  {
    id: 0xc1,
    instruction: instructions.CMP,
    cycles: 6,
    addressing: addressings.INDEXED_INDIRECT_X
  },
  {
    id: 0xd1,
    instruction: instructions.CMP,
    cycles: 5,
    addressing: addressings.INDEXED_INDIRECT_Y,
    extraCycleIfPageCrossed: true
  },
  {
    id: 0xe0,
    instruction: instructions.CPX,
    cycles: 2,
    addressing: addressings.IMMEDIATE
  },
  {
    id: 0xe4,
    instruction: instructions.CPX,
    cycles: 3,
    addressing: addressings.ZERO_PAGE
  },
  {
    id: 0xec,
    instruction: instructions.CPX,
    cycles: 4,
    addressing: addressings.ABSOLUTE
  },
  {
    id: 0xc0,
    instruction: instructions.CPY,
    cycles: 2,
    addressing: addressings.IMMEDIATE
  },
  {
    id: 0xc4,
    instruction: instructions.CPY,
    cycles: 3,
    addressing: addressings.ZERO_PAGE
  },
  {
    id: 0xcc,
    instruction: instructions.CPY,
    cycles: 4,
    addressing: addressings.ABSOLUTE
  }
];
