/**
 * Pure JS XHR2 upload with jQuery Plugin
 * 
 * Allows to bind an XHR2 upload to any DOM element event without a form
 * Works only with IE >= 10, because IE 9 does not support XHR2 objects
 * Tested on Chrome, IE10 and Firefox
 *
 * @author by Christian Velazquez
 * @version 0.2.1
 * @link https://github.com/cvelazquez/javascript.uploader
 */
var uploader = uploader || {};
(function(o){
	"use strict";

	var randomId = Math.ceil(Math.random()*100000);
	var binded = false;

	o.createInput = function(options){
		if ( !document.getElementById("uploadForm"+randomId+"Input") ) {
			var _input = document.createElement("input");
			_input.setAttribute("type", "file");
			_input.setAttribute("id", "uploadForm"+randomId+"Input");
			_input.setAttribute("multiple", "multiple");
			_input.style.position = "fixed"; // Hidden inputs can not trigger click events in a few browsers / versions
			_input.style.top = "-100px";
			options.files = _input;
			binded = true;
			_input.addEventListener("change", function(){
				o.send(options);
			});
			if ( document.body ) {
				document.body.appendChild(_input);
			}
		} else {
			var _input = document.getElementById("uploadForm"+randomId+"Input");
		}
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
		_input.dispatchEvent(e, true);
	};

	var _getFormData = function(options){
		var f = new FormData();
		for ( var i = 0; i < options.files.files.length; i++ ) {
			f.append("data[files][]", options.files.files[i]); // CakePHP $this->request->data['files'], Normal PHP $_POST["data"]["files"];
		}
		options.formData = f;
		return options;
	};

	var _upload = function(options){
		var ajax = new XMLHttpRequest();
		ajax.upload.addEventListener("progress", function(e){
			if ( e.lengthComputable === true ) {
				if ( typeof options.progress == "function" ) {
					options.progress(Math.round(e.loaded/e.total*100));
				}
			}
		});

		ajax.addEventListener("readystatechange", function(){
			if ( this.readyState == 4 ) {
				options.files.value = '';
				if ( this.status == 200 ) {
					if ( typeof options.finished == "function" ) {
						options.finished(JSON.parse(this.response));
					}
				} else {
					if ( typeof options.error == "function" ) {
						options.error(this.status);
					}
				}
			}
		});

		ajax.open("post",options.url);
		ajax.send(options.formData);
	};

	o.send = function(options){
		if ( o.supported ) {
			if ( options.files && binded ) {
				if ( options.files.files.length ) {
					_upload(_getFormData(options));
				}
			}
		}
	};

	o.supported = 'upload' in new XMLHttpRequest;

})(uploader);

/** jQuery Plugin **/
if ( typeof jQuery != "undefined" ) {
	(function ($) {
		$.fn.autoupload = function(options) {
			var options = $.extend(true, {}, options);
			if ( typeof options == "object" ) {
				$.each(this, function(i, obj){
					if ( obj.tagName.toLowerCase() == "input" && obj.hasAttribute("type") && obj.getAttribute("type") == "file" ) {
						options.files = obj;
						$(obj).off('change').on({
							change: function(e){
								uploader.send(options);
							}
						});
					} else {
						$(obj).off('click').on({
							click: function(e){
								uploader.createInput(options);
							}
						});
					}
				})
			}
		};
	}( jQuery ));
}
