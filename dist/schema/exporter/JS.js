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
var Exporter_1 = require("./Exporter");
var Member_1 = require("../Member");
var MemberRef_1 = require("../MemberRef");
var Type_1 = require("../Type");
var JS = (function (_super) {
    __extends(JS, _super);
    function JS() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.construct = JS;
        return _this;
    }
    JS.prototype.writeImport = function (shortName, relativePath, absolutePath) {
        return ('var ' +
            shortName +
            ' = require(' +
            "'" + relativePath + "'" +
            ');');
    };
    JS.prototype.writeMember = function (member, typeNumTbl, memberNumTbl) {
        var substituteNum = 0;
        var memberTypeList = member.typeList.map(function (memberType) {
            return typeNumTbl[memberType.surrogateKey];
        });
        var name = member.safeName;
        if (member.name != name)
            name += ':' + member.name;
        var flags = 0;
        if (member.isAbstract)
            flags |= Member_1.Member.abstractFlag;
        if (member.isSubstituted)
            flags |= Member_1.Member.substitutedFlag;
        if (member.name == '*')
            flags |= Member_1.Member.anyFlag;
        if (member.substitutes)
            substituteNum = memberNumTbl[member.substitutes.surrogateKey];
        return ('\n\t[' +
            "'" + name + "', " +
            '[' + memberTypeList.join(', ') + ']' + ', ' +
            flags +
            (substituteNum ? ', ' + substituteNum : '') +
            ']');
    };
    JS.prototype.writeMemberRef = function (ref, memberNumTbl) {
        var member = ref.member;
        var name = ref.safeName;
        if (name == member.safeName)
            name = null;
        var flags = 0;
        if (ref.min < 1)
            flags |= MemberRef_1.MemberRef.optionalFlag;
        if (ref.max > 1)
            flags |= MemberRef_1.MemberRef.arrayFlag;
        return ('[' +
            memberNumTbl[member.surrogateKey] + ', ' +
            flags +
            (name ? ', ' + "'" + name + "'" : '') +
            ']');
    };
    JS.prototype.writeType = function (type, typeNumTbl, memberNumTbl) {
        var childSpecList = [];
        var attributeSpecList = [];
        var parentNum = 0;
        var flags = 0;
        if (type.primitiveType)
            flags |= Type_1.Type.primitiveFlag;
        if (type.isPlainPrimitive)
            flags |= Type_1.Type.plainPrimitiveFlag;
        if (type.isList) {
            flags |= Type_1.Type.listFlag | Type_1.Type.primitiveFlag | Type_1.Type.plainPrimitiveFlag;
            parentNum = typeNumTbl[type.childList[0].member.typeList[0].surrogateKey];
        }
        else {
            if (type.childList) {
                for (var _i = 0, _a = type.childList; _i < _a.length; _i++) {
                    var member = _a[_i];
                    childSpecList.push(this.writeMemberRef(member, memberNumTbl));
                }
            }
            if (type.attributeList) {
                for (var _b = 0, _c = type.attributeList; _b < _c.length; _b++) {
                    var member = _c[_b];
                    attributeSpecList.push(this.writeMemberRef(member, memberNumTbl));
                }
            }
            if (type.parent)
                parentNum = typeNumTbl[type.parent.surrogateKey];
        }
        return ('\n\t[' +
            flags + ', ' +
            parentNum + ', ' +
            '[' + childSpecList.join(', ') + '], ' +
            '[' + attributeSpecList.join(', ') + ']' +
            ']');
    };
    JS.prototype.buildTypeList = function (namespace) {
        var exportedTypeList = [];
        var hiddenTypeList = [];
        for (var _i = 0, _a = namespace.typeList; _i < _a.length; _i++) {
            var type = _a[_i];
            if (!type)
                continue;
            if (type.isExported)
                exportedTypeList.push(type);
            else
                hiddenTypeList.push(type);
        }
        exportedTypeList.sort(function (a, b) { return a.safeName.localeCompare(b.safeName); });
        hiddenTypeList.sort(function (a, b) { return a.safeName.localeCompare(b.safeName); });
        return ({
            all: exportedTypeList.concat(hiddenTypeList),
            exported: exportedTypeList
        });
    };
    JS.prototype.buildMemberList = function (namespace) {
        var exportedMemberList = [];
        var hiddenMemberList = [];
        for (var _i = 0, _a = namespace.memberList; _i < _a.length; _i++) {
            var member = _a[_i];
            if (!member)
                continue;
            if (member.isExported)
                exportedMemberList.push(member);
            else
                hiddenMemberList.push(member);
        }
        exportedMemberList.sort(function (a, b) { return a.name.localeCompare(b.name); });
        // TODO: merge identical hidden members.
        hiddenMemberList.sort(function (a, b) { return a.name.localeCompare(b.name); });
        return ({
            all: exportedMemberList.concat(hiddenMemberList),
            exported: exportedMemberList
        });
    };
    /** Output namespace contents to the given cache key. */
    JS.prototype.writeContents = function () {
        var doc = this.doc;
        var namespace = doc.namespace;
        var typeNumTbl = {};
        var memberNumTbl = {};
        // Separately defined document type is number 0.
        var typeNum = 1;
        // Member number 0 is skipped.
        var memberNum = 1;
        var importTbl = namespace.getUsedImportTbl();
        var importSpecList = [];
        var importNumTbl = {};
        var num = 0;
        for (var _i = 0, _a = Object.keys(importTbl); _i < _a.length; _i++) {
            var importName = _a[_i];
            var otherNamespaceId = importTbl[importName].id;
            var content = namespace.importContentTbl[otherNamespaceId];
            var importTypeNameList = [];
            var importMemberNameList = [];
            for (var _b = 0, _c = Object.keys(content.typeTbl || {}).sort(); _b < _c.length; _b++) {
                var name = _c[_b];
                var type = content.typeTbl[name];
                importTypeNameList.push("'" + type.safeName + "'");
                typeNumTbl[type.surrogateKey] = typeNum++;
            }
            for (var _d = 0, _e = Object.keys(content.memberTbl || {}).sort(); _d < _e.length; _d++) {
                var name = _e[_d];
                var member = content.memberTbl[name];
                importMemberNameList.push("'" + member.name + "'");
                memberNumTbl[member.surrogateKey] = memberNum++;
            }
            importSpecList.push('\n\t' + '[' + importName + ', ' +
                '[' + importTypeNameList.join(', ') + '], ' +
                '[' + importMemberNameList.join(', ') + ']' +
                ']');
            importNumTbl[otherNamespaceId] = num++;
        }
        var typeList = this.buildTypeList(namespace);
        var memberList = this.buildMemberList(namespace);
        for (var _f = 0, _g = typeList.all; _f < _g.length; _f++) {
            var type = _g[_f];
            typeNumTbl[type.surrogateKey] = typeNum++;
        }
        for (var _h = 0, _j = memberList.all; _h < _j.length; _h++) {
            var member = _j[_h];
            memberNumTbl[member.surrogateKey] = memberNum++;
        }
        var typeSpecList = [];
        typeSpecList.push(this.writeType(namespace.doc, typeNumTbl, memberNumTbl));
        for (var _k = 0, _l = typeList.all; _k < _l.length; _k++) {
            var type = _l[_k];
            typeSpecList.push(this.writeType(type, typeNumTbl, memberNumTbl));
        }
        var memberSpecList = [];
        for (var _m = 0, _o = memberList.all; _m < _o.length; _m++) {
            var member = _o[_m];
            /* if(member.name != '*') */
            memberSpecList.push(this.writeMember(member, typeNumTbl, memberNumTbl));
        }
        var exportTypeNameList = [];
        for (var _p = 0, _q = typeList.exported; _p < _q.length; _p++) {
            var type = _q[_p];
            name = type.safeName;
            if (type.name && type.name != name)
                name += ':' + type.name;
            exportTypeNameList.push('\n\t' + "'" + name + "'");
        }
        return ([].concat([
            'var cxml = require("cxml");',
        ], this.writeHeader(), [
            '',
            'cxml.register(' +
                "'" + namespace.name + "', " +
                'exports, ' +
                '[' + importSpecList.join(',') + '\n], ' +
                '[' + exportTypeNameList.join(',') + '\n], ' +
                '[' + typeSpecList.join(',') + '\n], ' +
                '[' + memberSpecList.join(',') + '\n]' +
                ');'
        ]).join('\n'));
    };
    JS.prototype.getOutName = function (name) {
        return (name + '.js');
    };
    return JS;
}(Exporter_1.Exporter));
exports.JS = JS;
//# sourceMappingURL=JS.js.map