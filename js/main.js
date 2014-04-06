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
	
	var 		global, pages, options, mainScope, local; 
	global =
	{
		data:			 	proto.getData(),
		currentQuestion:	0,		
		currentIteration: 	1,		
		answers:          	[],
		user:			 	
		{
			id: 			"",
			age: 			0,
			gender:  		"",
			experience:    	""
		}
	};
	pages =
	{
		login: 				$("#login"),
		main: 				$("#main"),
		success: 			$("#success"),
		demographics:    	$("#demographics"),
		getAnswerInput:
		function()
		{
			return $('.answerInput', this.main);
		}
	};

	options =
	{
		program: 		 	null,		
		getTotalIterations:	
		function()
		{			
			return options.program.length;
		}		
	};
	mainScope =
	{
		knownPhrase: 	$('.knownPhrase', pages.main),
		unknownPhrase: 	$('.unknownPhrase', pages.main),
		errorMessage:   $('.error', pages.main),
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
			return (answer.toLowerCase() === item.german.toLowerCase()) * 1;			
		},
		showMain:
		function()
		{
			$(".error", pages.login).hide();			
			pages.main.show();
		}
	};
	local =
	{
		processAnswer:
		function(iteration, question, value)
		{
			var currentItem = local.getCurrentItem(iteration, question);
			global.answers.push
			({
				id:    		currentItem.id,
				value: 		mainScope.checkAnswer(currentItem, value),
				user: 		{id: global.user.id},
				response: 	value,
				mode:       options.program[global.currentIteration - 1].mode // may be redundant, consider using program id or similar.
			});
		},
		showNextQuestion:
		function()
		{
			global.currentQuestion += 1;
			//save answer
			if (local.getCurrentBlock(global.currentIteration).length > global.currentQuestion)
			{
				mainScope.bindPhrase(local.getCurrentItem(global.currentIteration, global.currentQuestion));					
			}
			else
			{
				global.currentIteration += 1;
				if (global.currentIteration > options.getTotalIterations())
				{					
					pages.main.hide();
					pages.success.show();
					local.exportData(global.answers);					
				}
				else
				{
					pages.main.toggleClass("test", options.program[global.currentIteration - 1].mode === "test");
					global.currentQuestion = 0;
					mainScope.bindPhrase(local.getCurrentItem(global.currentIteration, global.currentQuestion));
				}
			}
		},
		getCurrentItem:
		function(iteration, question)
		{
			return local.getCurrentBlock(iteration)[question];
		},
		getCurrentBlock:
		function(iteration)
		{
			return global.data["block" + options.program[iteration - 1].block];
		},
		bindHandlers:
		function()
		{
			$("#idInput").on("keyup", local.start);
			$("#start").on("click", local.start);
			$("#continue").on("click", local.demographicsContinue);
			$("#demographics").on("keyup", local.demographicsContinue);
			pages.getAnswerInput().on
			("keyup", function(e)
			{
				if (e.keyCode == 13) //enter key
				{
					if (mainScope.validateAnswer(local.getCurrentItem(global.currentIteration, global.currentQuestion), $(this).val()))
					{
						local.processAnswer(global.currentIteration, global.currentQuestion, $(this).val());
						$(this).val('');
						local.showNextQuestion(global.currentIteration, global.currentQuestion, $(this).val());
					}
				}
			});
		},
		demographicsContinue:
		function(e)
		{
			if (e.keyCode == 13 || e.keyCode === undefined) //enter key
			{
				var ageInput = $('.age', pages.demographics);
				if (ageInput.val() === null || ageInput.val() === undefined || ageInput.val() === "")
				{
					$('.error', pages.demographics).show();
				} 
				else
				{
					$('.error', pages.demographics).hide();				
					global.user.gender 		= $('.gender', pages.demographics).val();
					global.user.age 		= ageInput.val();
					global.user.experience 	= $('.experience', pages.demographics).val();
					pages.demographics.hide();
					mainScope.showMain();	
				}
			}
		},
		start:
		function(e)
		{
			if (e.keyCode == 13 || e.keyCode === undefined) //enter key
			{
				var idInput = $("#idInput");
				if (idInput.val() !== null && idInput.val() !== undefined && idInput.val().trim() !== "")
				{
					global.user.id		=	idInput.val();
					if ($('input:radio[name=group1]:checked').val() === "2")
					{
						pages.login.hide();
						options.program = proto.programCode()["2"];
						mainScope.showMain(idInput.val());
					}
					else if ($('input:radio[name=group1]:checked').val() === "1")
					{
						pages.login.hide();
						options.program = proto.programCode()["1"];
						pages.demographics.show();						
					}


				}
				else
				{
					$(".error", pages.login).show();
				}
			}
		},
		exportData:
		function(data)
		{
			var csv = "UserId,Gender,Age,Experience\r\n";

			csv	+= global.user.id + "," + global.user.gender + "," + global.user.age + "," + global.user.experience;
			csv += "\r\n\r\n";
			csv += "Id,Value,UserId,Response,Mode\r\n";
			$.each
			(data, 
			function(i, item)
			{
				csv += item.id + "," + item.value + "," + item.user.id + "," + item.response + "," + item.mode;
				csv += "\r\n";
			});

			var exportLink = document.createElement('a');
		    exportLink.setAttribute('href', 'data:text/csv;base64,' + window.btoa(csv));
		    exportLink.appendChild(document.createTextNode(global.user.id + '_results.csv'));

		    $(exportLink).attr('download', global.user.id + '_results.csv');	//chrome ftw.

		    $('.results', pages.success).html(exportLink);
		}
	}
	local.bindHandlers();
	mainScope.bindPhrase(local.getCurrentItem(global.currentIteration, global.currentQuestion));
	
	console.log();		
});

	var proto =
	{		
		programCode:
		function()
		{
			return { 1: 
					[
						{
							block: 	2,
							mode:   "study"
						}
					],
					2: 
					[
						{
							block: 	1,
							mode:   "test"
						},

						{
							block: 	2,
							mode:   "test"
						},

						{
							block: 	3,
							mode:   "test"
						}
					]
				}


		},
		getData:
		function()
		{
			return {	block1:						
						[
							{id: "7e53d904-0584-47f6-9dc4-5f5b2bd1857f", english: "time", german:"zeit"}, 
							{id: "04054c88-2f9b-48af-a330-e31682903c67", english: "people", german:"leute"}, 
							{id: "c3946dc7-08b1-40c7-bcba-d886c9000962", english: "now", german:"jetzt"},
							{id: "f07d94ac-7840-45c2-82ff-85a649b872ae", english: "year", german:"jahr"}, 
							{id: "af8794c2-b0cf-45b0-aae2-99206c1d1492", english: "work", german:"arbeit"}, 
							{id: "7350b194-cf89-4ee2-8458-9e18ee8abfd9", english: "free", german:"frei"},
							{id: "f24b4c0b-ad01-4edb-b932-8edbe85cde56", english: "here", german:"hier"}, 
							{id: "dc6f4b27-e8dd-4dec-85d0-6bd234e92af9", english: "back", german:"zurueck"},
							{id: "b22e9c90-ea21-4b34-8e1c-70058c2d31d9", english: "company", german:"firma"}, 
							{id: "9f5fbe89-802f-4ad1-b654-d39fee77b128", english: "contact", german:"kontakt"},
							{id: "65664fdc-ec24-43e3-be09-5b2966e80323", english: "development", german:"bildung"}, 
							{id: "cb7d45d7-5a69-4f32-94f9-4bc2439e551e", english: "full", german:"voll"},
							{id: "d0e49be2-cde9-4a60-ae2a-d711b7e169c0", english: "service", german:"dienst"}, 
							{id: "8b3a9d79-d38d-46b7-b578-1900c9e675c8", english: "date", german:"datum"},
							{id: "c8b35144-8bc2-40ac-adbc-fdb18e604443", english: "information", german:"auskunft"}, 
							{id: "1bfffd1e-bdfc-4d6c-965d-6249affd8c07", english: "world", german:"welt"},
							{id: "de0f41ae-68dc-4f11-8d3f-b34b3b0b8668", english: "news", german:"zeitung"}, 
							{id: "8a1a4b19-7b5a-4e04-a548-106a6e8af219", english: "group", german:"gruppe"},
							{id: "2cd95aaa-cfa2-48c6-a4d5-0faaea1c41ae", english: "start", german:"anfang"}, 
							{id: "e6722182-2ef2-4f2d-a129-fe0ae29775f8", english: "support", german:"hilfe"}
						],
						block2:
						[
							{id: "1587e6d9-831c-4ff3-85d7-8a74a9c0014f", english: "code", german:"vorwahl"}, 
							{id: "70b5e9a3-293c-4e5f-a936-425a0b7363f4", english: "phone", german:"handy"}, 
							{id: "7ab1036b-30a3-43f5-a4f8-b4a714ac135d", english: "state", german:"staat"},
							{id: "a15fa04e-356e-40c3-9d92-918cde15220f", english: "board", german:"tafel"}, 
							{id: "47eadb28-0788-43db-89c0-87d7095ee873", english: "today", german:"heute"}, 
							{id: "c338961b-5c58-4173-b066-513ea016aa60", english: "position", german:"stelle"},
							{id: "a594d8af-c0d1-40d0-b7a8-1a293bc20139", english: "war", german:"krieg"}, 
							{id: "9c688cf4-02a2-4e54-ba1c-4542a452ad4a", english: "professional", german:"fachmann"},
							{id: "1468bc8a-af7e-4373-9bbf-c9d6ba49e566", english: "skill", german:"geschick"}, 
							{id: "001106e0-7c49-4f99-b0fa-f614c0068300", english: "might", german:"macht"},
							{id: "3f08aabe-f930-42a5-9768-b5128679770c", english: "system", german:"ordnung"}, 
							{id: "2f7afbfb-ad15-448d-9314-cd0c8a3636d7", english: "off", german:"stueck"},
							{id: "284e4494-5b08-4bf2-a836-2232775a20d5", english: "title", german:"titel"}, 
							{id: "7270ff60-e4e1-4a3a-b05a-4f1f4a8893b0", english: "rate", german:"grad"},
							{id: "8dc7cf32-7a30-4f2c-84c7-6d9bdda7c913", english: "location", german:"lage"}, 
							{id: "efc82943-4ec9-461b-aeab-04cdf673288f", english: "life", german:"leben"},
							{id: "956de8fa-9e77-4bb2-bc6e-d895b47f4815", english: "community", german:"gemeinde"}, 
							{id: "84cd644b-15e7-45f5-a51f-1c3bd843de77", english: "end", german:"ende"},
							{id: "f46c696c-6295-4406-a565-80d2f66849d1", english: "data", german:"daten"}, 
							{id: "0b31e37c-69d9-4521-806c-e705759d6f84", english: "men", german:"mensch"}
						],
						block3:
						[
							{id: "738c0d2a-ebda-4ab6-8541-7eb3cf3329b9", english: "leaf", german:"blatt"}, 
							{id: "104f8b93-a2f3-45f9-b86b-d2e3e1ee40c9", english: "map", german:"karte"}, 
							{id: "f86144eb-93a1-4d42-a7c5-914bd06762c0", english: "sure", german:"sicher"},
							{id: "2a34571f-40f6-4105-b5b2-bd4011d6f690", english: "escalator", german:"rolltreppe"}, 
							{id: "e810f80e-f87e-4cf5-90a8-491f67e7861a", english: "square", german:"platz"}, 
							{id: "e64a99ed-e845-4203-b586-ec135feba26b", english: "ditch", german:"graben"},
							{id: "25c2aa8d-c57d-4ed4-887f-93fc008c99d9", english: "ladder", german:"leiter"}, 
							{id: "5c524ceb-65a8-40ec-9ff5-b924ad3c985c", english: "sharp", german:"scharf"},
							{id: "62c0a825-8dba-45f9-8013-15ba82bde973", english: "pear", german:"birne"}, 
							{id: "4a67ece2-6d96-42c6-a7ed-99c872f57516", english: "lighthouse", german:"leuchtturm"},
							{id: "250ef4d8-0d6d-4d8f-bf98-f78b642e7754", english: "bottle", german:"flasche"}, 
							{id: "c24ed5df-6bb6-48a7-820c-cd57fdc43e32", english: "straight", german:"gerade"},
							{id: "a7099b3d-cb9f-46a9-9a17-7da9f6ed2866", english: "light", german:"leicht"}, 
							{id: "03b70837-8dbf-4327-8c56-ace5488b3b79", english: "spring", german:"feder"},
							{id: "7f638ff7-eb77-491e-8a5c-2a5e2c31f790", english: "dentist", german:"zahnarzt"}, 
							{id: "3a712d9d-f7ae-4f44-b2ed-9b903b30f2a6", english: "lock", german:"schloss"},
							{id: "f3d3878f-4db3-4fca-b8fe-2d6d68bc51e9", english: "hole", german:"loch"}, 
							{id: "8c69f987-bdb5-4090-8e85-34359a203aa1", english: "lazy", german:"faul"},
							{id: "2184fd6d-8c7f-4bad-ab75-dfcbe5fbc2f4", english: "saucer", german:"untertasse"}, 
							{id: "48a96651-dd89-4e36-bb9f-c9c7cb3fff51", english: "onion", german:"zweibel"}
						],
						block3k:
						[
							{id: "1ab619ec-a2c5-4235-abfe-44b53a83a9ef", english: "leaf", german:"blatt", keyword:"The German for LEAF is BLATT. Imagine you use a leaf to BLOT an ink stain."}, 
							{id: "56f47bde-dbd0-4a67-a7ee-ccf278d38b53", english: "map", german:"karte", keyword:"The German for MAP is KARTE. Imagine Ex-President Jimmy CARTER reading a map."}, 
							{id: "7a24ba33-edb7-4323-a08f-182c25c34aa2", english: "sure", german:"sicher", keyword:"The German for SURE is SICHER. Imagine you feel SURE you are going to get SICKER and sicker."},
							{id: "afa5aca8-03d0-4e4d-b5b8-42c3d2b91dea", english: "escalator", german:"rolltreppe", keyword:"The German for ESCALATOR is ROLLTREPPE. Imagine ROLLING and TRIPPING on an escalator."}, 
							{id: "29346fa7-0cc0-47c0-a238-eeade976cf33", english: "square", german:"platz", keyword:"The German for (TOWN) SQUARE is PLATZ. Imagine white PLATES littered all over the town square."}, 
							{id: "2f6e9e0a-8a07-452d-a5eb-fb322c6ed5f8", english: "ditch", german:"graben", keyword:"The German for DITCH is GRABEN. Imagine GRABBING the side of a ditch to stop falling in."},
							{id: "7c16420c-0033-40e2-ba88-9623e212a119", english: "ladder", german:"leiter", keyword:"The German for LADDER is LEITER. Imagine feeling LIGHTER after putting your heavy ladder down."}, 
							{id: "a8df6340-0a7f-4ea8-8a12-d783c339bb11", english: "sharp", german:"scharf", keyword:"The German for SHARP is SCHARF. Imagine cutting a German flag with SHARP scissors."},
							{id: "f503da25-2e2a-45ab-9c7f-3b073e76636c", english: "pear", german:"birne", keyword:"The German for PEAR is BIRNE. Imagine BURNING a pear."}, 
							{id: "476d0cf9-0115-41a4-85af-72c1b0664b41", english: "lighthouse", german:"leuchtturm", keyword:"The German for LIGHTHOUSE is LEUCHTTURM. Imagine people LOITERING near a lighthouse."},
							{id: "ba262c30-810e-4c55-95e8-2acbb328b372", english: "bottle", german:"flasche", keyword:"The German for BOTTLE is FLASCHE. Imagine a bottle FLASHING past your head."}, 
							{id: "141d690b-c83a-45ce-8f3e-1a4e94d78acb", english: "straight", german:"gerade", keyword:"The German for STRAIGHT is GERADE. Imagine going up a STRAIGHT GRADIENT."},
							{id: "c015f615-4af3-4ded-a792-6b4467f75005", english: "light", german:"leicht", keyword:"The German for LIGHT (WEIGHT) is LEICHT. Imagine finding a German flag LIGHT to lift."}, 
							{id: "4baac63e-9a7f-4db3-8e5a-3f926ddca107", english: "spring", german:"feder", keyword:"The German for SPRING (METAL COIL) is FEDER. Imagine the springs are made with FEATHERS."},
							{id: "483072de-cd8f-49a7-ab3b-0ee6d990a8b5", english: "dentist", german:"zahnarzt", keyword:"The German for DENTIST is ZAHNARZT. Imagine a dentist drilling a hole in a work of ZEN ART."}, 
							{id: "78b58944-1561-4d56-b55a-a793d1314abd", english: "lock", german:"schloss", keyword:"The German for LOCK is SCHLOSS. Imagine you are so SLOSHED that you can’t open the lock of your car."},
							{id: "3456817d-035a-4853-a782-00fcca358a8f", english: "hole", german:"loch", keyword:"The German for HOLE is LOCH. Imagine a hole in a door lock."}, 
							{id: "1b28deab-0d79-459f-966c-eca5379f8619", english: "lazy", german:"faul", keyword:"The German for LAZY is FAUL. Imagine a LAZY football player commits a FOUL because he can’t be bothered tackling."},
							{id: "167831d3-1d3b-463a-bccb-ff527f06ab73", english: "saucer", german:"untertasse", keyword:"The German for SAUCER is UNTERTASSE. Imagine a tassle under a cup, and a saucer UNDER the TASSLE."}, 
							{id: "312a876f-3243-47e5-9592-be491e2702fb", english: "onion", german:"zweibel", keyword:"The German for ONION is ZWIEBEL. Imagine a WEE BELL in the shape of an onion. When you pick it up the bell smells of onion."}
						]
					};					
			}
		};
				