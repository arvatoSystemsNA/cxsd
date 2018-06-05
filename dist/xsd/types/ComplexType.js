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
var types = require("../types");
/** <xsd:complextype> */
var ComplexType = (function (_super) {
    __extends(ComplexType, _super);
    function ComplexType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComplexType.prototype.resolve = function (state) {
        if (state.attributeTbl['mixed'] === 'true') {
            var base = new QName_1.QName('xs:string', state.source);
            state.xsdElement.parent = this.scope.lookup(base, 'type');
        }
    };
    ComplexType.mayContain = function () { return [
        types.Annotation,
        SimpleContent,
        ComplexContent,
        types.Attribute,
        types.AnyAttribute,
        types.Sequence,
        types.Choice,
        types.AttributeGroup,
        types.Group
    ]; };
    return ComplexType;
}(types.TypeBase));
exports.ComplexType = ComplexType;
var ContentBase = (function (_super) {
    __extends(ContentBase, _super);
    function ContentBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContentBase.prototype.resolve = function (state) {
        state.parent.xsdElement.parent = this.parent;
        // Pass elements and attributes defined in child extension or restriction
        // onwards to the parent type definition.
        this.scope.addAllToParent('element');
        this.scope.addAllToParent('attribute');
        this.scope.addAllToParent('group');
        this.scope.addAllToParent('attributeGroup');
    };
    ContentBase.mayContain = function () { return [
        types.Extension,
        types.Restriction
    ]; };
    return ContentBase;
}(types.Base));
exports.ContentBase = ContentBase;
/** <xsd:simplecontent> */
var SimpleContent = (function (_super) {
    __extends(SimpleContent, _super);
    function SimpleContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SimpleContent;
}(ContentBase));
exports.SimpleContent = SimpleContent;
/** <xsd:complexcontent> */
var ComplexContent = (function (_super) {
    __extends(ComplexContent, _super);
    function ComplexContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ComplexContent;
}(ContentBase));
exports.ComplexContent = ComplexContent;
//# sourceMappingURL=ComplexType.js.map