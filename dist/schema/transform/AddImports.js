"use strict";
// This file is part of cxsd, copyright (c) 2016 BusFaster Ltd.
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
var Transform_1 = require("./Transform");
var AddImports = (function (_super) {
    __extends(AddImports, _super);
    function AddImports() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.construct = AddImports;
        _this.output = {};
        return _this;
    }
    AddImports.prototype.prepare = function () {
        this.visitType(this.doc);
        for (var _i = 0, _a = this.namespace.typeList; _i < _a.length; _i++) {
            var type = _a[_i];
            if (type)
                this.visitType(type);
        }
        this.namespace.importContentTbl = this.output;
        return (this.output);
    };
    /** Replace imported type and member IDs with sanitized names. */
    AddImports.prototype.finish = function (result) {
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var namespaceTbl = result_1[_i];
            for (var _a = 0, _b = Object.keys(namespaceTbl); _a < _b.length; _a++) {
                var namespaceId = _b[_a];
                var output = {
                    typeTbl: {},
                    memberTbl: {}
                };
                var typeTbl = namespaceTbl[namespaceId].typeTbl;
                for (var _c = 0, _d = Object.keys(typeTbl); _c < _d.length; _c++) {
                    var key = _d[_c];
                    var type = typeTbl[key];
                    output.typeTbl[type.safeName] = type;
                }
                var memberTbl = namespaceTbl[namespaceId].memberTbl;
                for (var _e = 0, _f = Object.keys(memberTbl); _e < _f.length; _e++) {
                    var key = _f[_e];
                    var member = memberTbl[key];
                    // Use name instead of safeName, because the latter may
                    // randomly differ between different containing types due to
                    // naming collisions (for example between attribute and element).
                    output.memberTbl[member.name] = member;
                }
                namespaceTbl[namespaceId] = output;
            }
        }
    };
    AddImports.prototype.addRef = function (namespace, member, type) {
        if (namespace && namespace != this.namespace) {
            // Type and/or member from another, imported namespace.
            // Make sure it gets exported.
            if (type)
                type.isExported = true;
            if (member)
                member.isExported = true;
            var id = namespace.id;
            var short = this.namespace.getShortRef(id);
            if (!short) {
                short = (member && member.namespace.getShortRef(id)) || namespace.short;
                if (short)
                    this.namespace.addRef(short, namespace);
            }
            if (short) {
                if (!this.output[id]) {
                    this.output[id] = {
                        typeTbl: {},
                        memberTbl: {}
                    };
                }
                if (type && type.namespace == namespace) {
                    this.output[id].typeTbl[type.surrogateKey] = type;
                }
                if (member && member.namespace == namespace) {
                    this.output[id].memberTbl[member.surrogateKey] = member;
                }
            }
        }
    };
    AddImports.prototype.visitMember = function (member) {
        this.addRef(member.namespace, member);
        if (member.substitutes)
            this.addRef(member.substitutes.namespace, member.substitutes);
        for (var _i = 0, _a = member.typeList; _i < _a.length; _i++) {
            var type = _a[_i];
            this.addRef(type.namespace, member, type);
        }
    };
    AddImports.prototype.visitType = function (type) {
        // Types holding primitives should inherit from them.
        // NOTE: This makes base primitive types inherit themselves.
        if (type.primitiveType && !type.parent)
            type.parent = type.primitiveType;
        if (type.parent)
            this.addRef(type.parent.namespace, null, type.parent);
        for (var _i = 0, _a = this.getTypeMembers(type); _i < _a.length; _i++) {
            var member = _a[_i];
            this.visitMember(member.member);
        }
    };
    return AddImports;
}(Transform_1.Transform));
exports.AddImports = AddImports;
//# sourceMappingURL=AddImports.js.map