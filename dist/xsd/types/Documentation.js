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
/** <xsd:documentation>
  * Works like a comment usable in almost any part of the schema. */
var Documentation = (function (_super) {
    __extends(Documentation, _super);
    function Documentation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.commentList = [];
        return _this;
    }
    Documentation.prototype.init = function (state) {
        state.startText(this);
    };
    Documentation.prototype.addText = function (state, text) {
        this.commentList.push(text);
    };
    Documentation.prototype.loaded = function (state) {
        state.endText();
    };
    Documentation.prototype.resolve = function (state) {
        this.scope.addCommentsToGrandParent(this.commentList);
    };
    return Documentation;
}(types.Base));
exports.Documentation = Documentation;
//# sourceMappingURL=Documentation.js.map