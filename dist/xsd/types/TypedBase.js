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
var QName_1 = require("../QName");
var types = require("../types");
var TypedBase = (function (_super) {
    __extends(TypedBase, _super);
    function TypedBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypedBase.prototype.resolveType = function (typeName, state) {
        // If the element has a type set through an attribute, look it up in scope.
        if (typeName) {
            var type = new QName_1.QName(typeName, state.source);
            return (this.scope.lookup(type, 'type') || type);
        }
        else {
            // If there's a single type as a child, use it as the element's type.
            return (this.scope.getType());
        }
    };
    return TypedBase;
}(types.Base));
exports.TypedBase = TypedBase;
//# sourceMappingURL=TypedBase.js.map