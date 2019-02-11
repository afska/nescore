import { Buffer } from "buffer";
import GameCartridge from "./GameCartridge";

export default async () => {
  const response = await fetch("rom.nes");
  const arrayBuffer = await response.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);

  window.cartridge = new GameCartridge(bytes);

  console.log(window.cartridge.nesConstant);
};
