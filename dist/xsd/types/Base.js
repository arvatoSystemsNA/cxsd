"use strict";
// This file is part of cxsd, copyright (c) 2015-2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.
Object.defineProperty(exports, "__esModule", { value: true });
var QName_1 = require("../QName");
/** Common handler base class for all schema tags. */
var Base = (function () {
    function Base(state) {
        if (!state)
            return;
        this.scope = state.getScope();
        this.lineNumber = state.stateStatic.getLineNumber();
        this.bytePos = state.stateStatic.getBytePos();
    }
    /** Hook, runs after opening tag. */
    Base.prototype.init = function (state) { };
    /** Hook, runs for text content. */
    Base.prototype.addText = function (state, text) { };
    /** Hook, runs after closing tag. */
    Base.prototype.loaded = function (state) { };
    /** Hook, runs after all dependencies have been loaded. */
    Base.prototype.resolve = function (state) { };
    /** Add this named tag to scope, listed under given type.
      * Optionally set number of allowed occurrences, for optional elements, sequences etc.
        * @return fully qualified name. */
    Base.prototype.define = function (state, type, min, max, scope) {
        if (min === void 0) { min = 1; }
        if (max === void 0) { max = 1; }
        var name = this.name;
        var qName = null;
        if (name) {
            qName = new QName_1.QName(name, state.source);
            name = qName.nameFull;
        }
        (scope || this.scope).addToParent(name, type, this, min, max);
        return (qName);
    };
    Base.prototype.getScope = function () { return (this.scope); };
    /** Returns other classes allowed as children. */
    Base.mayContain = function () { return []; };
    return Base;
}());
exports.Base = Base;
//# sourceMappingURL=Base.js.map