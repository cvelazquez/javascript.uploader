/**
 * Pure JS XHR2 upload with jQuery Plugin
 * 
 * Allows to bind an XHR2 upload to any DOM element event without a form
 * Works only with IE >= 10, because IE 9 does not support XHR2 objects
 * Tested on Chrome, IE10 and Firefox
 *
 * @author by Christian Velazquez
 * @version 0.3
 * @link https://github.com/cvelazquez/javascript.uploader
 */
function uploader(options, $){
	"use strict";
	
	var self = this;
	var randomId = Math.ceil(Math.random()*100000);
	self.options = options;

	var _createInput = function(){
		if ( $("#uploadForm"+randomId+"Input").length ) {
			$("#uploadForm"+randomId+"Input").off().remove();
		}

		var id = "uploadForm"+randomId+"Input";
		var _input = document.createElement("input");
		_input.style.top = "-100px";
		_input.style.position = "fixed";
		_input.setAttribute("type", "file");
		_input.setAttribute("id", id);
		_input.setAttribute("multiple", "multiple");

		if ( document.body ) {
			document.body.appendChild(_input);
		}

		self.options.files = _input;
		$(self.options.files).change(function(){
			self.send();
		});
	}

	var _getFormData = function(){
		var f = new FormData();
		for ( var i = 0; i < self.options.files.files.length; i++ ) {
			f.append("data[files][]", self.options.files.files[i]);
		}
		self.options.formData = f;
		return self;
	};

	var _upload = function(){
		var ajax = new XMLHttpRequest();
		ajax.upload.addEventListener("progress", function(e){
			if ( e.lengthComputable === true ) {
				if ( typeof self.options.progress == "function" ) {
					self.options.progress(Math.round(e.loaded/e.total*100));
				}
			}
		});

		ajax.addEventListener("readystatechange", function(){
			if ( this.readyState == 4 ) {
				self.options.files.value = '';
				if ( this.status == 200 ) {
					if ( typeof self.options.finished == "function" ) {
						self.options.finished(JSON.parse(this.response));
					}
				} else {
					if ( typeof self.options.error == "function" ) {
						self.options.error(this.status);
					}
				}
			}
		});

		ajax.open("post",self.options.url);
		ajax.send(self.options.formData);
	};

	self.send = function(){
		if ( !self.supported ) {
			throw new Error("Upload not supported");
		}

		if ( ! 'files' in self.options ) {
			throw new Error("No files attached");
		}

		if ( !self.options.files.files.length ) {
			throw new Error("No files attached (zero)");
		}

		_getFormData()
		_upload();
	};

	self.triggerClick = function(){
		_createInput();
		var e = document.createEvent("MouseEvents");
		e.initEvent("click", true, true);
		self.options.files.dispatchEvent(e, true);
	}

	self.supported = 'upload' in new XMLHttpRequest;

	return self;
}

/** jQuery Plugin **/
if ( typeof jQuery != "undefined" ) {
	(function ($) {
		$.fn.autoupload = function(options) {
			var options = $.extend(true, {}, options);
			if ( typeof options == "object" ) {
				$.each(this, function(i, obj){
					var u = new uploader(options, $);
					if ( obj.tagName.toLowerCase() == "input" && obj.hasAttribute("type") && obj.getAttribute("type") == "file" ) {
						$(obj).off('change').on({
							change: function(e){
								options.files = obj;
								u.send();
							}
						});
					} else {
						$(obj).bind('click', function(e){
							u.triggerClick();
						});
					}
				})
			}
		};
	}( jQuery ));
}
