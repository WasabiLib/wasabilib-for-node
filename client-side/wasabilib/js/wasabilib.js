/**
 * Constructor for the DataExtractor class and all of its subclasses. A DataExtractor extracts data of html elements
 * like f.e. div or form elements.
 * @constructor
 */
function DataExtractor() {
	var _self = this;
	_self.element = null;
};

/**
 * Setter for the target attribute.
 * @param target {object|string} A parameter which allows to identify the target of the extraction process.
 */
DataExtractor.prototype.setTarget = function (target) {
	var _self = this;
	_self.element = typeof target === 'object' ? target.closest('.wasabi-ajax-element') : $('#' + target.closest('.wasabi-ajax-element'));
}

/**
 * Returns the content of the element linked to the attribute target.
 * @returns {*|string|array} All transmission capable data.
 */
DataExtractor.prototype.getTransmissionCapableContent = function () {
	var _self = this;
	return _self.element.attr('data-json') ? JSON.parse(_self.element.attr('data-json')) : null;
};

/**
 * Returns the target uri of the element.
 * @returns {string}
 */
DataExtractor.prototype.getUri = function () {
	var _self = this;

	return _self.element.attr('href') ? _self.element.attr('href') : _self.element.attr('data-href') ? _self.element.attr('data-href') : null;
};

/**
 * Returns a jQuery object which is identified by the attribute target.
 * @returns {DataExtractor.element}
 * @see DataExtractor.prototype.setTarget
 */
DataExtractor.prototype.getElement = function () {
	var _self = this;
	return _self.element;
};

/**
 * Constructor of the callback object.
 * @param key {string} The key used to identify a particular Callback object. Used by the html attribute data-cb.
 * @param dataExtractor {DataExtractor} An object to extract data from a html element in a transmission capable kind.
 * @constructor
 */
function Callback(key, dataExtractor) {
	var _self = this;
	_self.key = key;
	_self.dataExtractor = dataExtractor;
	_self.condition = new Condition(function () {
		return true;
	});
}

/**
 * Returns the key used to identify a particular Callback object. Used by the html attribute data-cb.
 * @return {string}
 */
Callback.prototype.getKey = function () {
	var _self = this;
	return _self.key;
};

/**
 * Initializes data extractor to extract the data.
 * @param event
 */
Callback.prototype.execute = function (event) {
	var _self = this;
	_self.dataExtractor.setTarget($(event.target));
};

/**
 * Sets the condition which defines whether a request is allowed to send or not.
 * @param condition {Condition}
 * @see Condition
 */
Callback.prototype.setCondition = function (condition) {
	var _self = this;
	_self.condition = condition;
};

/**
 * Returns the condition which defines whether a request is allowed to send or not.
 * @return {Condition}
 */
Callback.prototype.getCondition = function () {
	var _self = this;
	return _self.condition;
};

/**
 * The constructor of the object which defines if  a request is allowed to send or not.
 * @param conditionHandle
 * @constructor
 */
function Condition(conditionHandle) {
	var _self = this;

	_self.handle = conditionHandle;
	_self.timeOut = 0;
	_self.actualTimerId = null
}

/**
 * Evaluates whether a request is allowed to send or not and returns true or false.
 * @param event
 * @returns {bool}
 */
Condition.prototype.check = function (event) {
	var _self = this;
	return _self.handle(event);
};

/**
 * Starts a timer with a time defined by the attribute timeOut.
 * @param fncHandler {function} The function which will be executed when the time has expired.
 * @see setTimeout
 */
Condition.prototype.checkTimeOut = function (fncHandler) {
	var _self = this;

	if (_self.actualTimerId) {
		clearTimeout(_self.actualTimerId);
	}
	_self.actualTimerId = setTimeout(function () {
		fncHandler();
		_self.actualTimerId = null;
	}, _self.getTimeout());
};

/**
 * Sets the time for a timeout in milliseconds.
 * @param time {number}
 */
Condition.prototype.setTimeout = function (time) {
	var _self = this;
	_self.timeOut = time;
};

