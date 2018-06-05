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
var TypedBase_1 = require("./TypedBase");
/** <xsd:union> */
var Union = (function (_super) {
    __extends(Union, _super);
    function Union() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.memberType = null;
        return _this;
    }
    Union.prototype.resolve = function (state) {
        // var type = this.resolveType(this.memberType, state);
        // Convert union types to strings for now.
        var type = this.resolveType('string', state);
        state.parent.xsdElement.parent = type;
    };
    Union.mayContain = function () { return [
        types.SimpleType
    ]; };
    return Union;
}(TypedBase_1.TypedBase));
exports.Union = Union;
//# sourceMappingURL=Union.js.map