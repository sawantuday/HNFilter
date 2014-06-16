console.log('background js started');

var modeKey = 'HNFilterMode';
var container = $('div#entries');

//code for removing common words
var commonWords = ['a','able','about','above','abroad','according','accordingly','across','actually','adj','after','afterwards','again','against','ago','ahead','ain\'t','all','allow','allows','almost','alone','along','alongside','already','also','although','always','am','amid','amidst','among','amongst','an','and','another','any','anybody','anyhow','anyone','anything','anyway','anyways','anywhere','apart','appear','appreciate','appropriate','are','aren\'t','around','as','a\'s','aside','ask','asking','associated','at','available','away','awfully','b','back','backward','backwards','be','became','because','become','becomes','becoming','been','before','beforehand','begin','behind','being','believe','below','beside','besides','best','better','between','beyond','both','brief','but','by','c','came','can','cannot','cant','can\'t','caption','cause','causes','certain','certainly','changes','clearly','c\'mon','co','co.','com','come','comes','concerning','consequently','consider','considering','contain','containing','contains','corresponding','could','couldn\'t','course','c\'s','currently','d','dare','daren\'t','definitely','described','despite','did','didn\'t','different','directly','do','does','doesn\'t','doing','done','don\'t','down','downwards','during','e','each','edu','eg','eight','eighty','either','else','elsewhere','end','ending','enough','entirely','especially','et','etc','even','ever','evermore','every','everybody','everyone','everything','everywhere','ex','exactly','example','except','f','fairly','far','farther','few','fewer','fifth','first','five','followed','following','follows','for','forever','former','formerly','forth','forward','found','four','from','further','furthermore','g','get','gets','getting','given','gives','go','goes','going','gone','got','gotten','greetings','h','had','hadn\'t','half','happens','hardly','has','hasn\'t','have','haven\'t','having','he','he\'d','he\'ll','hello','help','hence','her','here','hereafter','hereby','herein','here\'s','hereupon','hers','herself','he\'s','hi','him','himself','his','hither','hopefully','how','howbeit','however','hundred','i','i\'d','ie','if','ignored','i\'ll','i\'m','immediate','in','inasmuch','inc','inc.','indeed','indicate','indicated','indicates','inner','inside','insofar','instead','into','inward','is','isn\'t','it','it\'d','it\'ll','its','it\'s','itself','i\'ve','j','just','k','keep','keeps','kept','know','known','knows','l','last','lately','later','latter','latterly','least','less','lest','let','let\'s','like','liked','likely','likewise','little','look','looking','looks','low','lower','ltd','m','made','mainly','make','makes','many','may','maybe','mayn\'t','me','mean','meantime','meanwhile','merely','might','mightn\'t','mine','minus','miss','more','moreover','most','mostly','mr','mrs','much','must','mustn\'t','my','myself','n','name','namely','nd','near','nearly','necessary','need','needn\'t','needs','neither','never','neverf','neverless','nevertheless','new','next','nine','ninety','no','nobody','non','none','nonetheless','noone','no-one','nor','normally','not','nothing','notwithstanding','novel','now','nowhere','o','obviously','of','off','often','oh','ok','okay','old','on','once','one','ones','one\'s','only','onto','opposite','or','other','others','otherwise','ought','oughtn\'t','our','ours','ourselves','out','outside','over','overall','own','p','particular','particularly','past','per','perhaps','placed','please','plus','possible','presumably','probably','provided','provides','q','que','quite','qv','r','rather','rd','re','really','reasonably','recent','recently','regarding','regardless','regards','relatively','respectively','right','round','s','said','same','saw','say','saying','says','second','secondly','see','seeing','seem','seemed','seeming','seems','seen','self','selves','sensible','sent','serious','seriously','seven','several','shall','shan\'t','she','she\'d','she\'ll','she\'s','should','shouldn\'t','since','six','so','some','somebody','someday','somehow','someone','something','sometime','sometimes','somewhat','somewhere','soon','sorry','specified','specify','specifying','still','sub','such','sup','sure','t','take','taken','taking','tell','tends','th','than','thank','thanks','thanx','that','that\'ll','thats','that\'s','that\'ve','the','their','theirs','them','themselves','then','thence','there','thereafter','thereby','there\'d','therefore','therein','there\'ll','there\'re','theres','there\'s','thereupon','there\'ve','these','they','they\'d','they\'ll','they\'re','they\'ve','thing','things','think','third','thirty','this','thorough','thoroughly','those','though','three','through','throughout','thru','thus','till','to','together','too','took','toward','towards','tried','tries','truly','try','trying','t\'s','twice','two','u','un','under','underneath','undoing','unfortunately','unless','unlike','unlikely','until','unto','up','upon','upwards','us','use','used','useful','uses','using','usually','v','value','various','versus','very','via','viz','vs','w','want','wants','was','wasn\'t','way','we','we\'d','welcome','well','we\'ll','went','were','we\'re','weren\'t','we\'ve','what','whatever','what\'ll','what\'s','what\'ve','when','whence','whenever','where','whereafter','whereas','whereby','wherein','where\'s','whereupon','wherever','whether','which','whichever','while','whilst','whither','who','who\'d','whoever','whole','who\'ll','whom','whomever','who\'s','whose','why','will','willing','wish','with','within','without','wonder','won\'t','would','wouldn\'t','x','y','yes','yet','you','you\'d','you\'ll','your','you\'re','yours','yourself','yourselves','you\'ve','z','zero'];
var regEx = new RegExp("\\b(?:"+commonWords.join("|")+")\\b", "ig");

