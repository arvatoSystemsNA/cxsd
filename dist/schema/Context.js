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
var Namespace_1 = require("./Namespace");
var Context = (function (_super) {
    __extends(Context, _super);
    function Context() {
        return _super.call(this, Namespace_1.Namespace) || this;
    }
    return Context;
}(cxml.ContextBase));
exports.Context = Context;
//# sourceMappingURL=Context.js.map