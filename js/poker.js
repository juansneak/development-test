'use strict';
function Poker(){
	var api = new API();
	var rankings = ['0','High Card', 'One Pair', 'Two Pairs', 'Three of a kind', 'Straight', 'Flush', 'Full House', 'Four of a kind', 'Straight Flush', 'Royal Flush'];
	
	//Create a deck of cards
	this.createDeck = function(){
		var deferred = jQuery.Deferred();
		var result = deferred.promise();
		api.deck().done(function(token){
			deferred.resolve(token);
		}).fail(function(error){
			deferred.reject(errorMessage(error));
	    });
		return result;
	}

	//Create a hand 
	this.createHand = function(deck,amount){
		var deferred = jQuery.Deferred();
		var result = deferred.promise();
		var index;
		var numbers = [];
		var orderedNumbers = [];
		var suits = [];
		var hand = [];
		var values = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		api.deal(deck,amount).done(function(data){
			for (var i=0; i<data.length; i++) {
				var value = values.indexOf(data[i]['number']);
				data[i]['value'] = value;
				if(typeof(numbers[value]) === 'undefined'){
					numbers[value] = [];
				}
				numbers[value].push(data[i]);
				orderedNumbers.push(value);

				if(typeof(suits[data[i]['suit']]) === 'undefined'){
					suits[data[i]['suit']] = [];
				}
				suits[data[i]['suit']].push(data[i]);
			}
			hand['cards'] = data;
			hand['numbers'] = numbers;
			hand['orderedNumbers'] = orderedNumbers.sort((a, b) => a - b);
			hand['consecutive'] = consecutiveValues(hand['orderedNumbers'])
			hand['suits'] = suits;
			hand['ranking'] = calculateRanking(hand);
			deferred.resolve(hand);
		}).fail(function(error){
			deferred.reject(errorMessage(error));
		});
		return result;
	}

	//Handle errors
	function errorMessage(error){
		switch(error){
			case 500:
				return 'There was an error on the server. Please try again';
				break;
			case 405:
				return 'There aren’t enough cards to deal the amount requested';
				break;
			case 404:
				return 'Deck was not found. Please shuffles a new deck';
				break;
			default:
				return 'There was an unexpected error. Please try again';
		}
	}

	//Calculate the ranking of the hand
	function calculateRanking(hand){
		if(isRoyalFlush(hand)){
			return 10;
		}else if (isStraightFlush(hand)){
			return 9;
		}else if(isFourOfAKind(hand)){
			return 8;
		}else if(isFullHouse(hand)){
			return 7;
		}else if(isFlush(hand)){
			return 6;
		}else if(hand['consecutive']){
			return 5;
		}else if (isThreeOfAKind(hand)){
			return 4;
		}else if (isTwoPairs(hand)){
			return 3;
		}else if (isOnePair(hand)){
			return 2;
		}else{
			return 1;
		}
	}

	function isRoyalFlush(hand){
		if(Object.keys(hand['suits']).length == 1 && hand['consecutive'] && hand['orderedNumbers'][0] == 10){
			return true;
		}
		return false;
	}

	function isStraightFlush(hand){
		if(Object.keys(hand['suits']).length == 1 && hand['consecutive']){
			return true;
		}
		return false;
	}

	function isFourOfAKind(hand){
		var keys = Object.keys(hand['numbers']);
		for(var i=0; i<keys.length;i++){
			if(Object.keys(hand['numbers'][keys[i]]).length == 4){
				return true;
			}
		}
		return false;
	}

	function isFullHouse(hand){
		var keys = Object.keys(hand['numbers']);
		var pair = false;
		var threeOfAKind = false;
		for(var i=0; i<keys.length;i++){
			if(Object.keys(hand['numbers'][keys[i]]).length == 2){
				pair = true;
			}else if (Object.keys(hand['numbers'][keys[i]]).length == 3){
				threeOfAKind = true;
			}
			if(pair && threeOfAKind){
				return true;
			}
		}
		return false;
	}

	function isFlush(hand){
		if(Object.keys(hand['suits']).length == 1){
			return true;
		}
		return false;
	}

	function isThreeOfAKind(hand){
		var keys = Object.keys(hand['numbers']);
		for(var i=0; i<keys.length;i++){
			if(hand['numbers'][keys[i]].length == 3){
				return true;
			}
		}
		return false;
	}

	function isTwoPairs(hand){
		var firstPair = false;
		var keys = Object.keys(hand['numbers']);
		for(var i=0; i<keys.length;i++){
			if(hand['numbers'][keys[i]].length == 2){
				if(firstPair){
					return true;
				}else{
					firstPair = true;
				}
			}
		}
		return false;
	}

	function isOnePair(hand){
		var keys = Object.keys(hand['numbers']);
		for(var i=0; i<keys.length;i++){
			if(hand['numbers'][keys[i]].length == 2){
				return true;
			}
		}
		return false;
	}

	//Check if the values are consecutive
	function consecutiveValues(values){
		for (var i=0; i<values.length-1; i++) {
			if(values[i] != values[i+1]-1){
				return false;
			}
		}
		return true;
	}

	//Compare rankings and find the winner
	this.findWinner = function (hand1,hand2){
		var ranking1 = hand1['ranking'];
		var ranking2 = hand2['ranking'];
		var winner = [];
		if (ranking1 > ranking2){
			return selectWinner(hand1);
		}else if (ranking1 < ranking2){
			return selectWinner(hand2);
		}else{
			for (var i=hand1['orderedNumbers'].length-1; i>0; i--) {
				if(hand1['orderedNumbers'][i] > hand2['orderedNumbers'][i]){
					return selectWinner(hand1);
				}else if(hand1['orderedNumbers'][i] < hand2['orderedNumbers'][i]){
					return selectWinner(hand2);
				}
			}
			return selectWinner(null);
		}
	}

	function selectWinner(hand){
		var winner=[];
		if(hand === null){
			winner['cards'] = null;
			winner['ranking'] = "It's a tie";
		}else{
			winner['cards'] = hand['cards'];
			winner['ranking'] = rankings[hand['ranking']];
		}
		return winner;
	}
}