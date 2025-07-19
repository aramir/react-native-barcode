# React Native Barcode Generator

> This package is a fork of an
> excellent [@kichiyaki/react-native-barcode-generator](https://github.com/Kichiyaki/react-native-barcode-generator)
> by Dawid Wysokiński ([@kichiyaki](https://github.com/Kichiyaki)) with minor fixes/changes and deps brought up to
> current baseline.

Uses [jsbarcode](https://github.com/lindell/JsBarcode) to generate barcode binary data with native svg rendering via
[react-native-svg](https://github.com/software-mansion/react-native-svg).

## Installation

Using npm:

```shell
npm install --save react-native-svg rn-barcode
```

or using yarn:

```shell
yarn add react-native-svg rn-barcode
```

## Properties

| Prop       | Type        | Description                                            |
|------------|-------------|--------------------------------------------------------|
| value      | `string`    | the text to be encoded                                 |
| width      | `number`    | the width of a single bar                              |
| maxWidth   | `number`    | the max width of the barcode                           |
| height     | `number`    | the height of the barcode                              |
| format     | `string`    | barcode format                                         |
| lineColor  | `string`    | set the color of a single bar                          |
| background | `string`    | container background (`rgba(0,0,0,0)` for transparent) |
| text       | `component` | an optional text that will be render under the barcode |
| textStyle  | `object`    | styles to be applied on the text component             |
| style      | `object`    | styles to be applied on the container                  |
| onError    | `function`  | an optional error handler                              |

## Supported barcode formats

 - [CODE128](https://github.com/lindell/JsBarcode/wiki/CODE128)
   - CODE128 (automatic mode switching)
   - CODE128 A/B/C (force mode)
 - [EAN](https://github.com/lindell/JsBarcode/wiki/EAN)
   - EAN-13
   - EAN-8
   - EAN-5
   - EAN-2
   - UPC (A)
   - UPC (E)
 - [CODE39](https://github.com/lindell/JsBarcode/wiki/CODE39)
 - [ITF](https://github.com/lindell/JsBarcode/wiki/ITF-14)
   - ITF
   - ITF-14
 - [MSI](https://github.com/lindell/JsBarcode/wiki/MSI)
   - MSI10
   - MSI11
   - MSI1010
   - MSI1110
 - [Pharmacode](https://github.com/lindell/JsBarcode/wiki/pharmacode)
 - [Codabar](https://github.com/lindell/JsBarcode/wiki/codabar)
 - CODE93

## Sample Usage

```js
<Barcode format="CODE128" value={"HelloWorld"} />
```