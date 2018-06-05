"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DerivationBase_1 = require("./DerivationBase");
/** <xsd:extension> */
var Extension = (function (_super) {
    __extends(Extension, _super);
    function Extension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Extension;
}(DerivationBase_1.DerivationBase));
exports.Extension = Extension;
//# sourceMappingURL=Extension.js.map