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
function capitalize(match, initial) {
    return (initial.toUpperCase());
}
function sanitizeName(name) {
    var reserved = {
        'constructor': true
    };
    name = name
        .replace(/-([a-z])/, capitalize)
        .replace(/[^_0-9A-Za-z]/g, '')
        .replace(/^[^A-Za-z]+/, '');
    if (reserved.hasOwnProperty(name))
        name = '_' + name;
    return (name);
}
var Sanitize = (function (_super) {
    __extends(Sanitize, _super);
    function Sanitize() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            pendingAnonTbl: {},
            pendingAnonList: [],
            typeListList: []
        };
        _this.construct = Sanitize;
        return _this;
    }
    Sanitize.prototype.prepare = function () {
        var memberList = this.namespace.memberList.filter(function (member) { return !!member; });
        for (var _i = 0, memberList_1 = memberList; _i < memberList_1.length; _i++) {
            var member = memberList_1[_i];
            if ((member.isSubstituted || member.isAbstract)) {
                member.getProxy().containingRef.safeName = sanitizeName(member.name);
            }
            if (member.substitutes) {
                member.safeName = sanitizeName(member.name);
            }
        }
        var typeList = this.namespace.typeList.filter(function (type) { return !!type; });
        this.visitType(this.doc);
        for (var _a = 0, typeList_1 = typeList; _a < typeList_1.length; _a++) {
            var type = typeList_1[_a];
            this.visitType(type);
        }
        this.state.typeListList.push(typeList);
    };
    Sanitize.prototype.renameDuplicates = function (typeList) {
        // TODO: handle collisions between names of types and members of doc.
        // Sort types by sanitized name and duplicates by original name
        // (missing original names sorted after existing original names).
        // TODO: merge types with identical contents.
        typeList = typeList.sort(function (a, b) {
            return a.safeName.localeCompare(b.safeName) ||
                +!!b.name - +!!a.name ||
                (a.name && a.name.localeCompare(b.name));
        });
        // Add numeric suffix to duplicate names.
        var name = '';
        var suffix = 2;
        for (var _i = 0, typeList_2 = typeList; _i < typeList_2.length; _i++) {
            var type = typeList_2[_i];
            if (type.safeName == name) {
                type.safeName += '_' + (suffix++);
            }
            else {
                name = type.safeName;
                suffix = 2;
            }
        }
    };
    Sanitize.prototype.finish = function () {
        for (var _i = 0, _a = Object.keys(this.state.pendingAnonTbl); _i < _a.length; _i++) {
            var key = _a[_i];
            var spec = this.state.pendingAnonTbl[key];
            if (spec) {
                for (var _b = 0, _c = spec.memberTypeList; _b < _c.length; _b++) {
                    var memberType = _c[_b];
                    if (memberType.containingType.safeName)
                        this.addNameToType(memberType);
                }
            }
        }
        for (var _d = 0, _e = this.state.pendingAnonList; _d < _e.length; _d++) {
            var type = _e[_d];
            if (!type.safeName)
                type.safeName = 'Type';
        }
        for (var _f = 0, _g = this.state.typeListList; _f < _g.length; _f++) {
            var typeList = _g[_f];
            this.renameDuplicates(typeList);
        }
    };
    Sanitize.prototype.visitType = function (type) {
        var refList = [];
        var ref;
        var member;
        var other;
        var otherMember;
        var iter;
        if (type.name)
            type.safeName = sanitizeName(type.name);
        else
            this.state.pendingAnonList.push(type);
        for (var _i = 0, _a = type.attributeList; _i < _a.length; _i++) {
            ref = _a[_i];
            // Add a $ prefix to attributes of this type
            // conflicting with children of this or parent types.
            other = type;
            iter = 100;
            while (other && --iter) {
                otherMember = other.childTbl[ref.member.name];
                if (otherMember) {
                    ref.prefix = '$';
                    break;
                }
                other = other.parent;
            }
            refList.push(ref);
        }
        for (var _b = 0, _c = type.childList; _b < _c.length; _b++) {
            ref = _c[_b];
            // Add a $ prefix to attributes of parent types
            // conflicting with children of this type.
            other = type;
            iter = 100;
            member = ref.member;
            while ((other = other.parent) && --iter) {
                otherMember = other.attributeTbl[member.name];
                if (otherMember && !otherMember.prefix) {
                    otherMember.prefix = '$';
                    if (otherMember.safeName)
                        otherMember.safeName = otherMember.prefix + otherMember.safeName;
                }
            }
            // Ensure maximum allowed occurrence count is no less than in parent types,
            // because overriding a parent class member with a different type
            // (array vs non-array) doesn't compile.
            if (ref.max < 2) {
                other = type;
                iter = 100;
                // TODO: Topologically sort dependencies to start processing from root types,
                // to avoid continuing search after one parent with a matching member is found.
                while ((other = other.parent) && --iter) {
                    otherMember = other.childTbl[member.name];
                    if (otherMember && otherMember.max > ref.max) {
                        ref.max = otherMember.max;
                        if (ref.max > 1)
                            break;
                    }
                }
            }
            if (ref.max <= 1 && !type.isProxy && (member.isSubstituted || member.isAbstract)) {
                var proxy = member.getProxy();
                type.addMixin(proxy);
                // TODO: Remove following line!
                ref.isHidden = true;
            }
            refList.push(ref);
        }
        // Add names to any unnamed types of members, based on the member name.
        for (var _d = 0, refList_1 = refList; _d < refList_1.length; _d++) {
            var ref = refList_1[_d];
            // TODO: Detect duplicate names from other namespaces and prefix them.
            var safeName = ref.member.safeName;
            if (!safeName) {
                if (ref.member.name == '*')
                    safeName = '*';
                else
                    safeName = sanitizeName(ref.member.name);
                ref.member.safeName = safeName;
            }
            if (safeName == '*')
                ref.safeName = safeName;
            else
                ref.safeName = (ref.prefix || '') + safeName;
            this.addNameToMemberTypes(type, ref.member);
            var proxy = ref.member.proxy;
            if (proxy && !proxy.sanitized) {
                proxy.sanitized = true;
                this.visitType(proxy);
            }
        }
    };
    Sanitize.prototype.addNameToType = function (type) {
        var containingType = type.containingType;
        var containingRef = type.containingRef;
        var spec;
        if (containingType && !containingType.safeName) {
            // Type is inside another which is not named (yet) so try again later.
            spec = this.state.pendingAnonTbl[memberType.containingType.surrogateKey];
            if (!spec) {
                spec = { type: memberType.containingType, memberTypeList: [] };
                this.state.pendingAnonTbl[memberType.containingType.surrogateKey] = spec;
            }
            spec.memberTypeList.push(memberType);
        }
        else if (containingType || (containingRef && containingRef.safeName)) {
            // Type is inside a named type or referenced by a named member.
            // Give it a name based on those.
            if (containingRef) {
                type.namespace = containingRef.member.namespace;
                type.safeName = [
                    containingType ? containingType.safeName : '',
                    (containingRef.safeName || '').replace(/^([a-z])/, capitalize),
                    type.isProxy ? 'Proxy' : '',
                    'Type'
                ].join('');
            }
            spec = this.state.pendingAnonTbl[type.surrogateKey];
            if (spec) {
                for (var _i = 0, _a = spec.memberTypeList; _i < _a.length; _i++) {
                    var memberType = _a[_i];
                    this.addNameToType(memberType);
                }
                this.state.pendingAnonTbl[type.surrogateKey] = null;
            }
        }
    };
    Sanitize.prototype.addNameToMemberTypes = function (type, member) {
        if (member.proxy && !member.proxy.safeName && member.namespace == this.namespace) {
            this.addNameToType(member.proxy);
        }
        for (var _i = 0, _a = member.typeList; _i < _a.length; _i++) {
            var memberType = _a[_i];
            if (!memberType.safeName && memberType.namespace == this.namespace) {
                this.addNameToType(memberType);
            }
        }
    };
    return Sanitize;
}(Transform_1.Transform));
exports.Sanitize = Sanitize;
//# sourceMappingURL=Sanitize.js.map