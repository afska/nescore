import Controller from "./Controller";
const should = require("chai").Should();

describe("Controller", () => {
	let controller;

	beforeEach(() => {
		const port = Controller.createPorts().primary;
		controller = new Controller(port);
	});

	it("starts in 0", () => {
		controller.toByte().should.equal(0);
	});

	it("can update button states", () => {
		controller.update("BUTTON_B", true);
		controller.update("BUTTON_LEFT", true);

		controller.toByte().should.equal(0b01000010);
	});

	it("also updates the controller port", () => {
		controller.update("BUTTON_B", true);
		controller.update("BUTTON_LEFT", true);

		controller.port.value.should.equal(0b01000010);
	});

	it("can clear all buttons", () => {
		controller.update("BUTTON_B", true);
		controller.clear();

		controller.toByte().should.equal(0);
	});
});
