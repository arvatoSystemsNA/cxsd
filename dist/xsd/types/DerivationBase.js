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
/** Derived type support, allows types to inherit others. */
var DerivationBase = (function (_super) {
    __extends(DerivationBase, _super);
    function DerivationBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = null;
        _this.base = null;
        return _this;
    }
    DerivationBase.prototype.resolve = function (state) {
        var base = new QName_1.QName(this.base, state.source);
        state.parent.xsdElement.parent = this.scope.lookup(base, 'type') || base;
        this.scope.addAllToParent('element');
        this.scope.addAllToParent('attribute');
        this.scope.addAllToParent('group');
        this.scope.addAllToParent('attributeGroup');
    };
    DerivationBase.mayContain = function () { return [
        types.Group,
        types.All,
        types.Choice,
        types.Sequence,
        types.Attribute,
        types.AttributeGroup,
        types.AnyAttribute
    ]; };
    return DerivationBase;
}(types.Base));
exports.DerivationBase = DerivationBase;
//# sourceMappingURL=DerivationBase.js.map