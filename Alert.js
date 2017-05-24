'use strict';

var GenericMessage = require('./GenericMessage');

class Alert extends GenericMessage {

	constructor(alertMessage) {
		super(null, 'ACTION_TYPE_JS_ALERT', 'Alert', [alertMessage]);
	}
}

module.exports = Alert;