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
/** <xsd:simpletype> */
var SimpleType = (function (_super) {
    __extends(SimpleType, _super);
    function SimpleType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimpleType.prototype.setEnumerationList = function (enumerationList) {
        this.enumerationList = enumerationList;
    };
    SimpleType.prototype.getEnumerationList = function () {
        return (this.enumerationList);
    };
    SimpleType.mayContain = function () { return [
        types.Annotation,
        types.Restriction,
        types.List,
        types.Union
    ]; };
    return SimpleType;
}(types.TypeBase));
exports.SimpleType = SimpleType;
//# sourceMappingURL=SimpleType.js.map