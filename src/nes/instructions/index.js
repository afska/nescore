import logical from "./logical";
import data from "./data";
import _ from "lodash";

export default _.keyBy([...logical, ...data], "id");

// TODO: Instructions
// arithmetic
//   ADC
//   ASL
//   DEC
//   DEX
//   DEY
//   INC
//   INX
//   INY
//   ROL
//   ROR
//   SBC

// logical
//   AND ✓
//   EOR
//   LSR
//   ORA

// checks
//   BIT
//   CMP
//   CPX
//   CPY

// data
//   CLC ✓
//   CLD ✓
//   CLI ✓
//   CLV ✓
//   LDA ✓
//   LDX ✓
//   LDY ✓
//   PHA ✓
//   PHP ✓
//   PLA ✓
//   PLP ✓
//   SEC ✓
//   SED ✓
//   SEI ✓
//   STA ✓
//   STX ✓
//   STY ✓
//   TAX ✓
//   TAY ✓
//   TSX ✓
//   TXA ✓
//   TXS ✓
//   TYA ✓

// branching
//   BCC
//   BCS
//   BEQ
//   BMI
//   BNE
//   BPL
//   BVC
//   BVS
//   JMP
//   JSR
//   RTI
//   RTS

// misc
//   BRK
//   NOP
