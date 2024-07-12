(function (){
	var element = document.createElement('script');
	element.type = "text/javascript";
	element.src = chrome.runtime.getURL('inject.js');;
	document.body.appendChild(element);
}());
 