console.log('popup loaded');

document.addEventListener('DOMContentLoaded', function(){
	var checkbox = document.querySelector('#filterMode');
	var trainBtn = document.querySelector('#trainBtn');
	/*chrome.runtime.sendMessage({action:"get"}, function(response) {
		checkbox.checked = response.mode == "training";
	});*/

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {from: "popup", action:"get"}, function(response) {
	    console.log(response);
	    checkbox.checked = response.mode == "training";
	  });
	});

	trainBtn.addEventListener('click', function(){
		console.log('calling internal train');
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {from: "popup", action:"train"}, function(response) {
		    console.log(response);
		  });
		});
	});
	checkbox.addEventListener('click', function(e){
		console.log('updating filter mode');
		var filtermode = e.target.checked
			? "training"
			: "classifier";

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {from: "popup", action:"set", mode:filtermode}, function(response) {
		    console.log(response);
		  });
		});

		/*chrome.runtime.sendMessage({action: "set", mode:filtermode}, function(response) {
 		  	console.log(response);
		});*/
	});

});