function single_scores() {
		let single_score = 0;
		let ones = roll;
		let twos = roll;
		let threes = roll;
		let fours = roll;
		let fives = roll;
		let sixes = roll;
    let scores = [];
		let index = {
			ones : 1,
			twos : 2,
			threes : 3,
			fours : 4,
			fives : 5,
			sixes : 6,
		};
		$.each( index, function( haystack, needle ) {
			if (haystack.indexOf(1) != -1) {
				haystack = $.grep(haystack, function(n) {
					return n === needle;
				});
				for (var i = 0; i < haystack.length; i++) {
					single_score += haystack[i];
				}
        console.log(single_score);
			}
		});
}

single_scores();