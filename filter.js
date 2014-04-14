var container = $('div#entries');
var entries = container.find('li.entry');
var span = $('<span>', {
	'class':'HNfilter',
	/*'style':'float: right;position: relative;top: -27px;'*/
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

//append this span to each li.entry
// $('div#entries li.entry').find('a:last').append(span);

//add upvote downvote buttons
entries.find('a:last').append(span);

function getText(ele){
	var a = $(ele).parents('a.link').clone();
	a.children().remove();
	return a.text().trim();
}

//handlers for upVote
$('div#entries').on('click', '.HNfilter .HNvoteUp', function(e){
	e.preventDefault();
	var text = getText($(this));
	/*console.log(text);
	console.log('vote up');*/
});
//handlers for DownVote
$('div#entries').on('click', '.HNfilter .HNvoteDown', function(e){
	e.preventDefault();
	var text = getText($(this));
	/*console.log(text);
	console.log('vote down');*/
});