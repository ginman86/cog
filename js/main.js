$(document).ready
(function()
{
	var login 	= $("#login");
		main	= $("#main");

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