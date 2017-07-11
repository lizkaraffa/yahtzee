window.Yahtzee = window.Yahtzee || {};

( function( window, document, $, app, undefined ) {
	'use strict';

	app.cache = function() {
		app.$ = {};
		app.$.ones = $(".one span");
		app.$.twos = $(".two span");
		app.$.threes = $(".three span");
		app.$.fours = $(".four span");
		app.$.fives = $(".five span");
		app.$.sixes = $(".six span");
		app.$.chance = $(".chance span");
		app.$.three_kind = $(".three-kind span");
		app.$.four_kind = $(".four-kind span");
		app.$.fullhouse = $(".full-house span");
		app.$.sml_straight = $(".sml-straight span");
		app.$.lg_straight = $(".lg-straight span");
		app.$.full_house = $(".full-house span");
		app.$.yahtzee = $(".yahtzee span");
		app.$.upper_total = $(".upper-total span");
		app.$.bonus = $(".bonus span");
		app.$.final = $(".final-score span");
		app.$.scores = $(".score span");
		app.$.roll_dice = $("#roll-dice");
		app.$.restart = $(".restart");
		app.$.tooltips = $('.tooltip');
		app.$.leftTooltip = $('.onboarding .tooltip');
		app.$.rightTooltip = $('.score .tooltip');
		app.$.only_scores = app.$.scores.not(app.$.upper_total).not(app.$.bonus).not(app.$.final);
		app.$.finish_game_modal = $('#finish-game');
		app.$.custom_message = $('.custom-message');
		app.$.overlay = $('.overlay');
		app.$.bonus_roll_modal = $('.bonus-roll-wrapper');
		app.$.bonus_score_modal = $('#bonus-score');
		app.$.bonus_score_info = $('.bonus-score-info');
	};

	app.$get = function( selectorString ) {
		if ( selectorString in app.$ ) {
			return app.$[ selectorString ];
		}

		let $test = $( selectorString );

		if ( $test.length ) {
			app.$[ selectorString ] = $test;
		}

		return $test;
	};

	app.$dice = function() {
		return app.$get( '.dice' );
	}

} )( window, document, jQuery, window.Yahtzee );
