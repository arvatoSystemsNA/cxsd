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
var Base_1 = require("./Base");
var schema = require("../../schema");
var TypeBase = (function (_super) {
    __extends(TypeBase, _super);
    function TypeBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = null;
        _this.name = null;
        return _this;
    }
    TypeBase.prototype.init = function (state) {
        if (!this.scope)
            this.scope = state.getScope();
        this.qName = this.define(state, 'type');
        // Set type of parent element, in case it has none.
        this.scope.setParentType(this);
        // Add reference from current scope to allow naming nested anonymous types.
        this.scope.setType(this);
        this.surrogateKey = TypeBase.nextKey++;
    };
    TypeBase.prototype.getOutType = function (schemaContext) {
        var outType = this.outType;
        if (!outType) {
            outType = new schema.Type(this.name);
            if (this.scope) {
                schemaContext.copyNamespace(this.scope.namespace).addType(outType);
            }
            this.outType = outType;
        }
        return (outType);
    };
    /** Find parent type inheriting from a base type. */
    TypeBase.prototype.getParent = function (base, breakAtContent) {
        var next = this;
        var type;
        /** Maximum iterations in case type inheritance forms a loop. */
        var iter = 100;
        while (--iter) {
            type = next;
            if (!(type instanceof TypeBase))
                break;
            else if (type instanceof base)
                return (type);
            else if (breakAtContent && type.scope && (type.scope.dumpTypes('attribute') ||
                type.scope.dumpTypes('attributeGroup')))
                break;
            else
                next = type.parent;
        }
        return (null);
    };
    TypeBase.prototype.getListType = function () {
        var next = this;
        var type;
        /** Maximum iterations in case type inheritance forms a loop. */
        var iter = 100;
        while (--iter) {
            type = next;
            if (!(type instanceof TypeBase))
                break;
            else {
                var listType = type.scope && type.scope.dumpTypes('list');
                if (listType)
                    return (listType);
                else
                    next = type.parent;
            }
        }
        return (null);
    };
    TypeBase.nextKey = 0;
    return TypeBase;
}(Base_1.Base));
exports.TypeBase = TypeBase;
//# sourceMappingURL=TypeBase.js.map