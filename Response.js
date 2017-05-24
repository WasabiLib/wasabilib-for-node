'use strict';
var ResponseType = require('./ResponseType');
/**
 * The class is the container for all instances of ResponseTypes
 * you can add ResponseTypes with the add method or you can put them into an array and then give it to
 * the constructor
 * sending the response: res.send(Wasabilib.Response)
 * the toJSON method is triggered automatically
 */

let InnerHtml = require('./InnerHtml');

class Response{

	constructor(responseType){
		this._responses = [];
		if(Array.isArray(responseType)){
			responseType.forEach((type) =>{
				this.add(type);
			});
		}
		else{
			if(responseType instanceof ResponseType){
				this.add(responseType);
			}
		}
	}

	/**
	 * @param response
	 */
	add(responseType){
		if(Array.isArray(responseType)){
			this._responses = this._responses.concat(responseType);
		}
		else{
			//if(responseType instanceof ResponseType){
				this._responses.push(responseType);
		/*	}
			else{
				throw new Error('The given value is type of '+ typeof responseType+'. Not instance of Wasabilib.ResponseType');
			}
*/
		}
		return this;
	}
	get responses(){
		return this._responses;
	}

	toJSON(){
		let data = this.responses.map(response => response.data());
		return data;
	}

	innerHtml(cssSelector, content) {
		let instance = new InnerHtml(cssSelector, content);
		this.add(instance);
		return this;
	}
}

module.exports = Response;