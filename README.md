javascript.uploader
===================

A native javascript file upload with XHR2 and also includes a jQuery plugin

Example using native javascript
 ```javascript
 uploader.send({
	url: "somewhere_to_post_data.php",
	finished: function(answer){
		alert("done!");
	},
	progress: function(percentage){
		console.log("Progress: "+percentage+"%");
	}
});
 ```
 
 Example using jQuery:
 ```javascript
 $("#anyElement").autoupload({
	url: "somewhere_to_post_data.php",
	finished: function(answer){
		alert("done!");
	},
	progress: function(percentage){
		console.log("Progress: "+percentage+"%");
	}
});
```
