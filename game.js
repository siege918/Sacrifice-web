var beastForm = 1;
var checkpoint = 0;
var fedChips = false;
var fedPlant = false;
var fedCat = false;
var feelingOkay = false;
var room = 0;

var inventory = [
	"Chips",
	"Plant",
	"Cat"
]

var itemActions = {
	"Chips": function() {
		//If you're in the cave and at the beginning of the game
		if (room === 0 && !fedChips)
		{
			inventory = inventory.filter(function(value) {
				return value !== "Chips";
			});
			runDialog([
				"You hand the spare bag of chips over to the fairy, and it takes them eagerly.",
				"The fairy eats the chips...",
				"...including the bag."
			], function() {
				fedChips = true;
				$("#goButton").show();
				openSidebar();
			});
		}
		else if (room !== 0 && !fedChips)
		{
			runDialog([
				"You've got some chips in your bag but you're not very hungry."
			], function() {
				openSidebar();
			});
		}
		else if (fedChips) {
			inventory = inventory.filter(function(value) {
				return value !== "Chips";
			});
			runDialog([
				"You somehow still have some chips after giving some to the fairy...",
				"You eat all of them."
			], function() {
				openSidebar();
			});
		}
	},
	"Plant": function() {
		if (room === 0 && fedChips && !fedPlant) {
			inventory = inventory.filter(function(value) {
				return value !== "Plant";
			});
			runDialog([
				"You pull out your plant and the fairy flies over.",
				"They bite into the flower, making happy muttering sounds as they eat."
			], function() {
				fedPlant = true;
				openSidebar();
			});
		}
	},
	"Cat": function() {
		if (room === 0 && fedChips && fedPlant && !fedCat) {
			inventory = inventory.filter(function(value) {
				return value !== "Cat";
			});
			runDialog([
				"You pull out your cat, and the toady feature in front of you clambers forward.",
				"It opens its mouth, extending its long tongue.",
				"The toungue wraps around the cat and, in a single moment...",
				"The cat disappears into the creature's mouth, with no sign it was ever there."
			], function() {
				fedCat = true;
				openSidebar();
			});
		}
	}
}

function writeText(text, callback) {
	var length = 0;
	var interval = setInterval(function() {
		length++;
		$("#textbox .content").html(text.substring(0, length));
		
		if (length === text.length)
		{
			clearInterval(interval);
			callback();
		}
	}, 10);
}

function runDialog(lines, callback) {
	$("#textbox").show();
	$("#sidebar").hide();
	$("#inventory").hide();
	var index = 0;
	function _nextLine() {
		$("body").off("click", _nextLine);
		$("body").removeClass("interact");
		
		index++;
		if (index < lines.length)
		{
			_run();
		}
		else {
			$("#textbox .content").html("");
			if (callback)
				callback();
		}
	}
	
	function _run() {
		writeText(lines[index], function() {
			$("body").on("click", _nextLine);
			$("body").addClass("interact");
		});
	}
	
	_run();
}

function openSidebar() {
	$("#textbox").hide();
	$("#sidebar").show();
}

function openInventory() {
	var innerText = "";
	for (var i = 0; i < inventory.length; i++)
	{
		innerText += "<div class='item'>" + inventory[i] + "</div>"
	}
	$("#inventory .content").html($(innerText));
	$("#inventory").show();
}

function closeInventory() {
	$("#inventory").hide();
}

function talkRoom() {
	
}

function talkCave() {
	
}

function goRoom() {
	transitionIn(function() {
		$("#cave").hide();
		$("#apartment").show();
		$("#caveButton").show();
		$("#goButton").hide();
		room = 1;
		transitionOut();
	});
}

function goCave() {
	transitionIn(function() {
		$("#cave").show();
		$("#apartment").hide();
		$("#caveButton").hide();
		$("#goButton").show();
		room = 0;
		
		if (fedChips && inventory.includes("Plant"))
		{
			$("#beast1").hide();
			$("#beast2").show();
			transitionOut();
		}
		else if (fedPlant && inventory.includes("Cat"))
		{
			$("#beast2").hide();
			$("#beast3").show();
			transitionOut();
		}
		else if (fedCat && !inventory.includes("Self"))
		{
			$("#beast3").hide();
			if (!inventory.includes("Self"))
				inventory.push("Self");
			transitionOut(function() {
				runDialog([
					"You return to the cave where you'd been meeting your friend, but no one was there.",
					"The darkness of the cave makes it hard to see anything beyond where you're standing.",
					"You hear a deep grumbling sound, like labored breathing."
				], function() {
					$("#beast4").fadeIn(3000, function() {
						runDialog([
							"You see a smile open up in front of you, as large as the cave itself, and iridescent eyes open."
						], function() {
							openSidebar();
						});
					});
				});
			});
		}
		else {
			transitionOut();
		}
	});
}

function useItem(name) {
	console.log("Using item: " + name);
	if (itemActions[name])
		itemActions[name]();
	else
		closeInventory();
}

function talk() {
	switch (room) 
	{
		case 0:
			talkRoom();
			break;
		case 1:
			talkCave();
			break;
		default:
			break;
	}
}

function transitionIn(callback) {
	$("#transition").animate(
		{top: "0px"},
		500,
		callback
	);
}

function transitionOut(callback) {
	$("#transition").animate(
		{top: "-600px"},
		500,
		callback
	);
}

$(function() {
	$("body").on("click", "#talkButton", function() {
		runDialog([
			"Hi there!",
			"I'm very hungry",
			"Do you have anything you can feed me?"
		], function() {
			openSidebar();
		});
	});
	$("body").on("click", "#goButton", function() {
		goRoom();
	});
	$("body").on("click", "#caveButton", function() {
		goCave();
	});
	$("body").on("click", ".item", function() {
		useItem($(this).html());
	});
	$("body").on("click", "#inventoryButton", function() {
		openInventory();
	});
	
	runDialog(
		[
			"Opening monologue about how sad you are."
		],
		function() {
			$("#beast1").fadeIn(1000, function() {
				runDialog(
					[
						"The fairy asks you for food"
					],
					function() { openSidebar(); }
				);
			});
		}
	);
});