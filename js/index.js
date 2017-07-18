window.Yahtzee = window.Yahtzee || {};

( function( window, document, $, app, undefined ) {
	'use strict';

	let $c;
	let $get;
	let yahtzees = [];
	let roll = rollDice();
	let roll_count = 3;
	let ran_once = false;

	// Get a random roll of 5 dice
	function rollDice() {
		let dice = [];

		for (var i = 0; i < 5; ++i) {
			dice[i] = Math.floor(Math.random() * 6) + 1;
		}
		return dice;
	}

	//generate the HTML to display the dice
	function diceHTML() {
		let html = "";
		for (var i = 0; i < 5; ++i) {
			html +=
			'<div class="dice die-' +
			i +
			" die-value-" +
			roll[i] +
			'">' +
			roll[i] +
			"</div>";
		}
		return html;
	}

	function onboarding_button() {
		let message = 'Toggle click the dice to hold them or release them for another roll.';
		$c.leftTooltip.removeClass('tooltip-1').addClass('tooltip-2').text(message);

		$c.roll_dice.one("click", function() {
			let message = 'Restart the game and let\'s play!';
			$c.leftTooltip.removeClass('tooltip-1').addClass('tooltip-4').text(message);
		});
	}

	function onboarding_dice() {
		let message = 'Click on a score title to read scoring instructions.';
		$c.leftTooltip.removeClass('tooltip-4').css("visibility","hidden");
		$c.rightTooltip.addClass('tooltip-5').text(message).css('visibility', 'visible');
	}

	function onboarding_instructions() {
		let message = 'Click anywhere on the screen.';
		$c.leftTooltip.removeClass('tooltip-2').css("visibility","hidden");
		$c.rightTooltip.removeClass('tooltip-5');
		$c.rightTooltip.addClass('tooltip-6').text(message).css('visibility', 'visible');
		$(document).one('click', function(){
			$c.rightTooltip.removeClass('tooltip-6');
			close_modal();
			let message = 'Click on any score to choose your points for this round.';
			$c.rightTooltip.addClass('tooltip-3').text(message);
		});
	}

	function onboarding_score() {
		let message = 'Roll the dice again to save your score and move to the next round.';
		$c.rightTooltip.removeClass('tooltip-3').css("visibility","hidden");
		$c.leftTooltip.addClass('tooltip-1').text(message).css('visibility', 'visible');
	}

	function onboarding_restart() {
		$c.tooltips.removeClass('tooltip-5').css('visibility', 'hidden');
		restart_game();
	}

	function onboarding_start() {
		setTimeout( function() {
			let message = 'Let\'s do one quick practice round. Roll the Dice.';
			$c.leftTooltip.addClass('tooltip-1').text(message).css('visibility', 'visible');
		}, 300 );
	}

	function tooltip() {
		onboarding_start();
		$c.roll_dice.one( 'click', onboarding_button );
		$(document).one( 'click', '.dice', onboarding_dice );
		$(document).one( 'click', '.scoring-info', onboarding_instructions );
		$(document).one( 'click', '.score span', onboarding_score );
		$(document).one( 'click', '.restart', onboarding_restart );
	}

	//Calculate the score for chance
	app.chance = function() {
		let score = 0;
		for (var i = 0; i < roll.length; i++) {
			score += roll[i];
		}
		return score;
	};

	//Calculate the score for ones
	app.ones = function() {
		let ones = roll;
		let score = 0;
		if (ones.indexOf(1) != -1) {
			ones = $.grep(ones, function(n) {
				return n === 1;
			});
			for (var i = 0; i < ones.length; i++) {
				score += ones[i];
			}
		}
		return score;
	};

	//Calculate the score for twos
	app.twos = function() {
		let twos = roll;
		let score = 0;
		if (twos.indexOf(2) != -1) {
			twos = $.grep(twos, function(n) {
				return n === 2;
			});
			for (var i = 0; i < twos.length; i++) {
				score += twos[i];
			}
		}
		return score;
	};

	//Calculate the score for threes
	app.threes = function() {
		let threes = roll;
		let score = 0;
		if (threes.indexOf(3) != -1) {
			threes = $.grep(threes, function(n) {
				return n === 3;
			});
			for (var i = 0; i < threes.length; i++) {
				score += threes[i];
			}
		}
		return score;
	};

	//Calculate the score for fours
	app.fours = function() {
		let fours = roll;
		let score = 0;
		if (fours.indexOf(4) != -1) {
			fours = $.grep(fours, function(n) {
				return n === 4;
			});
			for (var i = 0; i < fours.length; i++) {
				score += fours[i];
			}
		}
		return score;
	};

	//Calculate the score for fives
	app.fives = function() {
		let fives = roll;
		let score = 0;
		if (fives.indexOf(5) != -1) {
			fives = $.grep(fives, function(n) {
				return n === 5;
			});
			for (var i = 0; i < fives.length; i++) {
				score += fives[i];
			}
		}
		return score;
	};

	//Calculate the score for sixes
	app.sixes = function() {
		let sixes = roll;
		let score = 0;
		if (sixes.indexOf(6) != -1) {
			sixes = $.grep(sixes, function(n) {
				return n === 6;
			});
			for (var i = 0; i < sixes.length; i++) {
				score += sixes[i];
			}
		}
		return score;
	};

	//Calculates the score for three of a kind
	app.three_of_kind = function() {
		let score = 0;
		let isSameNum = frequency(roll);
		if (isSameNum >= 3) {
			for (var i = 0; i < roll.length; i++) {
				score += roll[i];
			}
			return score;
		} else {
			return score;
		}
	};

	//Calculates the score for four of a kind
	app.four_of_kind = function() {
		let score = 0;
		let isSameNum = frequency(roll);
		if (isSameNum >= 4) {
			for (var i = 0; i < roll.length; i++) {
				score += roll[i];
			}
			return score;
		} else {
			return score;
		}
	};

	//Calculate the score for a fullhouse
	app.fullhouse = function() {
		let score = 0;
		let fullhouse = roll;
		let frequency = {};
		let max = 0; // holds the max frequency.
		let most; // holds the max frequency element.
		for (var v in fullhouse) {
			frequency[fullhouse[v]] = (frequency[fullhouse[v]] || 0) + 1; // increment frequency.
			if (frequency[fullhouse[v]] > max) {
				// is this frequency > max so far ?
				max = frequency[fullhouse[v]]; // update max.
				most = fullhouse[v]; // update result.
			}
			// makes sure there is at least 3 of the same numbers
			if (max === 3) {
				fullhouse = $.grep(fullhouse, function(value) {
					//returns an array of remaining differing numbers
					return value != most;
				});
				//check to see if there are two items in the array and that they are the same score
				if (isSame(fullhouse) && fullhouse.length === 2) {
					score = 25;
				}
			}
		}
		return score;
	};

	//Calculates score for a small straight
	app.sml_straight = function() {
		let score = 0;
		let length = app.how_many_straight(roll);
		if (length >= 3) {
			score = 30;
		}
		return score;
	};

	//Calculates score for a large straight
	app.lg_straight = function() {
		let score = 0;
		let length = app.how_many_straight(roll);
		if (length === 4) {
			score = 40;
		}
		return score;
	};

	function frequency(array) {
		let frequency = {};
		let max = 0; // holds the max frequency.
		let most; // holds the max frequency element.
		for (var v in array) {
			frequency[array[v]] = (frequency[array[v]] || 0) + 1; // increment frequency.
			if (frequency[array[v]] > max) {
				// is this frequency > max so far ?
				max = frequency[array[v]]; // update max.
				most = array[v]; // update result.
			}
		}
		return max;
	}

	//Checks to see if all elements in the array are the same
	function isSame(array) {
		if (array.every((val, i, arr) => val == arr[0])) {
			return true;
		} else {
			return false;
		}
	}

	//Sorts array and counts how many dice -1 are in a straight
	app.how_many_straight = function(array) {
		let sorted = array.sort();
		let length = 0;
		for (var i = 0; i < sorted.length - 1; i++) {
			if (sorted[i + 1] - sorted[i] === 1) {
				length += 1;
			}
		}
		return length;
	};

	//Calculates the score for a yahtzee
	function yahtzee() {
		let score = 0;
		let is_same = isSame(roll);
		if (is_same) {
			score = 50;
		}
		return score;
	}

	//Counts how many yahtzees have occurred
	function count_yahtzees() {
		let count = 1;
		let is_same = isSame(roll);
		if (is_same) {
			count++;
		}
		return count;
	}

	//Calculates the score for extra yahtzees
	function extra_yahtzee() {
		let score = parseInt($c.yahtzee.html());
		score += 100;
		$c.yahtzee.html(score);
	}

	//Gets the values of all the held die and places them in an array
	function save_held_dice() {
		let saveNum = [];
		let heldDice = $(".hold").toArray();
		for (var i = 0; i < heldDice.length; i += 1) {
			saveNum.push(parseInt(heldDice[i].innerHTML));
		}
		return saveNum;
	}

	function printHTML(message) {
		$(".output").html(message);
	}

	//Grabs all the scores for the individual rolls and adds them up
	function upper_score() {
		let total = 0;
		let saving = parseInt($(".upper-scores li .saving").html());
		if (saving) {
			total = saving;
		}
		let values = $(".upper-scores .saved")
		.map(function() {
			return parseInt($(this).html());
		})
		.get();
		for (var i = 0; i < values.length; i++) {
			total += values[i];
		}
		return total;
	}

	//Checks if the upper score is greater than or equals 65 and applies a bonus if appropriate
	function bonus() {
		let score = 0;
		let upper = parseInt($(".upper-total span").html());
		if (upper >= 65) {
			score = 35;
		}
		return score;
	}

	//Grabs any values in the process of being saved, bonus, and saved values and adds them up
	function final_score() {
		let total = 0;
		let saving = parseInt($(".saving").html());
		if (saving) {
			total = saving;
		}
		if (bonus() !== 0) {
			total += bonus();
		}
		let values = $(".saved")
		.map(function() {
			return parseInt($(this).html());
		})
		.get();
		for (var i = 0; i < values.length; i++) {
			total += values[i];
		}
		return total;
	}

	//Shows Bonus Roll Modal if there is another yahtzee
	function bonus_roll_html() {
		app.$.bonus_roll_modal.css('display','block');
	}

	//Shows modal and custom message for end of game.
	function finish_game_html() {
		$c.finish_game_modal.css('display', 'block');
		$c.overlay.css('display', 'block');
		let message = 'You scored ' + final_score() + ' points!';
		app.$.custom_message.append(message);
	}

	function scoring_info_html( i, data ) {
		let score = i;
		let scoring_info = [
		{
			die_values: '<div class="dice die-value-1"></div><div class="dice die-value-1"></div><div class="dice die-value-1"></div><div class="dice die-value-5"></div><div class="dice die-value-1"></div>',
			score: 4
		},
		{
			die_values: '<div class="dice die-value-2"></div><div class="dice die-value-5"></div><div class="dice die-value-2"></div><div class="dice die-value-4"></div><div class="dice die-value-2"></div>',
			score: 6
		},
		{
			die_values: '<div class="dice die-value-3"></div><div class="dice die-value-6"></div><div class="dice die-value-3"></div><div class="dice die-value-4"></div><div class="dice die-value-2"></div>',
			score: 6
		},
		{
			die_values: '<div class="dice die-value-4"></div><div class="dice die-value-1"></div><div class="dice die-value-3"></div><div class="dice die-value-4"></div><div class="dice die-value-4"></div>',
			score: 12
		},
		{
			die_values: '<div class="dice die-value-5"></div><div class="dice die-value-1"></div><div class="dice die-value-3"></div><div class="dice die-value-4"></div><div class="dice die-value-5"></div>',
			score: 10
		},
		{
			die_values: '<div class="dice die-value-6"></div><div class="dice die-value-2"></div><div class="dice die-value-6"></div><div class="dice die-value-6"></div><div class="dice die-value-5"></div>',
			score: 18
		},
		{
			die_values: '<div class="dice die-value-4"></div><div class="dice die-value-4"></div><div class="dice die-value-2"></div><div class="dice die-value-6"></div><div class="dice die-value-4"></div>',
			score: 20
		},
		{
			die_values: '<div class="dice die-value-5"></div><div class="dice die-value-5"></div><div class="dice die-value-5"></div><div class="dice die-value-3"></div><div class="dice die-value-5"></div>',
			score: 23
		},
		{
			die_values: '<div class="dice die-value-4"></div><div class="dice die-value-4"></div><div class="dice die-value-2"></div><div class="dice die-value-2"></div><div class="dice die-value-4"></div>',
			score: 25
		},
		{
			die_values: '<div class="dice die-value-4"></div><div class="dice die-value-1"></div><div class="dice die-value-6"></div><div class="dice die-value-5"></div><div class="dice die-value-4"></div>',
			score: 20
		},
		{
			die_values: '<div class="dice die-value-5"></div><div class="dice die-value-3"></div><div class="dice die-value-6"></div><div class="dice die-value-5"></div><div class="dice die-value-4"></div>',
			score: 30
		},
		{
			die_values: '<div class="dice die-value-5"></div><div class="dice die-value-3"></div><div class="dice die-value-1"></div><div class="dice die-value-2"></div><div class="dice die-value-4"></div>',
			score: 40
		},
		{
			die_values: '<div class="dice die-value-3"></div><div class="dice die-value-3"></div><div class="dice die-value-3"></div><div class="dice die-value-3"></div><div class="dice die-value-3"></div>',
			score: 50
		},
		];

		data = $.extend( {}, scoring_info[score], data );

		let html = '';
		html += '<div class="overlay"></div>';
		html += '<div class="modal-wrapper">';
		html += '<div class="modal scoring-info">';
		html += '<h2>How Scoring Works</h2>';
		html += '<p>You must select one score every round. You can only choose this score once per game.</p>';
		html += '<p>'+ data.instructions + '</p>';
		html += '<div class="output">';
		html += data.die_values;
		html += '</div>';
		html += '<p>The score for this <strong>' + data.title + '</strong> example is <strong>' + data.score + '</strong>.</p>';
		html += '</div>';
		html += '</div>';
		$(".wrapper").append(html);
	}

	function bonus_score_info() {
		app.$.bonus_score_info.click(function(event) {
		  	event.preventDefault();
			app.$.bonus_score_modal.css('display', 'block');
			app.$.overlay.css('display', 'block');
			close_modal();
		});
	}

	function end_game() {
		$('#finish-game .button').off().on("click", function() {
			$('.overlay').remove();
			$('.modal-wrapper').remove();

			if( $(this).hasClass('yes') ) {
				restart_game();
			} else if( $(this).hasClass('no') ) {
				$(".saving").removeClass("saving").addClass("saved").text();
				$c.roll_dice.addClass("disabled");
			}
		});
	}

	function restart_game() {
		roll_count = 3;
		$c.scores.empty().removeClass('saved').removeClass('saving');
		app.$dice().removeClass('hold');
		$(".rolls-left span").empty().html(roll_count);
		$c.roll_dice.removeClass("disabled");
		return roll_count;
	}

	function start_game() {
		$('#welcome .button').off().on("click", function() {
			$('.overlay').hide();
			$('.modal-wrapper').hide();

			if( $(this).hasClass('yes') ) {
				tooltip();
			} else {
				return;
			}
		});
	}

	function close_modal() {
		$('.modal-wrapper').on('click', function(){
			$('.overlay').hide();
			$('.modal-wrapper').hide();
		});
		$('.overlay').on('click', function(){
			$('.overlay').hide();
			$('.modal-wrapper').hide();
		});
	}

	function show_scoring_info() {
		let selectors = {
			'.one a' : 0,
			'.two a' : 1,
			'.three a' : 2,
			'.four a' : 3,
			'.five a' : 4,
			'.six a' : 5,
			'.three-kind a' : 6,
			'.four-kind a' : 7,
			'.full-house a' : 8,
			'.chance a' : 9,
			'.sml-straight a' : 10,
			'.lg-straight a' : 11,
			'.yahtzee a' : 12,
		};

		let $document = $(document);
		$.each( selectors, function( selector, scoreInfoIndex ) {
			$document.on( 'click', selector, function(){
				scoring_info_html(scoreInfoIndex, $( this ).parents( 'li' ).data() );
				close_modal();
			});
		} );
	}

	app.init = function() {
		app.cache();
		$c = app.$;
		$get = app.$get;

		printHTML( diceHTML() );
		start_game();
		show_scoring_info();
		bonus_score_info();

		let timeout = null;

		//If no activity for 8 secs, shake the dice
		$(document).on('mousemove', function() {
			clearTimeout(timeout);
			$('.game .dice').removeClass('shake');

			timeout = setTimeout(function() {
				$('.game .dice').addClass('shake');
			}, 8000);
		});

		//Restarts the game
		$c.restart.off().on("click", function() {
			restart_game();
		});

		// Displays how many rolls are left;
		$(".rolls-left span").html(roll_count);
		$("#roll-dice").on("click", function() {
			//Decrease the roll count by 1
			roll_count--;

			//app.single_scores();

			 //Only allows 3 rolls before selecting score
			 if (roll_count <= -1 &&
			 	!$c.scores.hasClass("saving") ||
			 	$c.roll_dice.hasClass('disabled') ) {
			 	return;
			}

			// Updates the number of remaing rolls after the dice are rolled;
			$(".rolls-left span").empty().html(roll_count);

			// Doesn't allow the held dice to be changed.
			if ($(".dice").hasClass("hold")) {
				let count = save_held_dice().length;
				roll = rollDice();
				roll.splice(0, count, save_held_dice());
				roll = [].concat.apply([], roll);
				printHTML(diceHTML());
				for (var i = 0; i < count; i += 1) {
					$(".die-" + i).addClass("hold");
				}
			} else {
				// makes an entirely new random roll
				roll = rollDice();
				printHTML(diceHTML());
			}

			//Let's you select the score you want to enter
			$c.only_scores.off().on("click", function() {
				$c.scores.removeClass("saving");

				//Ensure there isn't an already saved score
				if ( ! $(this).hasClass('saved') ) {
					$(this).addClass("saving").text();
				}

				//refreshes the upper and final scores
				$c.upper_total.empty().append(upper_score());
				$c.roll_dice.removeClass("disabled");
				$c.final.empty().append(final_score());

				//Prepares to set up a new round
				$(".dice").removeClass("hold");
				roll_count = 3;

				//Checks to see if game needs to end
				let length = $c.only_scores.length;
				let saved = $(".saved").length;
				let saving = $(this).hasClass('saving');
				let remaining = ( length - saved ) - 1;

				if ( remaining < 1 && saving ) {
					finish_game_html();
					end_game();
				}
			});

			//Saves pending scores when you roll
			if ($("span").hasClass("saving")) {
				$(".saving").removeClass("saving").addClass("saved").text();
				$('dice').off();
				$c.upper_total.empty().append(upper_score());
				$c.final.empty().append(final_score());
			}

			//Visual cue to save score before continuing to roll
			if (roll_count === 0) {
				$c.roll_dice.addClass("disabled");
			}

			if (roll_count !== 0 && ! $c.only_scores.hasClass('saving') ) {
				//Clicking the die holds or removes its hold
				$(".dice").on("click", function() {
					$(this).toggleClass("hold").text();
				});
			}

			// Array
			var scoreboard = {
				chance: $c.chance,
				ones: $c.ones,
				twos: $c.twos,
				threes: $c.threes,
				fours: $c.fours,
				fives: $c.fives,
				sixes: $c.sixes,
				three_of_kind: $c.three_kind,
				four_of_kind: $c.four_kind,
				fullhouse: $c.fullhouse,
				sml_straight: $c.sml_straight,
				lg_straight: $c.lg_straight,
			};

			// Appends all the scores to the scoreboards
			$.each( scoreboard, function( scoreMethod, $selector ) {
				if( ! $selector.hasClass( "saved" ) ) {
					$selector.empty().append( app[scoreMethod]() );
				}
			} );

			if (!$c.yahtzee.hasClass("saved")) {
				$c.yahtzee.empty().append(yahtzee());
				// checks to see if there is a saved yahtzee, there is more than one yahtzee, and the score at least equals 50.
			} else if (count_yahtzees() > 1 && parseInt($c.yahtzee.html()) >= 50) {
				$c.yahtzee.removeClass("saved").addClass("saving");
				extra_yahtzee();
				bonus_roll_html();
				$c.roll_dice.addClass('disabled');
				$(".bonus-roll-wrapper").on("click", function() {
					$(this).remove();
					$c.yahtzee.addClass("saved");
					$c.roll_dice.removeClass('disabled');
				});
			}
			$c.bonus.empty().append( bonus() );
		});
	};

	$( app.init );

} )( window, document, jQuery, window.Yahtzee );
