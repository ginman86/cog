$(document).ready
(function()
{
	//something
	var login 	= $("#login"),
		main	= $("#main"),
		data	= 
		{
			block1:
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


	$.each
	(data.block1,
		function(i, item)
		{
			console.log(item.english);
			console.log(item.german);
		}
	);
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
			}
			else
			{
				$(".error").show();
			}

		}
	}
	)
}

)