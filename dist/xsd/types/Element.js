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
var QName_1 = require("../QName");
var MemberBase_1 = require("./MemberBase");
var types = require("../types");
/** <xsd:element> */
var Element = (function (_super) {
    __extends(Element, _super);
    function Element() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minOccurs = "1";
        _this.maxOccurs = "1";
        _this.default = null;
        /** Abstract elements are disallowed in the XML document,
          * and another member of the same substitution group should be used. */
        _this.abstract = null; // boolean
        _this.substitutionGroup = null;
        return _this;
    }
    Element.prototype.init = function (state) {
        this.min = +this.minOccurs;
        if (this.maxOccurs == 'unbounded')
            this.max = Infinity;
        else
            this.max = +this.maxOccurs;
        this.define(state, 'element', this.min, this.max);
    };
    Element.prototype.resolve = function (state) {
        var element = this.resolveMember(state, 'element');
        if (this.substitutionGroup) {
            // Add this as an alternative to the substitution group base element.
            var ref = new QName_1.QName(this.substitutionGroup, state.source);
            var groupBase = this.scope.lookup(ref, 'element');
            if (!groupBase)
                throw new types.MissingReferenceError('element', ref);
            this.substitutes = groupBase;
            groupBase.isSubstituted = true;
        }
    };
    Element.prototype.isAbstract = function () {
        return (this.abstract == 'true' || this.abstract == '1');
    };
    Element.mayContain = function () { return [
        types.Annotation,
        types.SimpleType,
        types.ComplexType
    ]; };
    return Element;
}(MemberBase_1.MemberBase));
exports.Element = Element;
//# sourceMappingURL=Element.js.map