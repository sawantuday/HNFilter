//this would be a json backed model
//load filters like title, domain, votes
//every article will start with a score of 100
//reduce its score when it contains disliked keyword/domain
//and vice versa
//then articles below certain threashold will be removed
//from the view
function model(){
	this.keywordsLiked = {};
	this.keywordsDisliked = {};
	this.domainsLiked = {};
	this.domainsDisliked = {};
	this.ignoredWords = ['the', 'was', 'is', 'done', 'my'];
	this.HNkey = 'HNfilterData';
	// votesDefault = 50;	//starting value for votes
};

/**
 * pass new article to model to get its score
 * @return {[type]} [description]
 */
model.prototype.test = function(link){
	var title = link.title;
	var domain = link.domain;
	var words = title.split(' ');
	var score = 0;
	//split each word in article title
	//for each word check if it contains in liked or disliked and
	//add/substract the score attached with word from link
	for(var i in words){
		var word = words[i];
		//check if this word is in ignored list
		if(this.ignoredWords.indexOf(word) >= 0){
			continue;
		}
		//check if the word contains in disliked list
		if(this.keywordsDisliked.hasOwnProperty(word)){
			score -= this.keywordsDisliked[word];
		}
		//check if the word contains in liked list
		if(this.keywordsLiked.hasOwnProperty(word)){
			score += this.keywordsLiked[word];
		}
	}

	//check for domain score
	if(this.domainsDisliked.hasOwnProperty(domain)){
		score -= this.domainsDisliked[word];
	}
	if(this.domainsLiked.hasOwnProperty(domain)){
		score += this.domainsLiked[word];
	}

	//return score for this link
	link.score += score;
	return link;
};

/**
 * on article upvote/downvote pass article data (title, domain, votes)
 * to model. update keywords values according to this new entry
 * @return {[type]} [description]
 */
model.prototype.train = function(link){
	var title = link.title;
	var domain = link.domain;
	var liked = link.liked;
	var words = title.split(' ');
	// var votes = link.votes;
	if(liked){
		//add/update word in keywordsLiked
		for(var i in words){
			var word = words[i];
			if(this.ignoredWords.indexOf(word) >= 0){
				continue;
			}
			if(this.keywordsLiked.hasOwnProperty(word)){
				this.keywordsLiked[word] += 1;
			}else{
				this.keywordsLiked[word] = 1;
			}
		}

		//add or udpate domain
		if(this.domainsLiked.hasOwnProperty(word)){
			this.domainsLiked[word] += 1;
		}else{
			this.domainsLiked[word] = 1;
		}
	}else{
		//this is for link disliked
		for(var i in words){
			var word = words[i];
			if(this.ignoredWords.indexOf(word) >= 0){
				continue;
			}
			if(this.keywordsDisliked.hasOwnProperty(word)){
				this.keywordsDisliked[word] += 1;
			}else{
				this.keywordsDisliked[word] = 1;
			}
		}

		//add or udpate domain
		if(this.domainsDisliked.hasOwnProperty(word)){
			this.domainsDisliked[word] += 1;
		}else{
			this.domainsDisliked[word] = 1;
		}
	}

	//save this model
	this.save();
};

//save this model data in JSON format
model.prototype.save = function(){
	var data = JSON.stringify(this);
	localStorage.setItem(this.HNkey, data);
};

//load model from saved JSON data
model.prototype.load = function(){
	var json = localStorage.getItem(this.HNkey);
	var model = JSON.parse(json);
	for(var i in model){
		if(model.hasOwnProperty(i)){
			this[i] = model[i];
		}
	}
};