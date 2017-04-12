javascript.uploader
===================

A jQuery plugin to upload files with XHR2
 
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
