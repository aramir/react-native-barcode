import React, { useMemo } from "react";
import { View, Text, TextStyle, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
// jsbarcode ships no types for this internal path (undocumented, not its public API)
// @ts-expect-error
import barcodesImport from "jsbarcode/src/barcodes";

/**
 * Barcode formats supported by the underlying jsbarcode encoders.
 */
export type Format =
	| "CODE39"
	| "CODE128"
	| "CODE128A"
	| "CODE128B"
	| "CODE128C"
	| "EAN13"
	| "EAN8"
	| "EAN5"
	| "EAN2"
	| "UPC"
	| "UPCE"
	| "ITF14"
	| "ITF"
	| "MSI"
	| "MSI10"
	| "MSI11"
	| "MSI1010"
	| "MSI1110"
	| "pharmacode"
	| "codabar"
	| "CODE93";

/**
 * Result of encoding a value with a jsbarcode encoder.
 *
 * @property data - The encoded barcode as a binary string, e.g. `"1101..."`.
 */
type EncodedBarcode = {
	data: string;
};

/**
 * A single jsbarcode encoder instance, as constructed from `barcodes`.
 *
 * @property valid - Whether the value passed to the constructor is valid for this format.
 * @property encode - Encodes the value into an {@link EncodedBarcode}.
 */
type BarcodeEncoder = {
	valid(): boolean;
	encode(): EncodedBarcode;
};

/**
 * Options accepted by a jsbarcode encoder constructor.
 *
 * @property width - The width of a single bar.
 * @property format - The barcode format being encoded.
 * @property height - The height of the barcode.
 * @property lineColor - The color of a single bar.
 * @property background - The container background.
 * @property flat - Whether to return a single flat run-length-encoded result.
 */
type BarcodeEncoderOptions = {
	width: number;
	format: Format;
	height: number;
	lineColor: string;
	background: string;
	flat: boolean;
};

/** Constructor shape shared by every encoder in `barcodes`. */
type BarcodeEncoderConstructor = new (
	value: string,
	options: BarcodeEncoderOptions,
) => BarcodeEncoder;

const barcodes = barcodesImport as Record<string, BarcodeEncoderConstructor>;

/**
 * Props for the {@link Barcode} component.
 *
 * @property value - The text to be encoded.
 * @property width - The width of a single bar.
 * @property maxWidth - The max width of the barcode.
 * @property height - The height of the barcode.
 * @property format - The barcode format to encode `value` with.
 * @property lineColor - The color of a single bar.
 * @property background - The container background (`rgba(0,0,0,0)` for transparent).
 * @property text - Optional text rendered under the barcode.
 * @property textStyle - Styles applied to the text component.
 * @property style - Styles applied to the container.
 * @property onError - Called when `value` fails to encode for the selected `format`.
 */
export type BarcodeProps = {
	value?: string;
	width?: number;
	maxWidth?: number;
	height?: number;
	format?: Format;
	lineColor?: string;
	background?: string;
	text?: React.ReactNode;
	textStyle?: TextStyle;
	style?: ViewStyle;
	onError?: (error: Error) => void;
};

// noinspection JSUnusedGlobalSymbols
/**
 * Renders `value` as an SVG barcode.
 *
 * @param props - See {@link BarcodeProps}.
 */
export default function Barcode({
	                                value = "",
	                                width = 2,
	                                height = 100,
	                                format = "CODE128",
	                                lineColor = "#000000",
	                                background = "#ffffff",
	                                text,
	                                textStyle,
	                                style,
	                                onError,
	                                maxWidth,
                                }: BarcodeProps) {

	/**
	 * Builds an SVG path `d` string for a single filled rectangle.
	 */
	const drawRect = (x: number, y: number, rectWidth: number, rectHeight: number) => {
		return `M${x},${y}h${rectWidth}v${rectHeight}h-${rectWidth}z`;
	};

	/**
	 * Converts an encoded barcode's binary string into SVG rectangle paths.
	 */
	const drawSvgBarCode = (encoded: EncodedBarcode) => {
		const rects: string[] = [];
		const { data: binary } = encoded;

		const barCodeWidth = binary.length * width;
		const singleBarWidth =
			typeof maxWidth === "number" && barCodeWidth > maxWidth
				? maxWidth / binary.length
				: width;
		let barWidth = 0;
		let x = 0;
		let yFrom = 0;

		for (let b = 0; b < binary.length; b++) {
			x = b * singleBarWidth;
			if (binary[b] === "1") {
				barWidth++;
			} else if (barWidth > 0) {
				rects[rects.length] = drawRect(
					x - singleBarWidth * barWidth,
					yFrom,
					singleBarWidth * barWidth,
					height,
				);
				barWidth = 0;
			}
		}

		if (barWidth > 0) {
			rects[rects.length] = drawRect(
				x - singleBarWidth * (barWidth - 1),
				yFrom,
				singleBarWidth * barWidth,
				height,
			);
		}

		return rects;
	};

	/**
	 * Runs `rawValue` through `Encoder`, validating it first.
	 */
	const encode = (rawValue: string, Encoder: BarcodeEncoderConstructor) => {
		if (typeof rawValue !== "string" || rawValue.length === 0) {
			throw new Error("Barcode value must be a non-empty string");
		}
		const encoder = new Encoder(rawValue, {
			width,
			format,
			height,
			lineColor,
			background,
			flat: true,
		});
		if (!encoder.valid()) {
			throw new Error("Invalid barcode for selected format.");
		}
		return encoder.encode();
	};

	const { bars, barCodeWidth } = useMemo(() => {
		const fail = (err: unknown) => {
			const error = err instanceof Error ? err : new Error(String(err));
			if (__DEV__) {
				console.error(error.message);
			}
			if (onError) {
				onError(error);
			}
			return { bars: [] as string[], barCodeWidth: 0 };
		};

		if (width <= 0 || height <= 0 || (typeof maxWidth === "number" && maxWidth <= 0)) {
			return fail(new Error("Barcode width, height, and maxWidth must be positive numbers."));
		}

		const encoder = barcodes[format];
		if (!encoder) {
			return fail(new Error("Invalid barcode format."));
		}

		try {
			const encoded = encode(value, encoder);
			const rawBarCodeWidth = encoded.data.length * width;
			return {
				bars: drawSvgBarCode(encoded),
				barCodeWidth:
					typeof maxWidth === "number" && rawBarCodeWidth > maxWidth
						? maxWidth
						: rawBarCodeWidth,
			};
		} catch (err) {
			return fail(err);
		}
	}, [value, width, height, format, maxWidth]);

	return (
		<View style={[{ backgroundColor: background, alignItems: "center" }, style]}>
			<Svg height={height} width={barCodeWidth} fill={lineColor}>
				<Path d={bars.join(" ")} />
			</Svg>
			{text && <Text style={[{ textAlign: "center" }, textStyle]}>{text}</Text>}
		</View>
	);
}