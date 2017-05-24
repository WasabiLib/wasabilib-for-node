'use strict';

var GenericMessage = require('./GenericMessage');

const ACTION_TYPE_TRIGGER = 'ACTION_TYPE_TRIGGER';
const ACTION_TYPE_TRIGGER_EVENT_CLICK = 'ACTION_TYPE_TRIGGER_EVENT_CLICK';
const ACTION_TYPE_TRIGGER_EVENT_FOCUS = 'ACTION_TYPE_TRIGGER_EVENT_FOCUS';
/**
 * trigger JavaScript events specified by the server response
 */
class TriggerEvent extends GenericMessage {

	constructor(selector, actionEventName) {
		let params = [];
		if (actionEventName	===	undefined || actionEventName === null) {
			params.push(ACTION_TYPE_TRIGGER_EVENT_CLICK);
		}
		super(selector, ACTION_TYPE_TRIGGER, 'TriggerEventManager',params);
	}
}

TriggerEvent.TYPE_CLICK = ACTION_TYPE_TRIGGER_EVENT_CLICK;
TriggerEvent.TYPE_FOCUS = ACTION_TYPE_TRIGGER_EVENT_FOCUS;

module.exports = TriggerEvent;