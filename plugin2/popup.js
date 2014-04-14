console.log('done');

document.addEventListener('DOMContentLoaded', function(){
	//check if the localstorage value for filter mode is set
	var item = localStorage.getItem("HNFilterMode");
	var checkbox = document.querySelector('#filterMode');
	if(item == undefined || item == null){
		console.log('dasdas');
		localStorage.setItem("HNFilterMode", "training");
		chrome.extension.sendRequest({
			'action' : 'set_mode',
			'mode' : "training"
		});
	}

	checkbox.checked = localStorage.getItem("HNFilterMode") === "training" ? true : false;

	checkbox.addEventListener('click', function(e){
		console.log('clicked triggered');
		/*if(e.target.checked){
			localStorage.setItem("HNFilterMode", "training");
		}else{
			localStorage.setItem("HNFilterMode", "classifier");
		}*/
		var filtermode = e.target.checked
			? "training"
			: "classifier";

		chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
			console.log('response received');
		  	console.log(response);
		});
	});

});