"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("./types");
var schema = require("../schema");
function mergeDuplicateTypes(typeList) {
    if (typeList.length < 2)
        return (typeList);
    var tbl = {};
    for (var _i = 0, typeList_1 = typeList; _i < typeList_1.length; _i++) {
        var type = typeList_1[_i];
        tbl[type.surrogateKey] = type;
    }
    return (Object.keys(tbl).map(function (key) { return tbl[key]; }));
}
function exportMemberRef(spec, parentScope, namespace, context) {
    var member = spec.item;
    var outMember = member.getOutMember(context);
    var outRef = new schema.MemberRef(outMember, spec.min, spec.max);
    if (!outMember.typeList)
        exportMember(member, outRef, parentScope, namespace, context);
    return (outRef);
}
function exportMember(member, outRef, parentScope, namespace, context) {
    var outMember = outRef.member;
    var scope = member.getScope();
    var otherNamespace = scope.namespace;
    outMember.comment = scope.getComments();
    if (otherNamespace != parentScope.namespace) {
        outMember.namespace = context.copyNamespace(otherNamespace);
    }
    else
        outMember.namespace = namespace;
    outMember.typeList = mergeDuplicateTypes(member.getTypes()).map(function (type) {
        var outType = type.getOutType(context);
        var qName = type.qName;
        if (!qName && !type.name && !type.exported) {
            // Anonymous type defined only within this element.
            outType.containingRef = outRef;
            // Look through parent scopes for a containing type,
            // If the member was referenced from another namespace,
            // its scope points to definition in that namespace.
            var parentType = scope.getParentType(otherNamespace);
            if (parentType) {
                outType.containingType = parentType.getOutType(context);
            }
            exportType(type, outMember.namespace, context);
        }
        return (outType);
    });
    outMember.isAbstract = member.isAbstract();
    if (member instanceof types.Element) {
        if (member.substitutes) {
            outMember.substitutes = member.substitutes.getOutMember(context);
            outMember.namespace.pendingSubstituteList.push(outMember);
        }
        if (member.isSubstituted)
            outMember.isSubstituted = true;
    }
}
function exportAttributes(scope, namespace, context, type) {
    var memberTbl = scope.dumpMembers('attribute', 'attributeGroup');
    for (var _i = 0, _a = Object.keys(memberTbl).sort(); _i < _a.length; _i++) {
        var key = _a[_i];
        var ref = exportMemberRef(memberTbl[key], scope, namespace, context);
        type.addAttribute(ref);
    }
}
function exportChildren(scope, namespace, context, outType, setExported) {
    var memberTbl = scope.dumpMembers('element', 'group');
    for (var _i = 0, _a = Object.keys(memberTbl).sort(); _i < _a.length; _i++) {
        var key = _a[_i];
        var ref = exportMemberRef(memberTbl[key], scope, namespace, context);
        if (setExported)
            ref.member.isExported = true;
        outType.addChild(ref);
    }
}
/* TODO
function exportGroups(scope: Scope, namespace: schema.Namespace, context: schema.Context) {
//	var groupTbl = scope.dumpGroups();
    var groupList: schema.Member[] = [];

    return(groupList);
}
*/
function exportType(type, namespace, context) {
    var scope = type.getScope();
    var comment = scope.getComments();
    type.exported = true;
    var outType = type.getOutType(context);
    outType.comment = comment;
    outType.bytePos = type.bytePos;
    // If the type derives from a primitive type, it may have text content.
    var parentPrimitive = type.getParent(types.Primitive, false);
    if (parentPrimitive) {
        // Get equivalent JavaScript type.
        outType.primitiveType = parentPrimitive.getOutType(context);
        // Check if primitive type is inherited without any additional attributes
        // or children, so contents can be represented as a JavaScript primitive.
        // NOTE: Substitutions won't be applied to such types!
        parentPrimitive = type.getParent(types.Primitive, true);
    }
    if (parentPrimitive) {
        var literalList;
        var parentSimple = type.getParent(types.SimpleType, false);
        if (parentSimple) {
            // If parent is restricted to enumerated alternatives, output those instead.
            literalList = parentSimple.getEnumerationList();
            if (literalList)
                literalList = literalList.map(function (content) { return '"' + content + '"'; });
        }
        outType.literalList = literalList;
        outType.isPlainPrimitive = true;
        outType.primitiveType = parentPrimitive.getOutType(context);
    }
    var parent = type.parent;
    if (parent instanceof types.TypeBase && parent != parentPrimitive) {
        outType.parent = parent.getOutType(context);
    }
    exportAttributes(scope, namespace, context, outType);
    exportChildren(scope, namespace, context, outType, false);
    //	outType.groupList = exportGroups(scope, namespace, context);
    var listType = type.getListType();
    if (listType) {
        for (var _i = 0, listType_1 = listType; _i < listType_1.length; _i++) {
            var spec = listType_1[_i];
            var outMember = new schema.Member('');
            var outMemberRef = new schema.MemberRef(outMember, spec.min, spec.max);
            outMember.namespace = namespace;
            outMember.typeList = [
                exportType(spec.item, namespace, context)
            ];
            outType.addChild(outMemberRef);
        }
        outType.isList = true;
    }
    return (outType);
}
/** Export parsed xsd into a simpler internal schema format. */
function exportNamespace(namespace, context) {
    var outNamespace = context.copyNamespace(namespace);
    var doc = outNamespace.doc;
    if (doc)
        return (doc);
    //	if(!doc) {
    var scope = namespace.getScope();
    var sourceList = namespace.getSourceList();
    var importTbl = {};
    for (var _i = 0, sourceList_1 = sourceList; _i < sourceList_1.length; _i++) {
        var source = sourceList_1[_i];
        var namespaceRefTbl = source.getNamespaceRefs();
        for (var _a = 0, _b = Object.keys(namespaceRefTbl); _a < _b.length; _a++) {
            var name = _b[_a];
            var otherNamespace = namespaceRefTbl[name];
            outNamespace.addRef(name, context.copyNamespace(otherNamespace));
            importTbl[otherNamespace.id] = otherNamespace;
        }
    }
    outNamespace.sourceList = sourceList.map(function (source) { return source.url; }).sort();
    for (var _c = 0, _d = scope.dumpTypes('type') || []; _c < _d.length; _c++) {
        var spec = _d[_c];
        if (spec.name)
            exportType(spec.item, outNamespace, context).isExported = true;
    }
    doc = new schema.Type(null);
    doc.namespace = outNamespace;
    exportAttributes(scope, outNamespace, context, doc);
    exportChildren(scope, outNamespace, context, doc, true);
    outNamespace.doc = doc;
    for (var _e = 0, _f = Object.keys(importTbl); _e < _f.length; _e++) {
        var namespaceId = _f[_e];
        exportNamespace(importTbl[namespaceId], context);
    }
    for (var _g = 0, _h = outNamespace.pendingSubstituteList; _g < _h.length; _g++) {
        var member = _h[_g];
        var proxy = member.substitutes.getProxy();
        if (member.substitutes.namespace == member.namespace) {
            if (member.isSubstituted || member.isAbstract) {
                proxy.addMixin(member.getProxy());
            }
            else {
                proxy.addChildSpec(member);
            }
        }
        else {
            member.namespace.addAugmentation(proxy, member);
        }
    }
    //	}
    return (doc);
}
exports.exportNamespace = exportNamespace;
//# sourceMappingURL=Exporter.js.map