/**
 * Returns the time for a timeout in milliseconds.
 * @returns {number}
 */
Condition.prototype.getTimeout = function () {
	var _self = this;
	return _self.timeOut;
};

/**
 * The constructor of the ResponseHandler which process the response of a request.
 * @constructor
 */
function ResponseHandler() {
	var _self = this;

	_self.execRPCManager = null;
}

/**
 * Setter for the ExecuteRemoteProcedureCallManager.
 * @param executeRemoteProcedureCallManager {ExecuteRemoteProcedureCallManager}
 */
ResponseHandler.prototype.setExecuteRemoteProcedureCallManager = function (executeRemoteProcedureCallManager) {
	var _self = this;

	_self.execRPCManager = executeRemoteProcedureCallManager;
}

/**
 * Update method called by the NotificationCenter to process the request.
 * @param response {object}
 */
ResponseHandler.prototype.update = function (response) {
	var _self = this;
	var message = response.message;

	_self.execRPCManager.execute(message.selector, message.actionType, message.params);
};

/**
 * Created by norman.albusberger on 03.07.14.
 */
//----------- Website Manager -----------------------------
/**
 * The constructor of the wasabi which orchestrates the initialization of the Wasabi-Ajax-System.
 * @constructor
 */
function Wasabi() {
	var _self = this;

	_self.notificationCenter = new NotificationCenter(_self);
	_self.executeRemoteProcedureCallManager = null;

	_self.registeredElements = {};

	_self.possibleEvents = null;
	_self.possibleCallbacks = {};

	_self.registerCommonEvents();
}

/**
 * Returns the NotificationCenter.
 * @returns {NotificationCenter|*|wasabi.notificationCenter}
 * @see NotificationCenter
 */
Wasabi.prototype.getNotificationCenter = function () {
	var _self = this;
	return _self.notificationCenter;
};

/**
 * Adds a possible event to the existing ones.
 * @param possibleEvent
 */
Wasabi.prototype.addPossibleEvent = function (possibleEvent) {
	var _self = this;

	_self.possibleEvents[possibleEvent] = true;
};


/**
 * Setter for the NotificationCenter
 * @param notificationCenter {NotificationCenter}
 */
Wasabi.prototype.setNotificationCenter = function (notificationCenter) {
	var _self = this;
	_self.notificationCenter = notificationCenter
};

/**
 * Setter for the ExecuteRemoteProcedureCallManager.
 * @param executeRemoteProcedureCallManager
 * @see ExecuteRemoteProcedureCallManager
 */
Wasabi.prototype.setExecuteRemoteProcedureCallManager = function (executeRemoteProcedureCallManager) {
	var _self = this;
	_self.executeRemoteProcedureCallManager = executeRemoteProcedureCallManager;
};

/**
 * Returns the ExecuteRemoteProcedureCallManager.
 * @returns {null|*|wasabi.executeRemoteProcedureCallManager}
 */
Wasabi.prototype.getExecuteRemoteProcedureCallManager = function () {
	var _self = this;
	return _self.executeRemoteProcedureCallManager;
};

/**
 * Registers a command object used to execute a callback which extracts the transmission capable data of an 'wasabi-ajax-element' element.
 * @param command
 */
Wasabi.prototype.addCallback = function (callback) {
	var _self = this;

	_self.possibleCallbacks[callback.getKey()] = callback;
	_self.registerEventHandler();
};

/**
 * Register the event handler for all events used by the Wasabi-Ajax-System.
 */
