"use strict";
// This file is part of cxsd, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var Type = (function () {
    function Type(name) {
        this.attributeTbl = {};
        this.childTbl = {};
        /** XML attributes in an element of this type. */
        this.attributeList = [];
        /** Allowed child elements for an element of this type. */
        this.childList = [];
        /** Other types added as mixins. */
        this.mixinList = [];
        this.surrogateKey = Type.nextKey++;
        this.name = name;
    }
    Type.prototype.addAttribute = function (ref) {
        this.attributeList.push(ref);
        this.attributeTbl[ref.member.name] = ref;
    };
    Type.prototype.addChild = function (ref) {
        this.childList.push(ref);
        this.childTbl[ref.member.name] = ref;
    };
    Type.prototype.addChildSpec = function (spec) {
        var ref = spec.getRef();
        this.childList.push(ref);
        this.childTbl[spec.name] = ref;
    };
    Type.prototype.addMixin = function (type) {
        this.mixinList.push(type);
    };
    Type.nextKey = 0;
    Type.primitiveFlag = 1;
    Type.plainPrimitiveFlag = 2;
    Type.listFlag = 4;
    return Type;
}());
exports.Type = Type;
//# sourceMappingURL=Type.js.map