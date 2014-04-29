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
	proxy 	=	cogLocalProxy; //default 
	global 	=
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
			local.bindBlock();
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
				//finished
				if (global.currentIteration > options.getTotalIterations())
				{					
					pages.main.hide();
					pages.success.show();
					proxy.exportData(global.answers, global, function(exportLink) { $('.results', pages.success).html(exportLink);});					
				}
				else //transition to new block
				{
					local.bindBlock();
				}
			}
		},
		bindBlock:
		function()
		{
			pages.main.toggleClass("test", options.program[global.currentIteration - 1].mode === "test");
			global.currentQuestion = 0;
			mainScope.bindPhrase(local.getCurrentItem(global.currentIteration, global.currentQuestion));
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
		function(data, context)
		{
			proxy.exportData(data, context);
		}
	}
	local.bindHandlers();	
});

var proto =
{		
	programCode:
	function()
	{
		return proxy.programCode();
	},
	getData:
	function()
	{
		return proxy.getData();
	}	
};

				