Wasabi.prototype.registerCommonEvents = function () {
	var _self = this;

	$(document).on('wasabiNotification', null, function (event) {
		_self.getNotificationCenter().notify(event.message);
	});

	$(document).on('wasabi_new_wasabi-ajax-element', null, function (event) {
		_self.registerEventHandler();
	});

	/**
	 * @todo this destroys the normal behavior of bootstrap modals
	 */
	// Remove modal window from the DOM when it is closed.
	/*	$(document).on('hidden.bs.modal', document, function(event) {
	 setTimeout(function(){
	 $('#'+event.target.id).remove();
	 },301);
	 });


	 $(document)
	 .on('show.bs.modal', '.modal', function(event) {
	 var countOfModalWindows = $('.modal').size();
	 if(countOfModalWindows > 1) {
	 var zIndex = countOfModalWindows + parseInt($(this).css('zIndex'));
	 $(this).css('zIndex', zIndex);
	 $('.modal-backdrop.in:last').css('zIndex', zIndex - 1);
	 }
	 })
	 .on('hide.bs.modal', '.modal', function(event) {
	 var zIndexArray = new Array();
	 $('.modal').each(function(index) {
	 zIndexArray.push($(this).css('zIndex'));
	 });
	 zIndexArray.sort();
	 $('.modal-backdrop.in:last').css('zIndex', zIndexArray[zIndexArray.length - 2] - 1);
	 });
	 */
};

/**
 * Registers on all html elements with a css class called 'wasabi-ajax-element' an event for sending requests.
 */
Wasabi.prototype.registerEventHandler = function () {
	var _self = this;

	$('.wasabi-ajax-element').each(function (index) {
		var element = $(this); //recent Element
		var myEvent = element.attr('data-event');
		var elementId = element.attr('id');
		var callback = _self.getCallback(element.attr('data-cb'));

		if (!_self.registeredElements[elementId] && (element.attr('data-cb') == undefined || callback != undefined)) {
			if (element.prop('tagName') === 'FORM') {
				myEvent = myEvent ? myEvent : 'submit';
				callback = callback ? callback : _self.getCallback('form');
			}
			else if (element.prop('tagName') === 'A') {
				callback = callback ? callback : _self.getCallback('link');
				myEvent = myEvent ? myEvent : 'click';
			} else if (element.hasClass('wasabi_suggest')) {
				callback = callback ? callback : _self.getCallback('suggest');
				myEvent = myEvent ? myEvent : 'keyup';
			} else {
				callback = callback ? callback : _self.getCallback('button');
				myEvent = myEvent ? myEvent : 'click';
			}

			if (myEvent && callback) {
				if (!_self.possibleEvents[myEvent]) {
					//console.log('Event '+ myEvent + ' is not a valid event');
				}
				else {
					if (!$(this).attr('id')) {
						throw new Error(element.tagName + 'needs an id attribute.');
					}
					else {
						$(document).on(myEvent, '#' + elementId, function (event) {
							event.preventDefault();
							callback.execute(event);
							var conf = {};
							//Form-Events standardmäßig POST
							if (callback.dataExtractor.getElement().prop('tagName') === 'FORM' && callback.dataExtractor.getElement().attr('method') != 'get') {
								conf['type'] = 'POST';
							}
							if (callback.getCondition().check(event)) {
								var timeOut = callback.dataExtractor.getElement().attr('data-timeout');
								timeOut != undefined ? callback.getCondition().setTimeout(timeOut) : null;
								var disableTimeout = callback.dataExtractor.getElement().attr('data-disabletime');

								if (disableTimeout) {
									if (callback.dataExtractor.getElement().prop('tagName') === 'A') {
										callback.dataExtractor.getElement().attr('data-href', callback.dataExtractor.getElement().attr('href')).removeAttr('href');
									}
									if (callback.dataExtractor.getElement().prop('tagName') === 'FORM') {
										callback.dataExtractor.getElement().find('[type=submit]').prop('disabled', true);
									} else {
										callback.dataExtractor.getElement().prop('disabled', true);
									}
									if (disableTimeout !== 'true' && $.isNumeric(disableTimeout)) {
										var cond = new Condition();
										cond.setTimeout(disableTimeout);
										cond.checkTimeOut(function () {
											if (callback.dataExtractor.getElement().prop('tagName') === 'A') {
												callback.dataExtractor.getElement().attr('href', callback.dataExtractor.getElement().attr('data-href')).removeAttr('data-href');
											}
											if (callback.dataExtractor.getElement().prop('tagName') === 'FORM') {
												callback.dataExtractor.getElement().find('[type=submit]').prop('disabled', false);
											} else {
												callback.dataExtractor.getElement().prop('disabled', false);
											}
										});
									}
								}
								callback.getCondition().checkTimeOut(function () {
									_self.send(callback.dataExtractor.getUri(), callback.dataExtractor, conf);
								});
							}
						});
					}
				}
				_self.registeredElements[elementId] = true;
			}
		}
	});
};


