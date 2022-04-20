import preLine from "./_1_preLine";
import visibleLines from "./_2_visibleLines";
import vBlankLine from "./_3_vBlankLine";

export default {
	PRELINE: preLine,
	VISIBLE: visibleLines,
	VBLANK_START: vBlankLine,
	IDLE: () => {}
};
