$(document).ready
(function()
{
	//something
	var login 	= $("#login"),
		main	= $("#main"),
		data	= private.getData(),
		mainScope;		

	console.log()
	$("#idInput").on
	("keyup", function(e)
	{
		if (e.keyCode == 13) //enter key
		{			
			if ($(this).val() !== null && $(this).val() !== undefined && $(this).val().trim() !== "")
			{
				login.hide()
				main.show();

				$.each
				(data.block1,
					function(i, item)
					{
						console.log(item.english);
						console.log(item.german);
						mainScope.bindPhrase(item);
					}
				);
			}
			else
			{
				$(".error").show();
			}

		}
	});

	mainScope =
	{
		knownPhrase: 	$('.knownPhrase', $('#main')),
		unknownPhrase: 	$('.unknownPhrase', $('#main')),
		bindPhrase:
		function(phrase)
		{
			if (phrase)
			{
				mainScope.knownPhrase.append('<br/>'+ phrase.english);
				mainScope.unknownPhrase.append('<br/>'+ phrase.german);				
			}
		}
	};
});

	var private =
	{
		getData:
		function()
		{
			return {	block1:						
						[
							{english: "time", german:"zeit"}, 
							{english: "people", german:"leute"}, 
							{english: "now", german:"jetzt"},
							{english: "year", german:"jahr"}, 
							{english: "work", german:"arbeit"}, 
							{english: "free", german:"frei"},
							{english: "here", german:"hier"}, 
							{english: "back", german:"zurueck"},
							{english: "company", german:"firma"}, 
							{english: "contact", german:"kontakt"},
							{english: "development", german:"bildung"}, 
							{english: "full", german:"voll"},
							{english: "service", german:"dienst"}, 
							{english: "date", german:"datum"},
							{english: "information", german:"auskunft"}, 
							{english: "world", german:"welt"},
							{english: "news", german:"zeitung"}, 
							{english: "group", german:"gruppe"},
							{english: "start", german:"anfang"}, 
							{english: "support", german:"hilfe"}
						],
						block2:
						[
							{english: "", german:""}, 
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""}
						],
						block3:
						[
							{english: "", german:""}, 
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""},
							{english: "", german:""}, 
							{english: "", german:""}
						]
					};					
			}
		};
				