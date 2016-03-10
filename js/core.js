

$(document).ready(function(){


	//utilities

	function randomInt(min,max)

	{
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	function inArray(needle, haystack) {
		var length = haystack.length;
		for(var i = 0; i < length; i++) {
			if(haystack[i] == needle) return true;
		}
		return false;
	}

	function generateDeckCards(){
		var deck = [];

		for (var i = 0; i < cards.length; i++) {
			card = cards[randomInt(0,52)];
			if(inArray(card, deck) == false & card != ''){
				deck[i] = card;
			}
		};
		return deck;
	}

	// Debug Function
	function showCards(){
		for (var i = 0; i < cards.length; i++) {
			console.log()
			$("#deck").append(cards[i].name + ' de ' +cards[i].type + ' ---- Valor: ' + cards[i].value + '<br>');
		};
	}

	function removeFromCards(card){

		for (var i = 0; i < cards.length; i++) {
			if(cards[i] === card) {
				cards.splice(i,1);
				return false;
			}
		}
	}


	function getCardfromDeck(){
		var number = randomInt(0, cards.length);
		card = cards[number];
		return card;
	}

	//Check the possibilty of success dont explode calling on deck
	function getCallSuccessPossibilities(value){
		var counter = 0;
		var allCombinations = 0;
		var probability = 0;
		var base =  21 - value;

		for (var i = 0; i < cards.length; i++) {
			if(cards[i].value <= base){
                counter++;
				//console.log(cards[i].name + ' ' + cards[i].type + ' ' + cards[i].value);
			}
        }
		console.log(counter);
		console.log(cards.length);
        probability = parseFloat(counter/cards.length);
	return probability;
}

	function callDeck(player){
		card = getCardfromDeck()
		player.push(card);
		removeFromCards(card);
		return player;
	}

	function showPlayer1Cards(player){
		var totalValue = 0;
		$("#p1cards").html('');
		for (var i = 0; i < player.length; i++) {
			$('#p1cards').append('<img style="height: 100px; width: 80px; margin-right: 80px;" src ='+player[i].image+'>');
			totalValue = totalValue + player[i].value;
			player.points = totalValue;
		};
			console.log("Total de Pontos:"+	 totalValue);
	}

	function showPlayer2Cards(player){
		var totalValue = 0;
		$("#p2cards").html('');
		for (var i = 0; i < player.length; i++) {
			$('#p2cards').append('<img style="height: 100px; width: 80px; margin-right: 80px;" src ='+player[i].image+'>');
			totalValue = totalValue + player[i].value;
			player.points = totalValue;
		};
			console.log("Total de Pontos:"+	 totalValue);
	}

	//Check win or lose
	function checkStatusofGame(player1, player2, param){

        if(param == 1){
            if(player1.points < 21 &  player1.points > player2.points)
            alert('Player 1 Venceu');
            location.reload();
        }

        if(player1.points == 21){
            alert('Player 1 Venceu');
            location.reload();
        }
        if(player2.points == 21){
            alert('Player 2 Venceu');
            location.reload();
        }
        if(player1.points > 21){
            alert('Player 1 Estourou');
            location.reload();
        }
        if(player2.points > 21){
            alert('Player 2 Estourou');
            location.reload();
        }
	}

	var turn = 0;
	function handle(){
		if(turn == 0) {
			console.log('Vez do Player 1');
			$('#button').css("display","block");
			turn++;
		}else{
			console.log('Vez do Player 2');
			$('#button').css("display","none");
			decisionMaker(player1, player2);
            turn--;
		}
	}

	// restart from here
    function decisionMaker(player1, player2){
		var possibility = getCallSuccessPossibilities(player2.points);
			console.log(possibility.toFixed(3)) ;
			//Define some profiles
            if(possibility > 0.50){
                callDeck(player2);
				showPlayer2Cards(player2);
				checkStatusofGame(player1, player2);
                console.log(breathFirst(player2.points));
                console.log(blindSearch(player2.points));
				handle();
			    return true;
            }
            else{
                $('#IA').append('Parei!');
                return false;
            }
	}
 	// finish this
	function setProfile(n){
		var profiles = [
		{"id":"1","name":"agressive"},
		{"id":"2","name":"normal"},
		{"id":"3","name":"passive"},
		];
		return profiles[n];
	}

    function breathFirst(value){
       	var nodes = 0;
		var base =  21 - value;
        cardsSorted = cards;
        cardsSorted = cardsSorted.sort(byVal);//sort cards
        if(base > 10){
            base = 10;
        }
        for (var i = 0; i < cards.length; i++) {
			nodes++;
            if(cardsSorted[i].value >= base){
                console.table(cardsSorted[i]);
                break;
            }
        }
        console.log('BreathFirst:');
		console.log('A quantidade de nós até o primeiro melhor  valor acessivel :' + nodes);
	return nodes;
  }

   function blindSearch(value){
       	var nodes = 0;
		var base =  21 - value;
            //cards = cards.sort(byId);
		for (var i = 0; i < cards.length; i++) {
            nodes++;
			console.log(nodes);
            if(cards[i].value <= base){
                console.table(cards[i]);
                break;
            }
        }
        console.log('BUSCA CEGA');
		console.log('A quantidade de nós até o primeiro valor acessivel :' + nodes);
	return nodes;
  }

  function byVal(cardA, cardB) {
          return cardA.value > cardB.value;
  }

    // initiate the game and the cards of players
    var player1 = [];
    
    callDeck(player1);
    callDeck(player1);

    var player2 = [];
    player2.profile = setProfile(1);
    callDeck(player2);
    callDeck(player2);

    // Show Cards
    showPlayer1Cards(player1);
    showPlayer2Cards(player2);
    handle();

    $('#stop').click(function(){
        checkStatusofGame(player1, player2, 1);
    });

    $('#deck').click(function(){
        callDeck(player1);
        showPlayer1Cards(player1);
        checkStatusofGame(player1, player2);
        handle();
    });

    //decisionMaker(player1,player2);
	//console.table(player2);

   console.log(breathFirst(player2.points));
   console.log(blindSearch(player2.points));

});