/**
 * Returns the Callback object registered with functionName.
 * @param functionName
 * @returns {*}
 */
Wasabi.prototype.getCallback = function (functionName) {
	var _self = this;
	if (functionName && !_self.possibleCallbacks[functionName]) {
		//throw new Error('Callback with abbreviation ' + functionName + ' is not defined');
	}
	else {
		return functionName ? _self.possibleCallbacks[functionName] : null;
	}
};

/**
 * Setter for an object which holds all possible events as key boolean pair, F.e. {click: true}.
 * @param possibleEvents
 */
Wasabi.prototype.setPossibleEvents = function (possibleEvents) {
	var _self = this;
	_self.possibleEvents = possibleEvents;
};

/**
 * Adds a possible event to the existing ones.
 * @param possibleEvent
 */
Wasabi.prototype.addPossibleEvent = function (possibleEvent) {
	var _self = this;

	_self.possibleEvents[possibleEvent] = true;
};
/**
 * Sends a request to the url with the content as get/post parameter where the config can be used to set the
 * AJAX parameters.
 * @param url {string} The target url.
 * @param content {string} The get/post parameters.
 * @param config {object} An object with the configuration parameters for the AJAX request.
 */
Wasabi.prototype.send = function (url, content, config) {

	var _self = this;
	var type = 'GET';
	var element = content.getElement(); //the requesting element e.g. form, button, link etc

	if (config) {
		config.type ? type = config.type : false;
	}
	var dataContent = content ? content.getTransmissionCapableContent() : {};
	var dataJson = element.attr('data-json') ? JSON.parse(element.attr('data-json')) : {};
	var data = dataContent;
	if (dataJson) {
		if ($.isArray(dataContent)) {
			$.each(dataJson, function (key, val) {
				dataContent.push({
					name: key,
					value: val
				});
			});
		} else {
			$.extend(data, dataContent, dataJson);
		}
	}
	/**
	 * appends the request with the id of the element (e.g. an <a>) that was triggered
	 * so it can be server-side processed
	 */
	data = $.extend(data, {"triggeredId": element.attr('id')});

	_self.ajax({
		type: type,
		url: url,
		data: data,
		loaderId: element.attr('data-ajax-loader'),
	}, function (err) {
		if(err){
			console.log(err.message);
		}
		if (element.attr('data-disabletime') != undefined && element.attr('data-disabletime') == 'true') {
			if (element.prop('tagName') === 'A') {
				element.attr('href', element.attr('data-href')).removeAttr('data-href');
			}
			if (element.prop('tagName') === 'FORM') {
				element.find('[type=submit]').prop('disabled', false);
			} else {
				element.prop('disabled', false);
			}
		}

	});

	/*
	 //old code
	 $.ajax({
	 type: type,
	 url: url,
	 data: data,
	 dataType: coding,
	 beforeSend: function (xhr) {
	 //put on ajax loader if one is there
	 content.getElement().attr('data-ajax-loader') ? $('#' + content.getElement().attr('data-ajax-loader')).show() : null;
	 }
	 })
	 .done(function (msg) {
	 console.log(msg);
	 _self.getNotificationCenter().notify(msg); //notify the observing response types
	 _self.registerEventHandler();

	 //shut off ajax loader if one is there
	 content.getElement().attr('data-ajax-loader') ? $('#' + content.getElement().attr('data-ajax-loader')).hide() : null;

	 if (content.getElement().attr('data-disabletime') != undefined && content.getElement().attr('data-disabletime') == 'true') {
	 if (content.getElement().prop('tagName') === 'A') {
	 content.getElement().attr('href', content.getElement().attr('data-href')).removeAttr('data-href');
	 }
	 if (content.getElement().prop('tagName') === 'FORM') {
	 content.getElement().find('[type=submit]').prop('disabled', false);
	 } else {
	 content.getElement().prop('disabled', false);
	 }
	 }
	 });
	 */
};