//initialize bayesian classifier
var bayes = new Bayesian({thresholds: {notliked: 1,liked: 2}});
var sampleData = {};
var DATA_KEY = 'HN_JSON_Data';
var json = localStorage.getItem(DATA_KEY);
json = JSON.parse(json)
// console.log(json);
if(json){
	try{
		bayes.fromJSON(json);
	}catch(e){
		console.log('Error while loading saved state');
	}
}

//handler for msg from popup page
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);
		if(request.from !== 'popup')	return;		//check for requester
		if(request.action == 'set'){
			setMode(request.mode);					//set test mode
			sendResponse({'result':'success'});
		}else if(request.action == 'get'){
			var mode = getMode();					//get test mode
			sendResponse({'mode':mode, result:'success'});
		}else if (request.action == 'train'){
			//internalTrain();
			console.log('internal training called');
			sendResponse({result:'success'});
		}
});

function setMode(mode){
	localStorage.setItem(modeKey, mode);
	if(mode == 'training'){
		removeClassifier();
		renderTraining();	//training mode will be always shown
	}else if(mode == 'classifier'){
		removeButtons();
		renderClassifier();
	}
};

function getMode(){
	return localStorage.getItem(modeKey);
};

function renderClassifier(){
	//find all a tags and classify them with bayesian classifier
	//for all not interested a tags add class 'removed' - content.css
	var list = container.find('li a.span15');
	$.each(list, function(){
		var text = getText($(this));
		var category = bayes.classify(text);
		console.log(text, category);
		if(category == 'notliked')
			$(this).addClass('removed');
	});
};

function removeClassifier(){
	//remove classifier
	container.find('li a.span15').removeClass('removed');
};

function renderTraining(){
	//code for page manipulation
	var entries = container.find('li.entry');
	var span = $('<span>', {
		'class':'HNfilter',
		'style':'float: right;'
	});
	var up = $('<a>', {
		'text':'Up',
		'href':'#',
		'class':'HNvoteUp',
		'style':'margin-right: 10px;'
	}).appendTo(span);
	var down = $('<a>', {
		'text':'Down',
		'href':'#',
		'class':'HNvoteDown',
		'style':'margin-right: 10px;'
	}).appendTo(span);

	//add upvote downvote buttons
	entries.find('a:last').append(span);

	//handler for buttons
	$('div#entries').on('click', '.HNfilter a', function(e){
		e.preventDefault();
		var text = getText($(this).parents('a.span15'));
		var category = 'liked';		//default vlaue
		if($(this).hasClass('HNvoteUp')){
			category = 'liked';
		}else if($(this).hasClass('HNvoteDown')){
			category = 'notliked';
		}

		console.log(text, category);
		bayes.train(text, category);
	});
};

function removeButtons(){
	//remove vote up/down button while switching mode
	container.find('span.HNfilter').remove();
};

function getText(ele){	//code for votes handlers
	//get title text and source url
	try{
		var title = ele.contents()[0].textContent;
		var source = ele.contents()[1].textContent;
	}catch(e){}

	//remove common words
	var text = title.replace(regEx, '');
 	//stem all words
	// return title;

	var text = stem(text);
	// //append source
	if(source){
		source = source.replace('(', '').replace(')', '');
		text = text + ' ' + source;
	}

	return text;
};

function stem(doc){		//code for stemmer
	var words = doc.split(/\W+/);
    words = _(words).uniq();
    processed = [];
    words.forEach(function(word) {
    	processed.push(stemmer(word));
	}, this);
	return processed.join(' ');
};

function init(){
 	console.log('initializing plugin');
	if(getMode()=='classifier'){
		console.log('rendering classifier');
		renderClassifier();
	}else{
		console.log('rendering training');
		renderTraining();
	}
};

//save classifyer data on window unload
window.onbeforeunload = function(){
	var json = bayes.toJSON();
	localStorage.setItem(DATA_KEY, JSON.stringify(json));
};

init();