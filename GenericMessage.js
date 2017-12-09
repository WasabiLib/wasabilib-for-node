'use strict';
var ResponseType = require('./ResponseType');


class GenericMessage extends ResponseType {

	/**
	 *
	 * @param selector html selector .class name with dot, #id, tag name like h1 without <>
	 * @param actionType A string which holds the information which methods on the JavaScript side has to be called.
	 * @param responseHandler is the name of the responseHandler class on client js side
	 * @param params
	 */
	constructor(selector, actionType, responseHandler, params) {
		super();
		this._actionType = null;
		this._params = null;

		this.selector = selector ? selector : null;
		this.actionType = actionType;
		this.responseHandler = responseHandler ? responseHandler : null;
		this.params = params;
	}

	/**
	 * if any parameters must be configured before
	 * calling the message method by the parental class
	 * one can implement configure() to pre-configure the message
	 */
	configure(){
	}

	get message() {
		this.configure();
		return {
			'selector': this.selector,
			'actionType': this._actionType,
			'recipientType': this.recipientType,
			'params': this._params
		};
	}

	/**
	 *
	 * @param array params
	 */
	set params(params) {
		this._params = params;
	}

	get params() {
		return this._params;
	}

	get actionType() {
		return this._actionType;
	}

	/**
	 * @param actionType
	 */
	set actionType(actionType) {
		this._actionType = actionType;
	}
}

module.exports = GenericMessage;