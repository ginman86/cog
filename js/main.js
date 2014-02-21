$(document).ready
(function()
{
	//**************Basic Flow of App************** (For part 1)
	//
	// *After ID number we need gender, age, previousGermanKnowledge demographic information
	// *Instruction on how to complete study and test trials
	// *Core app function (e.g. blocks of various study and test trials dependent upon the conditions)
	// *Ending of the app / reminder of part 2
	//
	//*********************************************
	
	var login 			= $("#login"),
		main			= $("#main"),
		success			= $("#success"),
		data			= private.getData(),
		answerInput     = $('.answerInput', main),
		currentQuestion	= 0,
		answers         = [],
		userId			= "",		
		mainScope;		

	mainScope =
	{
		knownPhrase: 	$('.knownPhrase', main),
		unknownPhrase: 	$('.unknownPhrase', main),
		errorMessage:   $('.error', main),
		bindPhrase:
		function(phrase)
		{
			if (phrase)
			{
				mainScope.knownPhrase.html(phrase.english);
				mainScope.unknownPhrase.html(phrase.german);				
			}
		},
		validateAnswer:
		function(item, answer)
		{
			if (answer) 
			{				
				mainScope.errorMessage.hide();
				return true
			}

			mainScope.errorMessage.show();
			return false;
		},
		checkAnswer:
		function(item, answer)
		{
			return answer.toLowerCase() === item.german.toLowerCase();			
		}
	};

	mainScope.bindPhrase(data.block1[currentQuestion]);

	console.log()
	$("#idInput").on
	("keyup", function(e)
	{
		if (e.keyCode == 13) //enter key
		{			
			if ($(this).val() !== null && $(this).val() !== undefined && $(this).val().trim() !== "")
			{
				userId	=	$(this).val();
				login.hide()
				main.show();				
			}
			else
			{
				$(".error").show();
			}

		}
	});

	answerInput.on
	("keyup", function(e)
	{
		if (e.keyCode == 13) //enter key
		{
			if (mainScope.validateAnswer(data.block1[currentQuestion], $(this).val()))
			{
				answers.push
				({
					id:    	data.block1[currentQuestion].id,
					value: 	mainScope.checkAnswer(data.block1[currentQuestion], $(this).val()),
					userId: userId
				});

				$(this).val('');
				currentQuestion += 1;
				//save answer
				if (data.block1.length > currentQuestion)
				{
					mainScope.bindPhrase(data.block1[currentQuestion]);
				}
				else
				{
					main.hide();
					success.show();
				}
			}
		}
	}
	);	
});

	var private =
	{

		getData:
		function()
		{
			return {	block1:						
						[
							{id: "7e53d904-0584-47f6-9dc4-5f5b2bd1857f", english: "time", german:"zeit"}, 
							{id: "", english: "people", german:"leute"}, 
							{id: "", english: "now", german:"jetzt"},
							{id: "", english: "year", german:"jahr"}, 
							{id: "", english: "work", german:"arbeit"}, 
							{id: "", english: "free", german:"frei"},
							{id: "", english: "here", german:"hier"}, 
							{id: "", english: "back", german:"zurueck"},
							{id: "", english: "company", german:"firma"}, 
							{id: "", english: "contact", german:"kontakt"},
							{id: "", english: "development", german:"bildung"}, 
							{id: "", english: "full", german:"voll"},
							{id: "", english: "service", german:"dienst"}, 
							{id: "", english: "date", german:"datum"},
							{id: "", english: "information", german:"auskunft"}, 
							{id: "", english: "world", german:"welt"},
							{id: "", english: "news", german:"zeitung"}, 
							{id: "", english: "group", german:"gruppe"},
							{id: "", english: "start", german:"anfang"}, 
							{id: "", english: "support", german:"hilfe"}
						],
						block2:
						[
							{english: "code", german:"vorwahl"}, 
							{english: "phone", german:"handy"}, 
							{english: "state", german:"staat"},
							{english: "board", german:"tafel"}, 
							{english: "today", german:"heute"}, 
							{english: "position", german:"stelle"},
							{english: "war", german:"krieg"}, 
							{english: "professional", german:"fachmann"},
							{english: "skill", german:"geschick"}, 
							{english: "might", german:"macht"},
							{english: "system", german:"ordnung"}, 
							{english: "off", german:"stueck"},
							{english: "title", german:"titel"}, 
							{english: "rate", german:"grad"},
							{english: "location", german:"lage"}, 
							{english: "life", german:"leben"},
							{english: "community", german:"gemeinde"}, 
							{english: "end", german:"ende"},
							{english: "data", german:"daten"}, 
							{english: "men", german:"mensch"}
						],
						block3:
						[
							{english: "leaf", german:"blatt"}, 
							{english: "map", german:"karte"}, 
							{english: "sure", german:"sicher"},
							{english: "escalator", german:"rolltreppe"}, 
							{english: "square", german:"platz"}, 
							{english: "ditch", german:"graben"},
							{english: "ladder", german:"leiter"}, 
							{english: "sharp", german:"scharf"},
							{english: "pear", german:"birne"}, 
							{english: "lighthouse", german:"leuchtturm"},
							{english: "bottle", german:"flasche"}, 
							{english: "straight", german:"gerade"},
							{english: "light", german:"leicht"}, 
							{english: "spring", german:"feder"},
							{english: "dentist", german:"zahnarzt"}, 
							{english: "lock", german:"schloss"},
							{english: "hole", german:"loch"}, 
							{english: "lazy", german:"faul"},
							{english: "saucer", german:"untertasse"}, 
							{english: "onion", german:"zweibel"}
						],
						block3k:
						[
							{english: "leaf", german:"blatt", keyword:"The German for LEAF is BLATT. Imagine you use a leaf to BLOT an ink stain."}, 
							{english: "map", german:"karte", keyword:"The German for MAP is KARTE. Imagine Ex-President Jimmy CARTER reading a map."}, 
							{english: "sure", german:"sicher", keyword:"The German for SURE is SICHER. Imagine you feel SURE you are going to get SICKER and sicker."},
							{english: "escalator", german:"rolltreppe", keyword:"The German for ESCALATOR is ROLLTREPPE. Imagine ROLLING and TRIPPING on an escalator."}, 
							{english: "square", german:"platz", keyword:"The German for (TOWN) SQUARE is PLATZ. Imagine white PLATES littered all over the town square."}, 
							{english: "ditch", german:"graben", keyword:"The German for DITCH is GRABEN. Imagine GRABBING the side of a ditch to stop falling in."},
							{english: "ladder", german:"leiter", keyword:"The German for LADDER is LEITER. Imagine feeling LIGHTER after putting your heavy ladder down."}, 
							{english: "sharp", german:"scharf", keyword:"The German for SHARP is SCHARF. Imagine cutting a German flag with SHARP scissors."},
							{english: "pear", german:"birne", keyword:"The German for PEAR is BIRNE. Imagine BURNING a pear."}, 
							{english: "lighthouse", german:"leuchtturm", keyword:"The German for LIGHTHOUSE is LEUCHTTURM. Imagine people LOITERING near a lighthouse."},
							{english: "bottle", german:"flasche", keyword:"The German for BOTTLE is FLASCHE. Imagine a bottle FLASHING past your head."}, 
							{english: "straight", german:"gerade", keyword:"The German for STRAIGHT is GERADE. Imagine going up a STRAIGHT GRADIENT."},
							{english: "light", german:"leicht", keyword:"The German for LIGHT (WEIGHT) is LEICHT. Imagine finding a German flag LIGHT to lift."}, 
							{english: "spring", german:"feder", keyword:"The German for SPRING (METAL COIL) is FEDER. Imagine the springs are made with FEATHERS."},
							{english: "dentist", german:"zahnarzt", keyword:"The German for DENTIST is ZAHNARZT. Imagine a dentist drilling a hole in a work of ZEN ART."}, 
							{english: "lock", german:"schloss", keyword:"The German for LOCK is SCHLOSS. Imagine you are so SLOSHED that you can’t open the lock of your car."},
							{english: "hole", german:"loch", keyword:"The German for HOLE is LOCH. Imagine a hole in a door lock."}, 
							{english: "lazy", german:"faul", keyword:"The German for LAZY is FAUL. Imagine a LAZY football player commits a FOUL because he can’t be bothered tackling."},
							{english: "saucer", german:"untertasse", keyword:"The German for SAUCER is UNTERTASSE. Imagine a tassle under a cup, and a saucer UNDER the TASSLE."}, 
							{english: "onion", german:"zweibel", keyword:"The German for ONION is ZWIEBEL. Imagine a WEE BELL in the shape of an onion. When you pick it up the bell smells of onion."}
						]
					};					
			}
		};
				