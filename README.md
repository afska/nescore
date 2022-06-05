# NesCore

A NES Emulator made in JavaScript for educational purposes. [Try it!](https://rodri042.github.io/nescore/)

It's main objective is to reflect the NES internals as simply as possible by using clean, object-oriented code. It doesn't have any complex bitwise operations, huge switch-case statements or files with lots of magic numbers.

> ⚠️ This is not a cycle-accurate emulator and performance is not the main concern ⚠️

## Features

- 👾 It emulates a **NES**
- 👨‍🔧 It plays [Super Mario Bros. 3](https://en.wikipedia.org/wiki/Super_Mario_Bros._3)!
- 💻 **CPU**
  - All **official instructions** are implemented
  - [nestest](https://raw.githubusercontent.com/rodri042/nescore/master/public/testroms/nestest.txt) passes ✔️
- Fully functional 🖥️ **PPU** and 🔊 **APU**
- 🔌 Supported **mappers**
  - Mapper **0**: [NROM](https://www.nesdev.org/wiki/NROM)
  - Mapper **1**: [MMC1](https://www.nesdev.org/wiki/MMC1)
  - Mapper **2**: [UxROM](https://www.nesdev.org/wiki/UxROM)
  - Mapper **3**: [CNROM](https://www.nesdev.org/wiki/INES_Mapper_003)
  - Mapper **4**: [MMC3](https://www.nesdev.org/wiki/MMC3)
- 🐏 **SRAM** support
- 💾 **Save states** support
- 🌎 **Web frontend** using [Web Workers](https://www.w3.org/TR/2021/NOTE-workers-20210128/) and [Gamepad API](https://www.w3.org/TR/gamepad/)

## Usage

**`npm install --save nes-emu`**

```js
// configure video and audio:
const onFrame = (frameBuffer) => {
  // write `frameBuffer` (an Uint32Array) to screen...
};
const onSample = (sample) => {
  // write `sample` (a number) to audio buffer...
};
const sampleRate = 48000; // set this to system's sample rate

// create an instance:
const nes = new NES(onFrame, onSample, sampleRate);

// load a game:
nes.load(rom); // rom = Uint8Array

// run at 60 fps, or as fast as you can:
{
  nes.setButton(1, "BUTTON_A", true); // player = 1, button = A, pressed = true
  nes.setButton(2, "BUTTON_DOWN", false); // player = 2, button = DOWN, pressed = false
  // ...set the rest of the buttons
  nes.frame();
}

// save / restore states:
const saveState = nes.getSaveState();
nes.setSaveState(saveState);
```

👀 Have a look at the [demo implementation](https://github.com/rodri042/nescore/tree/master/src/gui) for more details.

## Full API

| Method          | Parameters                                        | Description                                                                                                                                                                                            |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **constructor** | `onFrame`, `onSample`, _`sampleRate`_, _`logger`_ | Creates an emulator's instance. All properties can be set at any time (e.g. `nes.sampleRate = newSampleRate`).                                                                                         |
| `load`          | `rom`, _`saveFileBytes`_                          | Loads a ROM. If a `saveFileBytes` array is provided, it sets the SRAM content.                                                                                                                         |
| `frame`         |                                                   | Runs the emulation for a whole video frame.                                                                                                                                                            |
| `samples`       | `requestedSamples`                                | Runs the emulation until the audio system generates `requestedSamples`.                                                                                                                                |
| `scanline`      |                                                   | Runs the emulation until the next scanline.                                                                                                                                                            |
| `setButton`     | `player`, `button`, `isPressed`                   | Sets the `button` state of `player` to `isPressed`. The `button` can be one of: `["BUTTON_A", "BUTTON_B", "BUTTON_SELECT", "BUTTON_START", "BUTTON_UP", "BUTTON_DOWN", "BUTTON_LEFT", "BUTTON_RIGHT"]` |
| `clearButtons`  | `player`                                          | Sets all buttons of `player` to a not pressed state.                                                                                                                                                   |
| `getSaveFile`   |                                                   | Returns an array with the SRAM bytes, or null.                                                                                                                                                         |
| `getSaveState`  |                                                   | Returns an object with a snapshot of the current state.                                                                                                                                                |
| `setSaveState`  | `saveState`                                       | Restores a `saveState`.                                                                                                                                                                                |

## Screenshots

![nestest screenshot](https://raw.githubusercontent.com/rodri042/nescore/master/img/capture-sm.png)

## Useful links

- [NesDev](https://www.nesdev.org/) | [Mirror](https://rodri042.github.io/nes-docs-backup/nesdev-wiki.zip)
- [NES Emulation Overview](https://ltriant.github.io/2019/11/22/nes-emulator.html) | [Mirror](https://rodri042.github.io/nes-docs-backup/nes-emulation-good-bad-tedious/)
- [NES Ebook](https://bugzmanov.github.io/nes_ebook/chapter_1.html) | [Mirror](https://rodri042.github.io/nes-docs-backup/nes-emulator-rust/)
- [Easy 6502](https://skilldrick.github.io/easy6502/) | [Mirror](https://rodri042.github.io/nes-docs-backup/easy6502)
- [6502 Reference](https://web.archive.org/web/20210724004546/http://www.obelisk.me.uk/6502/reference.html) | [Mirror](https://rodri042.github.io/nes-docs-backup/6502-reference.zip)
- [NES Rendering](https://austinmorlan.com/posts/nes_rendering_overview) | [Mirror](https://rodri042.github.io/nes-docs-backup/nes-rendering-overview/)
- [NES Graphics Part 1](http://www.dustmop.io/blog/2015/04/28/nes-graphics-part-1/) | [Mirror](https://rodri042.github.io/nes-docs-backup/nes-graphics-part-1/)
- [NES Graphics Part 2](http://www.dustmop.io/blog/2015/06/08/nes-graphics-part-2/) | [Mirror](https://rodri042.github.io/nes-docs-backup/nes-graphics-part-2/)
- [NES Graphics Part 3](http://www.dustmop.io/blog/2015/12/18/nes-graphics-part-3/) | [Mirror](https://rodri042.github.io/nes-docs-backup/nes-graphics-part-3/)
