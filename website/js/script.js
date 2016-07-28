$(".linkedin").hover(function(){
	colorImage(this)
}, function(){
	blackImage(this)
})
$(".twitter").hover(function(){
	colorImage(this)
}, function(){
	blackImage(this)
})
$(".github").hover(function(){
	colorImage(this)
}, function(){
	blackImage(this)
})

function colorImage(icon){
	if ($(icon).hasClass('linkedin')){
		$(icon).attr('src', 'img/linkedin_color.svg')
	} else if ($(icon).hasClass('twitter')){
		$(icon).attr('src', 'img/twitter_color.svg')	
	} else { //github
		$(icon).attr('src', 'img/github_color.svg')
	}
}
function blackImage(icon){
	if ($(icon).hasClass('linkedin')){
		$(icon).attr('src', 'img/linkedin.svg')
	} else if ($(icon).hasClass('twitter')){
		$(icon).attr('src', 'img/twitter.svg')
	} else { //github
		$(icon).attr('src', 'img/github.svg')
	}
}