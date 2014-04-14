var container = $('div#entries');
var liked = [];
var notliked = [];
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

	$('div#entries').on('click', '.HNfilter a', function(e){
		e.preventDefault();
		var status, text;

		try{
			text = $(this).parents('a.span15').contents()[0].textContent;
			var source = $(this).parents('a.span15').contents()[1].textContent;
		}catch(e){}

		//append source
		if(source){
			source = source.replace('(', '').replace(')', '');
			text = text + ' ' + source;
		}

		console.log(text);

		if($(this).hasClass('HNvoteUp')){
			console.log('liked');
			liked.push(text);
		}else if($(this).hasClass('HNvoteDown')){
			console.log('not-liked');
			notliked.push(text);
		}
	});