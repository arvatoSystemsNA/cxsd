"use strict";
// This file is part of cxsd, copyright (c) 2015 BusFaster Ltd.
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
/** <xsd:include> */
var Include = (function (_super) {
    __extends(Include, _super);
    function Include() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = null;
        _this.schemaLocation = null;
        return _this;
    }
    Include.prototype.init = function (state) {
        if (this.schemaLocation) {
            var urlRemote = state.source.urlResolve(this.schemaLocation);
            state.stateStatic.addImport(state.source.targetNamespace, urlRemote);
        }
    };
    Include.mayContain = function () { return [
        types.Annotation
    ]; };
    return Include;
}(types.Base));
exports.Include = Include;
/** <xsd:import> */
var Import = (function (_super) {
    __extends(Import, _super);
    function Import() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.namespace = null;
        return _this;
    }
    Import.prototype.init = function (state) {
        if (this.schemaLocation) {
            // TODO: handle importing namespaces like http://www.w3.org/XML/1998/namespace
            // without a schemaLocation.
            var urlRemote = state.source.urlResolve(this.schemaLocation);
            state.stateStatic.addImport(state.stateStatic.context.registerNamespace(this.namespace), urlRemote);
        }
    };
    return Import;
}(Include));
exports.Import = Import;
//# sourceMappingURL=Import.js.map