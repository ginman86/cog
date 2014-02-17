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
				{english: "war", german:"krieg"}, 
				{english: "hello", german:"gutentag!"}, 
				{english: "percent", german:"prozent"}
			],
			block2:
			[
				1,2,3
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