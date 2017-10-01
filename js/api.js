function API(){
	var apiUrl = "https://services.comparaonline.com/dealer";
	this.deck = function(){
		var deferred = jQuery.Deferred();
		var result = deferred.promise();
  		$.post(apiUrl+'/deck').done(function(data) {
	        deferred.resolve(data);
	    })
	    .fail(function(jqXHR){
	        deferred.reject(jqXHR.status);
	    });
	    return result;
	}
	this.deal = function(deck,amount){
		var deferred = jQuery.Deferred();
		var result = deferred.promise();
		$.getJSON(apiUrl+'/deck/'+deck+'/deal/'+amount).done(function(data){
			deferred.resolve(data);
		})
		.fail(function(jqXHR){
	        deferred.reject(jqXHR.status);
		});
		return result;
	}
}