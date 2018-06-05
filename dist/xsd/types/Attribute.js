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
var MemberBase_1 = require("./MemberBase");
var types = require("../types");
/** <xsd:attribute> */
var Attribute = (function (_super) {
    __extends(Attribute, _super);
    function Attribute() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.use = null;
        _this.default = null;
        return _this;
    }
    Attribute.prototype.init = function (state) {
        // Attributes appear exactly once unless they're optional.
        if (this.use == 'optional')
            this.min = 0;
        else
            this.min = 1; // assume 'required'
        this.max = 1;
        this.define(state, 'attribute', this.min, this.max);
    };
    Attribute.prototype.resolve = function (state) {
        var attribute = this.resolveMember(state, 'attribute');
    };
    Attribute.mayContain = function () { return [
        types.Annotation,
        types.SimpleType
    ]; };
    return Attribute;
}(MemberBase_1.MemberBase));
exports.Attribute = Attribute;
//# sourceMappingURL=Attribute.js.map