Wasabi.prototype.ajax = function (config, callback) {

	var _self = this;
	var type = (config.type ? config.type : 'GET');
	var url = config.url;
	var data = config.data;
	var coding = 'json';
	var ajaxLoader = config.loaderId ? $('#' + config.loaderId) : null;
	var error = null;

	//the element which is triggering the request
	var element = config.selector ? $(config.selector) : null;

	var jQueryConfig = {
		type: type,
		url: url,
		data: data,
		dataType: coding,
		beforeSend: function (xhr) {
			//put on ajax loader if one is there
			if (ajaxLoader) {
				ajaxLoader.show();
			}
		},
		error: function (response) {
			console.log('The server response is not a wasabilib response.');
			if (response.responseText) {
				error = new Error('See response for details: ' + response.responseText);
				if (callback) {
					return callback(error);
				}
				else {
					console.log(error);
				}
			}
		}
	}

	if(config.contentType){
		jQueryConfig.contentType = config.contentType;
	}

	$.ajax(jQueryConfig)
		.done(function (serverResponse) {
			if (!serverResponse[0].status) {
				error = new Error('The server response is not a wasabilib response.');
				if (callback) {
					return callback(error);
				}
				else {
					console.log(error);
				}
			}
			if (!error) {
				_self.getNotificationCenter().notify(serverResponse); //notify the observing response types
				_self.registerEventHandler(); //register new wasabi-ajax-elements in the DOM
			}
			//shut off ajax loader element if there
			if (ajaxLoader) {
				ajaxLoader.hide();
			}
			//run the callback if it is set
			if (callback) {
				return callback(error, serverResponse);
			}
		});
};


/**
 * Allows to register observers which has to notified if a certain event occurs.
 * @constructor
 */
function NotificationCenter(wasabi) {
	var _self = this;
	_self.wasabi = wasabi;

	_self.observers = [];
}

/**
 * Registers an observer which will be notified, if a particular event will appear.
 * @param event
 * @param observer
 */
NotificationCenter.prototype.register = function (observer) {
	var _self = this;

	observer.setExecuteRemoteProcedureCallManager(_self.wasabi.getExecuteRemoteProcedureCallManager());

	_self.observers.push(observer);
};

/**
 * Removes an observer from the notification list.
 * @param event
 * @param observer
 */
NotificationCenter.prototype.remove = function (event, id) {
	var _self = this;

	delete _self.observers[_self.generateIndex(event, id)];
};

/**
 * Removes an observer from the notification list.
 * @param event
 * @param observer
 */
NotificationCenter.prototype.generateIndex = function (event, id) {
	var _self = this;

	return event + '+' + id;
};

/**
 * All observers of the occurrence of a particular event.
 * @param notification
 */
NotificationCenter.prototype.notify = function (notification) {
	var _self = this;

	jQuery.each(_self.observers, function (obs) {
		var obs = this;
		jQuery.each(notification, function (index, response) {
			if (window[response.responseHandler] != undefined && obs instanceof window[response.responseHandler]) {
				obs.update(response);
			}
		});
	});
};

/**
 * The constructor of the ExecuteRemoteProcedureCallManager which is used to encapsulate the calling of the
 * JavaScript/jQuery methods.
 * @constructor
 */
function ExecuteRemoteProcedureCallManager() {
	var _self = this;

	_self.possibleMethods = undefined;
	_self.keywords = {
		location: $(location)
	};
}

