"use strict";
// This file is part of cxsd, copyright (c) 2015 BusFaster Ltd.
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
/** Schema root element */
var Root = (function (_super) {
    __extends(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.mayContain = function () { return [
        Schema
    ]; };
    return Root;
}(types.Base));
exports.Root = Root;
/** <xsd:schema> */
var Schema = (function (_super) {
    __extends(Schema, _super);
    function Schema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Schema.prototype.init = function (state) {
        // Ultimately the schema exports elements and types in the global scope
        // (meaning they are children of this, the root element).
        state.source.parse(state.attributeTbl);
        var scope = state.source.targetNamespace.getScope();
        state.setScope(scope);
        this.scope = scope;
    };
    Schema.mayContain = function () { return [
        types.Annotation,
        types.Import,
        types.Include,
        types.AttributeGroup,
        types.SimpleType,
        types.ComplexType,
        types.Group,
        types.Attribute,
        types.Element
    ]; };
    return Schema;
}(types.Base));
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map