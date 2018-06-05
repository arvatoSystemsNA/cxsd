"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
function addMemberToTable(tbl, name, specNew, min, max) {
    if (min === void 0) { min = 1; }
    if (max === void 0) { max = 1; }
    var spec = tbl[name];
    if (spec) {
        spec.min += specNew.min * min;
        spec.max += specNew.max * max;
    }
    else {
        spec = {
            min: specNew.min * min,
            max: specNew.max * max,
            item: specNew.item
        };
        tbl[name] = spec;
    }
}
/** Scope handles looking up references by type and name, and binding member
  * types and elements to types or namespaces. */
var Scope = (function () {
    function Scope(parent, namespace) {
        this.visible = {};
        this.expose = {};
        if (!namespace && parent)
            namespace = parent.namespace;
        this.parent = parent;
        this.namespace = namespace;
    }
    Scope.prototype.add = function (name, kind, target, min, max) {
        if (name) {
            var visibleTbl = this.visible[kind];
            if (!visibleTbl) {
                visibleTbl = {};
                this.visible[kind] = visibleTbl;
            }
            visibleTbl[name] = target;
        }
        if (max) {
            var exposeList = this.expose[kind];
            if (!exposeList) {
                exposeList = [];
                this.expose[kind] = exposeList;
            }
            exposeList.push({
                name: name,
                min: min,
                max: max,
                item: target
            });
        }
    };
    Scope.prototype.addToParent = function (name, kind, target, min, max) {
        this.parent.add(name, kind, target, min, max);
    };
    Scope.prototype.addContentToParent = function (kind, target, min, max) {
        this.parent.add(null, kind, target, min, max);
    };
    Scope.prototype.addAllToParent = function (kind, min, max, target) {
        if (min === void 0) { min = 1; }
        if (max === void 0) { max = 1; }
        // Check if there's anything to add.
        if (!this.expose[kind])
            return;
        if (!target)
            target = this;
        target = target.parent;
        for (var _i = 0, _a = this.expose[kind]; _i < _a.length; _i++) {
            var spec = _a[_i];
            // TODO: If target is a choice, it must take the overall min and max.
            target.add(spec.name, kind, spec.item, spec.min * min, spec.max * max);
        }
    };
    Scope.prototype.addComments = function (commentList) {
        this.commentList = (this.commentList || []).concat(commentList);
    };
    Scope.prototype.addCommentsToGrandParent = function (commentList) {
        this.parent.parent.addComments(commentList);
    };
    Scope.prototype.getComments = function () {
        if (!this.commentList)
            return (null);
        // Convert line breaks.
        return (this.commentList.join('').replace(/\r\n?|\n/g, '\n'));
    };
    Scope.prototype.lookup = function (name, kind) {
        var scope = this;
        var nameFull = name.nameFull;
        var nameWild = '*:' + name.name;
        if (name.namespace && name.namespace != this.namespace) {
            scope = name.namespace.getScope();
        }
        var iter = 100;
        while (scope && --iter) {
            if (scope.visible[kind]) {
                var result = scope.visible[kind][nameFull] || scope.visible[kind][nameWild];
                if (result)
                    return (result);
            }
            scope = scope.parent;
        }
        try {
            throw (new Error('Missing ' + kind + ': ' + name.name));
        }
        catch (err) {
            console.log(err.stack);
        }
    };
    // Types
    Scope.prototype.setType = function (type) {
        // TODO: set to some invalid value if called more than once.
        if (!this.type && this.namespace.getScope() != this)
            this.type = type;
    };
    Scope.prototype.setParentType = function (type) {
        this.parent.setType(type);
    };
    Scope.prototype.getParentType = function (namespace) {
        for (var parent = this.parent; parent && parent.namespace == namespace; parent = parent.parent) {
            if (parent.type)
                return (parent.type);
        }
        return (null);
    };
    Scope.prototype.getType = function () { return (this.type); };
    Scope.prototype.dumpTypes = function (kind) {
        return (this.expose[kind]);
    };
    Scope.prototype.dumpMembers = function (kind, groupKind) {
        var itemList = this.expose[kind] || [];
        var groupList = this.expose[groupKind] || [];
        var output = {};
        for (var _i = 0, itemList_1 = itemList; _i < itemList_1.length; _i++) {
            var spec = itemList_1[_i];
            if (spec.name)
                addMemberToTable(output, spec.name, spec);
        }
        for (var _a = 0, groupList_1 = groupList; _a < groupList_1.length; _a++) {
            var group = groupList_1[_a];
            var min = group.min;
            var max = group.max;
            var attributeTbl = group.item.getScope().dumpMembers(kind, groupKind);
            for (var _b = 0, _c = Object.keys(attributeTbl); _b < _c.length; _b++) {
                var key = _c[_b];
                addMemberToTable(output, key, attributeTbl[key], min, max);
            }
        }
        return (output);
    };
    return Scope;
}());
exports.Scope = Scope;
//# sourceMappingURL=Scope.js.map