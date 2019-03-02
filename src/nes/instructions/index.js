import arithmetic from "./arithmetic";
import logical from "./logical";
import checks from "./checks";
import data from "./data";
import _ from "lodash";

export default _.keyBy([...arithmetic, ...logical, ...checks, ...data], "id");

// TODO: Instructions
// arithmetic
//   ADC ✓
//   ASL ✓
//   DEC ✓
//   DEX
//   DEY
//   INC
//   INX
//   INY
//   LSR
//   ROL
//   ROR
//   SBC

// logical
//   AND ✓
//   EOR ✓
//   ORA ✓

// checks
//   BIT ✓
//   CMP ✓
//   CPX ✓
//   CPY ✓

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
//   NOP ✓
