#Would you like to contribute?
Please send a message to info@wasabilib.org


# Documentation
The WasabiLib project follows the approach to handle ajax requests and responses in a simple and convenient way. 
It consists of a client side implementation of a notification center which handles recipients and server-side counterparts for the recipients called response types.
WasabiLib does not change the standard behaviour of the html. When using it you can use links, buttons, forms the normal way, too. 

## Introduction
It is possible to transform every html element into a request sending element. Normally you want to use links, buttons and forms to be sent with ajax.
But you can also use div's, p's, input's etc. to trigger requests.

If the element has a href attribute the value is the triggered url. If not you must use `data-href` attribute to set the url. (in case of forms the action attribute contains the server url)

See the following example for a bootstrap button:

```
<button id="my-button" class="btn btn-info wasabi-ajax-element" data-href="/path/to/request/handler">My Button </button>
```

## Dependencies

The client-side javascript code depends on jQuery.

## Install

```
    $ npm install --save wasabilib-for-node
```
After installation you have to copy the files under "client-side" into your public project folder so you can access them with the browser. 
Make sure to include it after jquery.


## Usage

You can transform every html element into an wasabi-ajax-element by adding the class attribute ```wasabi-ajax-element```
Usually you are doing this for buttons, links and forms.

**Note:**
_Every element e.g. button, links, forms etc. you want to perform ajax request must have a unique id. So do not forget to set the id="my-identifier" attribute_

## Response Types

Approach: The common way to answer ajax requests is to use the response types. 
To handle responses you need to create an instance of ```Wasabilib.Response```

    1. include the lib in your controller or app 
       var Wasabilib = require('wasabilib-for-node');
    3. var wasabiResponse = new Wasabilib.Response();
    4. use the wasabiResponse.add(responseType or array of responseTypes) method to add responses
    5. send the response res.send(wasabiResponse);

If you have only one response type you can also use: 
` res.send(new Wasabilib.Response(myResonseType e.g. InnerHtml, DomManipulator, TriggerEvent or addOns)`

### InnerHtml

With the InnerHtml response type you can replace, append or remove content from one or more html elements. 
```
/*
selector is the html selector eg #container or .class-name
content: your html content
action: Wasabilib.InnerHtml.REPLACE (default), Wasabilib.InnerHtml.APPEND, Wasabilib.InnerHtml.REMOVE
*/

let innerHtml = new Wasabilib.InnerHtml(selector,content,action);
```



#### Examples

```let response = new Wasabilib.Response();
let innerHtml1 = new Wasabilib.InnerHtml('#response-container1','my html content that will be appended... ',Wasabilib.InnerHtml.APPEND);
let innerHtml2 = new Wasabilib.InnerHtml('.response-containers','my html content that will replace every element with the class response-container');
let innerHtml3 = new Wasabilib.InnerHtml('li','my html content the will replace every element of type p');
response.add([innerHtml1,innerHtml2,innerHtml3]);
res.send(response);
```


### DomManipulator

coming soon

### Alert

### TriggerEvent

coming soon

## Sending Forms

Sending forms with wasabilib works like sending forms with a normal request. You need to write a form with the class wasabi-ajax-element and thats it.

**Note:** The following attributes MUST be defined in the form tag. Otherwise the form data will not be sent.
name, id, method, action. Every element inside the form MUST have a name. If not it won't be sent. This behaviour has nothing to do with wasabilib. It is html standard.

The following example shows a form with several elements. It sends the data via post method.

```
<div id="my-ajax-loader" style="display:none; width: 30px; height: 30px; background-color: orange"></div>
            <form class="form-horizontal wasabi-ajax-element" data-ajax-loader="my-ajax-loader" name="myForm" id="myForm" method="post" action="/path/to/server">
                <fieldset>

                    <!-- Form Name -->
                    <legend>Wasabilib Ajax Form With Ajax Loader.</legend>

                    <!-- Text input-->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="textinput">Text Input</label>
                        <div class="col-md-4">
                            <input id="textinput" name="textinput" type="text" placeholder="placeholder" class="form-control input-md">
                            <span class="help-block">help</span>
                        </div>
                    </div>

                    <!-- Multiple Radios -->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="radios">Multiple Radios</label>
                        <div class="col-md-4">
                            <div class="radio">
                                <label for="radios-0">
                                    <input type="radio" name="radios" id="radios-0" value="1" checked="checked">
                                    Option one
                                </label>
                            </div>
                            <div class="radio">
                                <label for="radios-1">
                                    <input type="radio" name="radios" id="radios-1" value="2">
                                    Option two
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Select Basic -->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="selectbasic">Select Basic</label>
                        <div class="col-md-4">
                            <select id="selectbasic" name="selectbasic" class="form-control">
                                <option value="1">Option one</option>
                                <option value="2">Option two</option>
                            </select>
                        </div>
                    </div>

                    <!-- Button -->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="singlebutton">Single Button</label>
                        <div class="col-md-4">
                            <button id="singlebutton" name="singlebutton" class="btn btn-primary">Button</button>
                        </div>
                    </div>

                </fieldset>
            </form>
```
## Using an ajax-loader

By defining the attribute `data-ajax-loader` to the html element which is sending the request you can take advantage of a simple way to display the user loading activity.

## Sending requests with JavaScript
It could be necessary to send request with JavaScript instead of an element inside the DOM. In this case you can also take advantage of the library features by using  ``$.Wasabi.ajax(config,callback)``. See the following example:
 ```
 $.Wasabi.ajax({
   url: "/path/to/server",
   data: {"param":"value"}
 });
 ```
 
 ### Configuration
 
 ```
 {
    type: GET or POST, default is GET
    url: "path/to/server",
    data: your json data object you want to process
    loaderId: specify an element which is shown/hidden during request
    contentType: default is 'application/x-www-form-urlencoded; charset=UTF-8'
 }
 ```

### Callback
You can also specify a callback as the second optional parameter.

```
$.Wasabi.ajax({
        type:"POST",
        url: "/panel/main/ajaxtest",
        loaderId: "ajax-loader",
        data:{"param":"value"},
    },function (error, serverResponse) {
        console.log(error, serverResponse);
   }
);

```

## License

MIT © 
