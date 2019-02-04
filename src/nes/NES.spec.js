import NES from "./NES";
import chai from "chai";
chai.Should();

it("returns a hello world", () => {
	NES().should.eql("Hello world");
});
