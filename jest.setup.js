// Touching `Text` here works around a lazy-evaluation quirk in react-native's
// own jest mock for `Text` (`react-native/jest/mockComponent.js`), where the
// first access to `RealComponent.prototype` crashes with
// "Cannot read properties of undefined (reading 'constructor')" unless the
// component has already been accessed once beforehand.
require("react-native").Text;
