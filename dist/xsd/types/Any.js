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
var types = require("../types");
// <xsd:any>
var Any = (function (_super) {
    __extends(Any, _super);
    function Any() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.namespace = null;
        _this.processContents = 'strict';
        return _this;
    }
    Any.prototype.init = function (state) {
        this.name = '*';
        _super.prototype.init.call(this, state);
    };
    Any.prototype.resolve = function (state) {
        this.typeRef = this.resolveType('anytype', state);
    };
    return Any;
}(types.Element));
exports.Any = Any;
//# sourceMappingURL=Any.js.map