$(document).ready(function(){
	var poker = new Poker();
	var deck_token;
	var hand1;
	var hand2;
	$('#shuffles_cards').click(function(){
		$('.hand_button, .play_button').hide();
		$('.hand_message, .cards, .winner').html('');
		$('.winner_message').html('');
		hand1 = null;
		hand2 = null;
		poker.createDeck().done(function(token){
			deck_token = token;
			$('#shuffle_message').html('Your deck of cards is ready!. This is your token: '+deck_token);
			$('.select_hand1').show();
		})
		.fail(function(error){
			$('#shuffle_message').html(error);
			$('.hand_button').hide();
		});
	});

	$('.select_hand1').click(function(){
		$('.winner').html('');
		$('.winner_message').html('');
		poker.createHand(deck_token,5).done(function(data){
			hand1 = data;
			$('.hand1_cards').html(displayCards(hand1));
			$('.select_hand2').show();
			$('.hand1_message').html('');
			if(typeof(hand2) !== 'undefined' && hand2 !== null){
				$('.play_button').show();
			}
		}).fail(function(error){
			hand1 = null;
			$('.hand1_message').html(error);
			$('.hand1_cards').html('');
			$('.play_button').hide();
		});
	});

	$('.select_hand2').click(function(){
		$('.winner').html('');
		$('.winner_message').html('');
		poker.createHand(deck_token,5).done(function(data){
			hand2 = data;
			$('.hand2_cards').html(displayCards(hand2));
			$('.hand2_message').html('');
			$('.play_button').show();
		}).fail(function(error){
			hand2 = null;
			$('.hand2_message').html(error);
			$('.hand2_cards').html('');
			$('.play_button').hide();
		});
	});

	$('.play_button').click(function(){
		var winner = poker.findWinner(hand1,hand2);
		$('.winner').html('<h3>The Winner is: </h3>'+displayCards(winner));
		$('.winner_message').html('Ranking: '+winner['ranking']);
	});

	function displayCards(hand){
		if(hand['cards'] !== null){
			var list = '<ul>';
			for(var i=0; i<hand['cards'].length;i++){
				list += '<li>'+hand['cards'][i]["number"]+' '+hand['cards'][i]["suit"]+'</li>';
			}
			list += '</ul>';
			return list;
		}
	}
});