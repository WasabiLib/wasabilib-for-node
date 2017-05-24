'use strict';
var GenericMessage = require('./GenericMessage');

const REPLACE = 'ACTION_TYPE_REPLACE';
const APPEND = 'ACTION_TYPE_APPEND';
const REMOVE = 'ACTION_TYPE_REMOVE'; //element remove

class InnerHtml extends GenericMessage {

	constructor(cssSelector, content, actionTypeConstant) {
		if (actionTypeConstant === undefined) {
			actionTypeConstant = REPLACE;
		}
		super(cssSelector, actionTypeConstant, 'InnerHtml', [content]);
	}

}

InnerHtml.REPLACE = REPLACE;
InnerHtml.APPEND = APPEND;
InnerHtml.REMOVE = REMOVE;

module.exports = InnerHtml;