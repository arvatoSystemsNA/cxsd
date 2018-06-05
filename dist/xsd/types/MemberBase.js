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
var TypedBase_1 = require("./TypedBase");
var schema = require("../../schema");
var MemberBase = (function (_super) {
    __extends(MemberBase, _super);
    function MemberBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = null;
        _this.name = null;
        _this.ref = null;
        _this.type = null;
        return _this;
    }
    MemberBase.prototype.resolveMember = function (state, kind) {
        var member = this;
        if (this.ref) {
            // Replace this with another, referenced element.
            var ref = new QName_1.QName(this.ref, state.source);
            member = this.scope.lookup(ref, kind);
            if (member)
                member.define(state, kind, this.min, this.max, this.scope);
            else
                throw new types.MissingReferenceError(kind, ref);
        }
        this.typeRef = this.resolveType(this.type, state);
        return (member);
    };
    MemberBase.prototype.getOutMember = function (schemaContext) {
        var outMember = this.outMember;
        if (!outMember) {
            outMember = new schema.Member(this.name);
            if (this.scope) {
                schemaContext.copyNamespace(this.scope.namespace).addMember(outMember);
            }
            this.outMember = outMember;
        }
        return (outMember);
    };
    MemberBase.prototype.getTypes = function () {
        var typeList;
        // Filter out types of unresolved elements.
        if (this.typeRef &&
            this.typeRef instanceof types.TypeBase) {
            typeList = [this.typeRef];
        }
        else
            typeList = [];
        return (typeList);
    };
    MemberBase.prototype.isAbstract = function () {
        return (false);
    };
    return MemberBase;
}(TypedBase_1.TypedBase));
exports.MemberBase = MemberBase;
//# sourceMappingURL=MemberBase.js.map