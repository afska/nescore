import PulseControl from "./PulseControl";
import PulseSweep from "./PulseSweep";
import PulseTimerLow from "./PulseTimerLow";
import PulseLCLTimerHigh from "./PulseLCLTimerHigh";
import TriangleLinearLCL from "./TriangleLinearLCL";
import TriangleTimerLow from "./TriangleTimerLow";
import TriangleLCLTimerHigh from "./TriangleLCLTimerHigh";
import NoiseControl from "./NoiseControl";
import NoiseForm from "./NoiseForm";
import NoiseLCL from "./NoiseLCL";
import DMCControl from "./DMCControl";
import DMCLoad from "./DMCLoad";
import DMCSampleAddress from "./DMCSampleAddress";
import DMCSampleLength from "./DMCSampleLength";
import APUControl from "./APUControl";
import APUFrameCounter from "./APUFrameCounter";
import { WithCompositeMemory, MemoryPadding } from "../../memory";

/** A collection of all the CPU-mapped APU registers. */
class APURegisterSegment {
	constructor(context) {
		this.pulses = [0, 1].map((id) => ({
			control: new PulseControl(id).loadContext(context), //           $4000/$4004
			sweep: new PulseSweep(id).loadContext(context), //               $4001/$4005
			timerLow: new PulseTimerLow(id).loadContext(context), //         $4002/$4006
			lclTimerHigh: new PulseLCLTimerHigh(id).loadContext(context) //  $4003/$4007
		}));

		this.triangle = {
			linearLCL: new TriangleLinearLCL().loadContext(context), //      $4008
			timerLow: new TriangleTimerLow().loadContext(context), //        $400A
			lclTimerHigh: new TriangleLCLTimerHigh().loadContext(context) // $400B
		};

		this.noise = {
			control: new NoiseControl().loadContext(context), //             $400C
			form: new NoiseForm().loadContext(context), //                $400E
			lcl: new NoiseLCL().loadContext(context) //                      $400F
		};

		this.dmc = {
			control: new DMCControl().loadContext(context), //               $4010
			load: new DMCLoad().loadContext(context), //                     $4011
			sampleAddress: new DMCSampleAddress().loadContext(context), //   $4012
			sampleLength: new DMCSampleLength().loadContext(context) //      $4013
		};

		this.apuControl = new APUControl(); //                             $4015
		this.apuFrameCounter = new APUFrameCounter(); //                   $4017
	}

	/** Creates a memory segment with the first 20 bytes ($4000-$4013). */
	toMemory() {
		return WithCompositeMemory.createSegment([
			this.pulses[0].control,
			this.pulses[0].sweep,
			this.pulses[0].timerLow,
			this.pulses[0].lclTimerHigh,

			this.pulses[1].control,
			this.pulses[1].sweep,
			this.pulses[1].timerLow,
			this.pulses[1].lclTimerHigh,

			this.triangle.linearLCL,
			new MemoryPadding(1),
			this.triangle.timerLow,
			this.triangle.lclTimerHigh,

			this.noise.control,
			new MemoryPadding(1),
			this.noise.form,
			this.noise.lcl,

			this.dmc.control,
			this.dmc.load,
			this.dmc.sampleAddress,
			this.dmc.sampleLength
		]);
	}
}

export { APURegisterSegment };