/**
 * Executes function specified by methodName, on an element specified by selector with the parameters for
 * the method call params
 * @param selector {string} A css selector.
 * @param methodName {string} A method name.
 * @param params {Array} The parameters stored in an array.
 */
ExecuteRemoteProcedureCallManager.prototype.execute = function (selector, methodName, params) {
	var _self = this;
	if (!_self.possibleMethods[methodName]) {
		console.log('The given method ' + methodName + ' is not a valid method name');
	}
	else if (_self.keywords[selector]) {
		_self.keywords[selector][_self.possibleMethods[methodName]].apply(_self.keywords[selector], params);
	}
	else if (selector == undefined) {
		window[_self.possibleMethods[methodName]].apply(window, params);
	}
	else {
		$(selector)[_self.possibleMethods[methodName]].apply($(selector), params);
	}

};

/**
 * Setter for an object which holds the names of all kinds of methods which are allowed to use.
 * @param possibleMethods {object} Object with key value pairs, f.e. {ACTION_TYPE_REPLACE: "html"}.
 */
ExecuteRemoteProcedureCallManager.prototype.setPossibleMethods = function (possibleMethods) {
	var _self = this;
	_self.possibleMethods = possibleMethods;
};


/**-----------------------------------------------------------
 * Created by norman.albusberger on 03.07.14.
 * Common Response Handlers
 *
 *
 * -----------------------------------------------------------
 */

/**
 * Constructor of the Alert response handler object which shows a JavaScript alert dialog filled with information received from
 * the server.
 * @constructor
 */
function Alert() {
	ResponseHandler.call(this);
	var _self = this;

	_self.ACTION_TYPE_JS_ALERT = 'alert';
}

/**
 * Adds superclass methods.
 * @type {ResponseHandler.prototype}
 */
Alert.prototype = Object.create(ResponseHandler.prototype);

/**
 * Update method called by the NotificationCenter.
 * @param response {object}
 * @see Constructor
 */
Alert.prototype.update = function (response) {
	var _self = this;
	var message = response.message;

	_self.execRPCManager.execute(undefined, message.actionType, message.params);
};

/**
 * Constructor of ConsoleLogs. This response type logs the received informations into the console of the used browser to
 * debug apps in development.
 * @constructor
 */
function ConsoleLog() {
	ResponseHandler.call(this);
	var _self = this;

}

/**
 * Adds superclass methods.
 * @type {ResponseHandler.prototype}
 */
ConsoleLog.prototype = Object.create(ResponseHandler.prototype);

/**
 * Update method called by the NotificationCenter to process the request.
 * @param response {object}
 * @see Constructor
 */
ConsoleLog.prototype.update = function (response) {
	console.log(response.message);
}


/**
 * The constructor of InnerHtml. The recipient is able to add content to the DOM replace existing elements with new ones
 * or remove them from the DOM.
 * @constructor
 */
function InnerHtml() {
	ResponseHandler.call(this);
	var _self = this;

	_self.ACTION_TYPE_REPLACE = 'html';
	_self.ACTION_TYPE_APPEND = 'appendTo';
	_self.ACTION_TYPE_REMOVE = 'empty';
}

/**
 * Adds superclass methods.
 * @type {ResponseHandler.prototype}
 */
InnerHtml.prototype = Object.create(ResponseHandler.prototype);

/**
 * The constructor of DomManipulator. This recipient is used to manipulate existing elements within the DOM.
 * F.e. one is able to alter the style attribute of an element or add/remove css classes.
 * @constructor
 */
function DomManipulator() {
	ResponseHandler.call(this);
	var _self = this;
}

/**
 * Adds superclass methods.
 * @type {ResponseHandler.prototype}
 */
DomManipulator.prototype = Object.create(ResponseHandler.prototype);

/**
 * Created by sascha.qualitz on 22.09.14.
 */

/**
 * Constructor of TriggerEventManager which can trigger JavaScript events specifed by the server response.
 * The possibleEvents attribute defines which events are allowed.
 * @constructor
 */
