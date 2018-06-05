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
var Exporter_1 = require("./Exporter");
var docName = 'document';
var baseName = 'BaseType';
/** Export parsed schema to a TypeScript d.ts definition file. */
var TS = (function (_super) {
    __extends(TS, _super);
    function TS() {
        /** Format an XSD annotation as JSDoc. */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.construct = TS;
        return _this;
    }
    TS.formatComment = function (indent, comment) {
        var lineList = comment.split('\n');
        var lineCount = lineList.length;
        var blankCount = 0;
        var contentCount = 0;
        var output = [];
        var prefix = '/\**';
        for (var _i = 0, lineList_1 = lineList; _i < lineList_1.length; _i++) {
            var line = lineList_1[_i];
            // Remove leading and trailing whitespace.
            line = line.trim();
            if (!line)
                ++blankCount;
            else {
                if (blankCount && contentCount)
                    output.push(indent + prefix);
                output.push(indent + prefix + ' ' + line);
                prefix = '  *';
                ++contentCount;
                blankCount = 0;
            }
        }
        if (output.length)
            output[output.length - 1] += ' *\/';
        return (output.join('\n'));
    };
    TS.prototype.writeImport = function (shortName, relativePath, absolutePath) {
        return ('import * as ' +
            shortName +
            ' from ' +
            "'" + relativePath + "'" +
            ';');
    };
    /** Output list of original schema file locations. */
    TS.prototype.exportSourceList = function (sourceList) {
        var output = [];
        output.push('// Source files:');
        for (var _i = 0, sourceList_1 = sourceList; _i < sourceList_1.length; _i++) {
            var urlRemote = sourceList_1[_i];
            output.push('// ' + urlRemote);
        }
        output.push('');
        return (output);
    };
    TS.prototype.writeTypeRef = function (type, namePrefix) {
        var output = [];
        var namespace = type.namespace;
        var name = namePrefix + type.safeName;
        if (!namespace || namespace == this.namespace) {
            output.push(name);
        }
        else {
            // Type from another, imported namespace.
            var short = this.namespace.getShortRef(namespace.id);
            if (short) {
                output.push(short + '.' + name);
            }
            else {
                console.error('MISSING IMPORT ' + namespace.name + ' for type ' + type.name);
                output.push('any');
            }
        }
        return (output.join(''));
    };
    TS.prototype.writeParents = function (parentDef, mixinList) {
        var parentList = [];
        if (parentDef)
            parentList.push(parentDef);
        for (var _i = 0, _a = mixinList || []; _i < _a.length; _i++) {
            var type = _a[_i];
            parentList.push(this.writeTypeRef(type, '_'));
        }
        if (!parentList.length)
            parentList.push(baseName);
        return (' extends ' + parentList.join(', '));
    };
    TS.prototype.writeTypeList = function (ref) {
        var _this = this;
        var typeList = ref.member.typeList;
        if (ref.max > 1 && ref.member.proxy)
            typeList = [ref.member.proxy];
        var outTypeList = typeList.map(function (type) {
            if (type.isPlainPrimitive && (!type.literalList || !type.literalList.length)) {
                return (type.primitiveType.name);
            }
            else
                return (_this.writeTypeRef(type, ''));
        });
        if (outTypeList.length == 0)
            return (null);
        var outTypes = outTypeList.sort().join(' | ');
        if (ref.max > 1) {
            if (outTypeList.length > 1)
                return ('(' + outTypes + ')[]');
            else
                return (outTypes + '[]');
        }
        else
            return (outTypes);
    };
    TS.prototype.writeMember = function (ref, isGlobal) {
        var output = [];
        var member = ref.member;
        var comment = member.comment;
        var indent = '\t';
        if (ref.isHidden)
            return ('');
        if (isGlobal && member.isAbstract)
            return ('');
        if (member.name == '*')
            return ('');
        if (comment) {
            output.push(TS.formatComment(indent, comment));
            output.push('\n');
        }
        output.push(indent + ref.safeName);
        if (ref.min == 0)
            output.push('?');
        output.push(': ');
        var outTypes = this.writeTypeList(ref);
        if (!outTypes)
            return ('');
        output.push(outTypes);
        output.push(';');
        return (output.join(''));
    };
    TS.prototype.writeTypeContent = function (type) {
        var output = [];
        if (type.isPlainPrimitive) {
            var literalList = type.literalList;
            if (literalList && literalList.length > 0) {
                if (literalList.length > 1) {
                    output.push('(' + literalList.join(' | ') + ')');
                }
                else
                    output.push(literalList[0]);
            }
            else
                output.push(type.primitiveType.name);
        }
        else if (type.isList) {
            output.push(this.writeTypeList(type.childList[0]));
        }
        else {
            var outMemberList = [];
            var output = [];
            var parentType = type.parent;
            for (var _i = 0, _a = type.attributeList; _i < _a.length; _i++) {
                var attribute = _a[_i];
                var outAttribute = this.writeMember(attribute, false);
                if (outAttribute)
                    outMemberList.push(outAttribute);
            }
            for (var _b = 0, _c = type.childList; _b < _c.length; _b++) {
                var child = _c[_b];
                var outChild = this.writeMember(child, false);
                if (outChild)
                    outMemberList.push(outChild);
            }
            output.push('{');
            if (outMemberList.length) {
                output.push('\n');
                output.push(outMemberList.join('\n'));
                output.push('\n');
            }
            output.push('}');
        }
        return (output.join(''));
    };
    TS.prototype.writeType = function (type) {
        var namespace = this.namespace;
        var output = [];
        var comment = type.comment;
        var parentDef;
        var exportPrefix = type.isExported ? 'export ' : '';
        var name = type.safeName;
        if (comment) {
            output.push(TS.formatComment('', comment));
            output.push('\n');
        }
        var content = this.writeTypeContent(type);
        if (namespace.isPrimitiveSpace) {
            output.push(exportPrefix + 'interface _' + name + this.writeParents(null, type.mixinList) + ' { ' + 'content' + ': ' + type.primitiveType.name + '; }' + '\n');
        }
        else if (type.isList) {
            output.push(exportPrefix + 'type ' + name + ' = ' + content + ';' + '\n');
        }
        else if (type.isPlainPrimitive) {
            parentDef = this.writeTypeRef(type.parent, '_');
            output.push(exportPrefix + 'type ' + name + ' = ' + content + ';' + '\n');
            if (type.literalList && type.literalList.length) {
                output.push('interface _' + name + this.writeParents(parentDef, type.mixinList) + ' { ' + 'content' + ': ' + name + '; }' + '\n');
            }
            else {
                // NOTE: Substitution groups are ignored here!
                output.push('type _' + name + ' = ' + parentDef + ';' + '\n');
            }
        }
        else {
            if (type.parent)
                parentDef = this.writeTypeRef(type.parent, '_');
            output.push('interface _' + name + this.writeParents(parentDef, type.mixinList) + ' ' + content + '\n');
            output.push(exportPrefix + 'interface ' + name + ' extends _' + name + ' { constructor: { new(): ' + name + ' }; }' + '\n');
            if (type.isExported)
                output.push(exportPrefix + 'var ' + name + ': { new(): ' + name + ' };' + '\n');
        }
        return (output.join(''));
    };
    TS.prototype.writeSubstitutions = function (type, refList, output) {
        for (var _i = 0, refList_1 = refList; _i < refList_1.length; _i++) {
            var ref = refList_1[_i];
            var proxy = ref.member.proxy;
            if (!ref.member.isAbstract)
                output.push(this.writeMember(ref, false));
            if (proxy && proxy != type)
                this.writeSubstitutions(proxy, proxy.childList, output);
        }
        for (var _a = 0, _b = type.mixinList; _a < _b.length; _a++) {
            var mixin = _b[_a];
            if (mixin != type)
                this.writeSubstitutions(mixin, mixin.childList, output);
        }
    };
    TS.prototype.writeAugmentations = function (output) {
        var namespace = this.namespace;
        for (var _i = 0, _a = Object.keys(namespace.augmentTbl); _i < _a.length; _i++) {
            var namespaceId = _a[_i];
            var augmentTbl = namespace.augmentTbl[namespaceId];
            var typeIdList = Object.keys(augmentTbl);
            var type = augmentTbl[typeIdList[0]].type;
            var other = type.namespace;
            output.push('declare module ' + "'" + this.getPathTo(other.name) + "'" + ' {');
            for (var _b = 0, typeIdList_1 = typeIdList; _b < typeIdList_1.length; _b++) {
                var typeId = typeIdList_1[_b];
                type = augmentTbl[typeId].type;
                output.push('export interface _' + type.safeName + ' {');
                for (var _c = 0, _d = augmentTbl[typeId].refList; _c < _d.length; _c++) {
                    var ref = _d[_c];
                    ref.safeName = ref.member.safeName;
                }
                this.writeSubstitutions(type, augmentTbl[typeId].refList, output);
                output.push('}');
            }
            output.push('}');
        }
    };
    TS.prototype.writeContents = function () {
        var output = this.writeHeader();
        var doc = this.doc;
        var namespace = this.namespace;
        var prefix;
        output.push('');
        output = output.concat(this.exportSourceList(namespace.sourceList));
        output.push('');
        this.writeAugmentations(output);
        output.push('interface ' + baseName + ' {');
        output.push('\t_exists: boolean;');
        output.push('\t_namespace: string;');
        output.push('}');
        for (var _i = 0, _a = namespace.typeList.slice(0).sort(function (a, b) { return a.safeName.localeCompare(b.safeName); }); _i < _a.length; _i++) {
            var type = _a[_i];
            if (!type)
                continue;
            output.push(this.writeType(type));
        }
        output.push('export interface ' + docName + ' extends ' + baseName + ' {');
        for (var _b = 0, _c = doc.childList; _b < _c.length; _b++) {
            var child = _c[_b];
            var outElement = this.writeMember(child, true);
            if (outElement) {
                output.push(outElement);
            }
        }
        output.push('}');
        output.push('export var ' + docName + ': ' + docName + ';\n');
        return (output.join('\n'));
    };
    TS.prototype.getOutName = function (name) {
        return (name + '.d.ts');
    };
    return TS;
}(Exporter_1.Exporter));
exports.TS = TS;
//# sourceMappingURL=TS.js.map