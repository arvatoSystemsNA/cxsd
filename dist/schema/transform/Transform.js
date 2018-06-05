"use strict";
// This file is part of cxsd, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
/** TransformType is a class derived from Transform, used like CRTP in C++. */
var Transform = (function () {
    function Transform(doc) {
        this.doc = doc;
        this.namespace = doc.namespace;
    }
    Transform.prototype.getTypeMembers = function (type) {
        var memberList = [];
        var ref;
        if (type.attributeList) {
            for (var _i = 0, _a = type.attributeList; _i < _a.length; _i++) {
                ref = _a[_i];
                memberList.push(ref);
            }
        }
        if (type.childList) {
            for (var _b = 0, _c = type.childList; _b < _c.length; _b++) {
                ref = _c[_b];
                memberList.push(ref);
            }
        }
        return (memberList);
    };
    Transform.prototype.prepare = function () { return (this.output); };
    Transform.prototype.exec = function (visitedNamespaceTbl, state) {
        var _this = this;
        var doc = this.doc;
        var namespace = doc.namespace;
        if (state)
            this.state = state;
        if (!visitedNamespaceTbl)
            visitedNamespaceTbl = {};
        visitedNamespaceTbl[namespace.id] = namespace;
        return (Promise.resolve(this.prepare()).then(function (output) { return Promise.map(namespace.getUsedImportList(), function (namespace) {
            if (!visitedNamespaceTbl[namespace.id]) {
                if (namespace.doc) {
                    var transform = new _this.construct(namespace.doc);
                    return (transform.exec(visitedNamespaceTbl, _this.state));
                }
            }
            return ([]);
        }).then(function (outputList) { return Array.prototype.concat.apply([output], outputList); }); }));
    };
    return Transform;
}());
exports.Transform = Transform;
//# sourceMappingURL=Transform.js.map