'use strict';

var GenericMessage = require('./GenericMessage');

const ACTION_TYPE_CSS = 'ACTION_TYPE_CSS';
const ACTION_TYPE_SLIDEDOWN = 'ACTION_TYPE_SLIDEDOWN';
const ACTION_TYPE_FADEOUT = 'ACTION_TYPE_FADEOUT';
const ACTION_TYPE_FADEIN = 'ACTION_TYPE_FADEIN';
const ACTION_TYPE_ATTR = 'ACTION_TYPE_ATTR';
const ACTION_TYPE_ADD_CLASS = 'ACTION_TYPE_ADD_CLASS';
const ACTION_TYPE_REMOVE_CLASS = 'ACTION_TYPE_REMOVE_CLASS';
const ACTION_TYPE_TOGGLE_CLASS = 'ACTION_TYPE_TOGGLE_CLASS';
const ACTION_TYPE_DROPZONE_DISCOVER = 'ACTION_TYPE_DROPZONE_DISCOVER';
const ACTION_TYPE_SHOW = 'ACTION_TYPE_SHOW';
const ACTION_TYPE_REMOVE_ELEMENT = 'ACTION_TYPE_REMOVE_ELEMENT';
const ACTION_TYPE_HIDE = 'ACTION_TYPE_HIDE';

class DomManipulator extends GenericMessage {

	/**
	 * @param string selector
	 * @param string propertyName
	 * @param string value
	 * @param string actionType
	 */
	constructor(selector, propertyName, value, actionType) {
		let params = [];
		if(propertyName){
			params.push(propertyName);
		}
		if(value!==null){
			params.push(value);
		}
		if(!actionType){
			actionType = ACTION_TYPE_CSS;
		}
		super(selector, actionType, 'DomManipulator', params);
	}
}

DomManipulator.ACTION_TYPE_CSS = ACTION_TYPE_CSS;
DomManipulator.ACTION_TYPE_SLIDEDOWN = ACTION_TYPE_SLIDEDOWN;
DomManipulator.ACTION_TYPE_FADEOUT = ACTION_TYPE_FADEOUT;
DomManipulator.ACTION_TYPE_FADEIN = ACTION_TYPE_FADEIN;
DomManipulator.ACTION_TYPE_ATTR = ACTION_TYPE_ATTR;
DomManipulator.ACTION_TYPE_ADD_CLASS = ACTION_TYPE_ADD_CLASS;
DomManipulator.ACTION_TYPE_REMOVE_CLASS = ACTION_TYPE_REMOVE_CLASS;
DomManipulator.ACTION_TYPE_TOGGLE_CLASS = ACTION_TYPE_TOGGLE_CLASS;
DomManipulator.ACTION_TYPE_DROPZONE_DISCOVER = ACTION_TYPE_DROPZONE_DISCOVER;
DomManipulator.ACTION_TYPE_SHOW = ACTION_TYPE_SHOW;
DomManipulator.ACTION_TYPE_REMOVE_ELEMENT = ACTION_TYPE_REMOVE_ELEMENT;
DomManipulator.ACTION_TYPE_HIDE = ACTION_TYPE_HIDE;

module.exports = DomManipulator;

