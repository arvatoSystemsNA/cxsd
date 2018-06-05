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
var DerivationBase_1 = require("./DerivationBase");
var types = require("../types");
/** <xsd:restriction>
  * The schema allows a restriction to contain anything, but we parse only some useful restrictions. */
var Restriction = (function (_super) {
    __extends(Restriction, _super);
    function Restriction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // TODO: Remove this.
    Restriction.prototype.init = function (state) {
        this.parent = state.parent;
    };
    /*
        TODO: uncomment this when resolve function dependencies are handled.
        resolve(state: State) {
            var parent = state.parent.xsdElement;
    
            if(parent instanceof types.SimpleType) {
                parent.setEnumerationList(this.enumerationList);
            }
    
    //		super.resolve(state);
        }
    */
    Restriction.prototype.addEnumeration = function (content) {
        if (!this.enumerationList) {
            this.enumerationList = [];
            // TODO: Remove this and uncomment the resolve function.
            var parent = this.parent.xsdElement;
            if (parent instanceof types.SimpleType) {
                parent.setEnumerationList(this.enumerationList);
            }
        }
        this.enumerationList.push(content);
    };
    Restriction.mayContain = function () { return DerivationBase_1.DerivationBase.mayContain().concat([
        types.Enumeration
    ]); };
    return Restriction;
}(DerivationBase_1.DerivationBase));
exports.Restriction = Restriction;
//# sourceMappingURL=Restriction.js.map