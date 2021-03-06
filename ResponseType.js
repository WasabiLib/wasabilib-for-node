'use strict';
/**
 * private class
 */
class ResponseType {
	constructor() {
		this.responseHandler = 'ajaxResponse';
		this.status = 200;
	}

	/**
	 * should typically be overwritten
	 */
	get message(){

	}

	data() {
		let data = {
			'responseHandler': this.responseHandler,
			'status': this.status,
			'message': this.message //calls the getter in GenericMessage
		};
		return data;
	}
}

module.exports = ResponseType;