function TriggerEventManager() {
	ResponseHandler.call(this);
	var _self = this;

	_self.possibleEvents = {
		ACTION_TYPE_TRIGGER_EVENT_NEXT_STEP: 'nextStep'
		, ACTION_TYPE_TRIGGER_EVENT_PREVIOUS_STEP: 'prevStep'
		, ACTION_TYPE_TRIGGER_EVENT_CLICK: 'click'
		, ACTION_TYPE_TRIGGER_EVENT_FOCUS: 'focus'
	};
}

/**
 * Adds superclass methods.
 * @type {ResponseHandler.prototype}
 */
TriggerEventManager.prototype = Object.create(ResponseHandler.prototype);

/**
 * Update method called by the NotificationCenter to process the request.
 * @param response {object}
 * @see Constructor
 */
TriggerEventManager.prototype.update = function (response) {
	var _self = this;
	var message = response.message;

	if (!_self.possibleEvents[message.params[0]]) {
		console.log('The given event ' + message.params[0] + ' is not a valid event name');
	} else {
		_self.execRPCManager.execute(message.selector, message.actionType, [_self.possibleEvents[message.params[0]]]);
	}
};

/**
 * ---------------Common Response Handlers ---------------------------
 */




//----    Data Extractors -----------------------------
/**
 * Constructor of Form to extract data from a normal form element.
 * @constructor
 */
function Form() {
	DataExtractor.call(this);
}

/**
 * Adds superclass methods.
 * @type {DataExtractor.prototype}
 */
Form.prototype = Object.create(DataExtractor.prototype);

/**
 * Setter for the target attribute.
 * @param target {object|string} A parameter which allows to identify the target of the extraction process.
 */
Form.prototype.setTarget = function (target) {
	var _self = this;
	_self.element = typeof target === 'object' ? target : $('#' + target);
}

Form.prototype.getTransmissionCapableContent = function () {
	var _self = this;
	return _self.getElement().serializeArray();
};

Form.prototype.getUri = function () {
	var _self = this;
	return _self.getElement().attr('action');
};

//-------------- External Form ------------------------------------------
/**
 * Constructor of External_form. This recipient allows to extract data from a normal form element, even if the
 * submit button is outside of that form element.
 * @constructor
 */
function External_Form() {
	Form.call(this);
}

/**
 * Adds superclass methods.
 * @type {DataExtractor.prototype}
 */
External_Form.prototype = Object.create(Form.prototype);

/**
 * Setter for the target attribute.
 * @param target {object|string} A parameter which allows to identify the target of the extraction process.
 */
External_Form.prototype.setTarget = function (target) {
	var _self = this;
	_self.element = target.tagName === 'FORM' ? target : $('#' + target.attr('form'));
	_self.jsonParams = $(target).attr('data-json') ? JSON.parse('[' + $(target).attr('data-json') + ']') : null;
};

/**
 * Returns the content of the element linked to the attribute target. Additionally it extracts the data-json
 * informations from the external submit button.
 * @returns {*|string|array} All transmission capable data.
 */
External_Form.prototype.getTransmissionCapableContent = function () {
	var _self = this;
	var extractedData = Form.prototype.getTransmissionCapableContent.call(this);
	if (_self.jsonParams) {
		$.merge(extractedData, _self.jsonParams);
	}
	return extractedData;
};

//-------------- Text Field ------------------------------------------
/**
 * Constructor of Text_Field. It extracts the data of the value attribute.
 * @constructor
 */
function Text_Field() {
	DataExtractor.call(this);
}

/**
 * Adds superclass methods.
 * @type {DataExtractor.prototype}
 */
Text_Field.prototype = Object.create(DataExtractor.prototype);

/**
 * Returns the content of the element value attribute.
 * @returns {*|string|array} All transmission capable data.
 */
Text_Field.prototype.getTransmissionCapableContent = function () {
	var _self = this;
	return {content: _self.getElement().val()};
};

//---------------\Data Extractors -------------------

//-----------   Initialization    ------------------------------------

