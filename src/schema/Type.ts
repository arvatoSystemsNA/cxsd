// This file is part of cxml, copyright (c) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Namespace} from './Namespace';
import {Member} from './Member';
import * as exporter from './exporter';

export class Type {
	constructor() {
		this.surrogateKey = Type.nextKey++;
	}

	// TODO: handle naming collisions between attributes and children,
	// and between namespaces.
	buildMemberTbl() {
		var member: Member;

		for(member of this.attributeList) this.attributeTbl[member.name] = member;
		for(member of this.childList) this.childTbl[member.name] = member;
	}

	name: string;
	namespace: Namespace;
	safeName: string;
	bytePos: number;

	/** JavaScript type name, if the XML type only contains single value
	  * that can be parsed into a JavaScript value. */
	literalType: string;
	/** List of allowed literal values, if such a restriction is defined. */
	primitiveList: string[];

	attributeTbl: {[name: string]: Member} = {};
	childTbl: {[name: string]: Member} = {};
	/** XML attributes in an element of this type. */
	attributeList: Member[];
	/** Allowed child elements for an element of this type. */
	childList: Member[];

	/** Parent type this is derived from. */
	parent: Type;

	isRecursive: boolean;

	comment: string;

	surrogateKey: number;
	private static nextKey = 0;
}