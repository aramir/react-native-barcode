import React from "react";
import { render } from "@testing-library/react-native";
import Barcode from "../index";

describe("Barcode", () => {
	it("renders an SVG barcode path for a valid value", async () => {
		const { container } = await render(<Barcode value="HelloWorld" />);

		const [path] = container.queryAll(
			(instance) => typeof instance.props.d === "string",
		);
		expect(path.props.d.length).toBeGreaterThan(0);
	});

	it("renders using a non-default format", async () => {
		const { container } = await render(
			<Barcode value="5901234123457" format="EAN13" />,
		);

		const [path] = container.queryAll(
			(instance) => typeof instance.props.d === "string",
		);
		expect(path.props.d.length).toBeGreaterThan(0);
	});

	it("calls onError instead of throwing for an invalid value", async () => {
		const consoleError = jest.spyOn(console, "error")
			.mockImplementation(() => {
			});
		const onError = jest.fn();
		await render(<Barcode value="" onError={onError} />);

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);

		consoleError.mockRestore();
	});

	it("calls onError instead of throwing for an unknown format", async () => {
		const consoleError = jest.spyOn(console, "error")
			.mockImplementation(() => {
			});
		const onError = jest.fn();
		await render(
			<Barcode value="123" format={"NOPE" as never} onError={onError} />,
		);

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);

		consoleError.mockRestore();
	});

	it("calls onError instead of throwing when the value is the wrong length for the format", async () => {
		const consoleError = jest.spyOn(console, "error")
			.mockImplementation(() => {
			});
		const onError = jest.fn();
		await render(<Barcode value="123" format="EAN13" onError={onError} />);

		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);

		consoleError.mockRestore();
	});

	it("renders the optional caption text when provided", async () => {
		const { getByText } = await render(
			<Barcode value="HelloWorld" text="Caption" />,
		);

		expect(getByText("Caption")).toBeTruthy();
	});

	it("does not render a caption when text is omitted", async () => {
		const { queryByText } = await render(<Barcode value="HelloWorld" />);

		expect(queryByText("Caption")).toBeNull();
	});
});
