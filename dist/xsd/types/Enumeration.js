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
var types = require("../types");
/** <xsd:enumeration> */
var Enumeration = (function (_super) {
    __extends(Enumeration, _super);
    function Enumeration() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = null;
        return _this;
    }
    Enumeration.prototype.init = function (state) {
        var parent = state.parent.xsdElement;
        if (parent instanceof types.Restriction)
            parent.addEnumeration(this.value);
    };
    Enumeration.mayContain = function () { return [
        types.Annotation
    ]; };
    return Enumeration;
}(types.Base));
exports.Enumeration = Enumeration;
//# sourceMappingURL=Enumeration.js.map