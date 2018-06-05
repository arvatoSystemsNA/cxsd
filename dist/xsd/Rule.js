"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
/** Parser rule, defines a handler class, valid attributes and children
  * for an XSD tag. */
var Rule = (function () {
    function Rule(proto) {
        /** List of allowed attributes. */
        this.attributeList = [];
        /** Table mapping the names of allowed child tags, to their parsing rules. */
        this.followerTbl = {};
        this.proto = proto;
    }
    return Rule;
}());
exports.Rule = Rule;
//# sourceMappingURL=Rule.js.map