$(document).ready(function () {
	/**
	 * Initialize the wasabi to orchestrate the WasabiLib system.
	 * @type {wasabi}
	 */
	wasabi = new Wasabi();
	$.Wasabi = wasabi; //Setting up Wasabi to work under the jQuery namespace

	/**
	 * Set the available event types which can be used to trigger WasabiLib requests.
	 */
	wasabi.setPossibleEvents({
		select: true
		, search: true
		, dblclick: true
		, mouseover: true
		, mouseout: true
		, click: true
		, mousedown: true
		, submit: true
		, blur: true
		, keyup: true
		, keydown: true
		, keypress: true
	});

	/**
	 * Execute methods in a controlled environment.
	 */
	wasabi.setExecuteRemoteProcedureCallManager(new ExecuteRemoteProcedureCallManager());

	/**
	 * Show JavaScript alert window.
	 */
	wasabi.getNotificationCenter().register(new Alert());

	/**
	 * Add, replace or remove html elements in the DOM.
	 */
	wasabi.getNotificationCenter().register(new InnerHtml());

	/**
	 * Change values of html element attributes.
	 */
	wasabi.getNotificationCenter().register(new DomManipulator());

	/**
	 * @todo change place for ModalWindow registration because it is an extension
	 * Display one or many bootstrap modal windows.
	 */
	//wasabi.getNotificationCenter().register(new ModalWindow());

	/**
	 * Write develop informations into the web browsers console.
	 */
	wasabi.getNotificationCenter().register(new ConsoleLog());

	/**
	 * Trigger events received from the server.
	 */
	wasabi.getNotificationCenter().register(new TriggerEventManager());

//    wasabi.getNotificationCenter().register(new DropzoneManager());

	/**
	 * Callback for a elements to extract the informations of the data-json attribute only.
	 */
	wasabi.addCallback(new Callback('link', new DataExtractor()));

	/**
	 * Callback for button elements to extract the informations of the data-json attribute only.
	 */
	wasabi.addCallback(new Callback('button', new DataExtractor()));

	/**
	 * Callback for form elements with an external submit button to extract the informations of the form.
	 */
	wasabi.addCallback(new Callback('ext_form_submit', new External_Form()));

	/**
	 * Callback for form elements to extract the informations of the form.
	 */
	wasabi.addCallback(new Callback('form', new Form()));

	/**
	 * Callback for text fields to extract the informations from the value attribute.
	 */
	wasabi.addCallback(new Callback('text', new Text_Field()));


	/**
	 * Set the possible methods which can be used by response handler objects.
	 */
	wasabi.getExecuteRemoteProcedureCallManager().setPossibleMethods({
		ACTION_TYPE_SHOW: 'show'
		, ACTION_TYPE_HIDE: 'hide'
		, ACTION_TYPE_MODAL: 'modal'
		, ACTION_TYPE_SLIDEDOWN: 'slideDown'
		, ACTION_TYPE_SLIDEUP: 'slideUp'
		, ACTION_TYPE_REPLACE: 'html'
		, ACTION_TYPE_APPEND: 'append'
		, ACTION_TYPE_REMOVE: 'empty'
		, ACTION_TYPE_CSS: 'css'
		, ACTION_TYPE_FADEOUT: 'fadeOut'
		, ACTION_TYPE_FADEIN: 'fadeIn'
		, ACTION_TYPE_ATTR: 'attr'
		, ACTION_TYPE_ADD_CLASS: 'addClass'
		, ACTION_TYPE_REMOVE_CLASS: 'removeClass'
		, ACTION_TYPE_TOGGLE_CLASS: 'toggleClass'
		, ACTION_TYPE_HREF: 'href'
		, ACTION_TYPE_DROPZONE_DISCOVER: 'discover'
		, ACTION_TYPE_TRIGGER: 'trigger'
		, ACTION_TYPE_REMOVE_ELEMENT: 'remove'
		, ACTION_TYPE_JS_ALERT: 'alert'
	});
});
