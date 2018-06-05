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
var cxml = require("cxml");
var Namespace = (function (_super) {
    __extends(Namespace, _super);
    function Namespace() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** All types used in the document. */
        _this.typeList = [];
        /** All members used in the document. */
        _this.memberList = [];
        /** Types from other namespaces augmented with members from this namespace. */
        _this.augmentTbl = {};
        _this.pendingSubstituteList = [];
        /** Short names used to reference other namespaces in schemas defining this namespace. */
        _this.shortNameTbl = {};
        return _this;
    }
    Namespace.prototype.addRef = function (shortName, namespace) {
        var id = namespace.id;
        if (!this.shortNameTbl[id])
            this.shortNameTbl[id] = [];
        this.shortNameTbl[id].push(shortName);
    };
    Namespace.prototype.getShortRef = function (id) {
        var nameList = this.shortNameTbl[id];
        if (nameList && nameList.length)
            return (nameList[0]);
        else
            return (null);
    };
    Namespace.prototype.getUsedImportTbl = function () {
        var importTbl = this.importTbl;
        if (!importTbl) {
            importTbl = {};
            if (this.importContentTbl) {
                for (var _i = 0, _a = Object.keys(this.importContentTbl); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var id = +key;
                    var short = this.getShortRef(id);
                    importTbl[this.getShortRef(id)] = this.context.namespaceById(id);
                }
                this.importTbl = importTbl;
            }
        }
        return (importTbl);
    };
    Namespace.prototype.getUsedImportList = function () {
        var _this = this;
        if (this.importContentTbl) {
            var importTbl = this.getUsedImportTbl();
            return (Object.keys(importTbl).map(function (shortName) {
                return importTbl[shortName];
            }));
        }
        else {
            return (Object.keys(this.shortNameTbl).map(function (id) {
                return _this.context.namespaceById(+id);
            }));
        }
    };
    Namespace.prototype.addType = function (type) {
        var id = type.surrogateKey;
        this.typeList[id] = type;
        type.namespace = this;
    };
    Namespace.prototype.addMember = function (member) {
        var id = member.surrogateKey;
        this.memberList[id] = member;
        member.namespace = this;
    };
    /** Augment type in another namespace with member from this namespace. */
    Namespace.prototype.addAugmentation = function (type, member) {
        // TODO: Adding a member with an identical name but different namespace should be handled somehow!
        if (type.childTbl[member.name])
            return;
        var augmentTbl = this.augmentTbl[type.namespace.id];
        if (!augmentTbl) {
            augmentTbl = {};
            this.augmentTbl[type.namespace.id] = augmentTbl;
        }
        var augmentSpec = augmentTbl[type.surrogateKey];
        if (!augmentSpec) {
            augmentSpec = { type: type, refList: [] };
            augmentTbl[type.surrogateKey] = augmentSpec;
        }
        augmentSpec.refList.push(member.getRef());
    };
    return Namespace;
}(cxml.NamespaceBase));
exports.Namespace = Namespace;
//# sourceMappingURL=Namespace.js.map