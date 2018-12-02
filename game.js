var beastForm = 1;
var checkpoint = 0;
var fedChips = false;
var fedPlant = false;
var fedCat = false;
var feelingOkay = false;
var room = 0;

var inventory = [
	"Chips"
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
				"You hand the helf-eaten bag of chips over to the fairy, and it takes them eagerly.",
				"The fairy eats the chips...",
				"...including the bag."
			], function() {
				fedChips = true;
				$("#goButton").show();
				$("#beast1").fadeOut(2000);
				$("#beast2").fadeIn(2000, function() {
					runDialog([
						"The fairy changes form before you, gaining new markings, sprouting feet, and sporting a cheerful smile.",
						"\"YUM! Those were amazing! They made me happy!\"",
						"\"Do you have anything else that could make me happy?\"",
						"\"If it makes you happy, maybe it'll do the same for me!\"",
						"Maybe you should go back home and find something new to give to this fairy."
					],
					openSidebar);
				});
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
				"They bite into the flower, making happy chewing sounds as they eat."
			], function() {
				fedPlant = true;
				$("#beast2").fadeOut(2000);
				$("#beast3").fadeIn(2000, function() {
					runDialog([
						"The fairy takes on a new form before you, its feet sprouting into massive legs and developing more marking.",
						"Its smile turns into a massive grin.",
						"It sure seems happy to see you.",
						"\"That was wonderful!\"",
						"Its voice is gruffer and more coarse, and you recoil a little.",
						"\"No no, don't be afraid!\" it growls.",
						"\"I'm still your friend. You're still mine, right?\"",
						"\"Hey, do you have anything else for me? Something that makes you happy?\""
					],
					openSidebar);
				});
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
		
		if (room === 1 && fedChips && fedPlant)
		{
			runDialog([
				"You hold your cat in front of you, and they look at you with indifference.",
				"...",
				"You can't do it.",
				"You sit down with your cat in your lap and they curl into a ball."
			], function() {
				$("#textbox").hide();
				$("#apartment").fadeOut(4000, function() {
					runDialog(["You never went back to the cave. You feel at peace."],
					function() {
						$("#textbox").hide();
						$("#credits").fadeIn(6000);
					});
				});
			});
		}
	},
	"Self": function() {
		if (room === 0 && fedChips && fedPlant && fedCat) {
			inventory = inventory.filter(function(value) {
				return value !== "Cat";
			});
			runDialog([
				"You step forward to the creature and open your arms.",
				"Its eyes fixate on you.",
				"\"Ah... you're offering me yourself.\"",
				"\"...\"",
				"\"Yes, this is fine.\"",
				"You hear a rumbling from within the cave, a large mass clambering to its feet.",
				"\"I appreciate you.\"",
				"The beast opens its wide mouth. You cannot see any other part of its form, but  its eyes and mouth approach you.",
				"The mouth gets closer and closer and..."
			], function() {
				$("#cave").hide();
				setTimeout(function() {
					runDialog([
						"You have given your whole self to the beast.",
						"There is none of you left."
					], function() {
						$("#textbox").hide();
						setTimeout(function() {
							$("#credits").fadeIn(6000);
						},
						1000)
					});
				},
				4000);
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
	if (!fedPlant)
	{
		runDialog([
			"You haven't bought groceries this week so you don't have any food...",
			"What do fairies even eat...?"
		],
		function() {
			openSidebar();
		});
	}
	else if (!fedCat)
	{
		runDialog([
			"..."
		],
		function() {
			openSidebar();
		});
	}
	else
	{
		runDialog([
			"\"I'm sure you can find something...\""
		],
		function() {
			openSidebar();
		});
	}
}

function talkCave() {
	if (!fedChips)
	{
		runDialog(["\"Hey, do you have any food I can eat?\""],
		function() {
			openSidebar();
		});
	}
	else if (!fedPlant)
	{
		runDialog([
			"\"Do you have anything else that could make me happy?\"",
			"\"If it makes you happy, maybe it'll do the same for me!\"",
			"Maybe you should go back home and find something new to give to this fairy."
		],
		function() {
			openSidebar();
		});
	}
	else if (!fedCat)
	{
		runDialog([
			"\"No no, don't be afraid!\" it growls.",
			"\"I'm still your friend. You're still mine, right?\"",
			"\"Hey, do you have anything else for me? Something that makes you happy?\""
		],
		function() {
			openSidebar();
		});
		
	}
	else
	{
		runDialog([
			"\"I'm sure you can find something...\""
		],
		function() {
			openSidebar();
		});
	}
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
			//$("#beast1").hide();
			//$("#beast2").show();
			transitionOut();
		}
		else if (fedPlant && inventory.includes("Cat"))
		{
			//$("#beast2").hide();
			//$("#beast3").show();
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
							"You see a smile open up in front of you, as large as the cave itself, and iridescent eyes open.",
							"\"I see you brought something for me.\""
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
			talkCave();
			break;
		case 1:
			talkRoom();
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
		talk();
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
	$("body").on("click", "#cat_trigger", function() {
		if (fedPlant)
		{
			$("body").off("click", "#cat_trigger");
			runDialog([
				"...",
				".....",
				"You take your cat."
			],
			function() {
				$("#cat_img").hide();
				$("#cat_trigger").hide();
				inventory.push("Cat");
				openSidebar();
			})
		}
		else {
			runDialog([
				"Kitty!"
			],
			function() {
				openSidebar();
			})
		}
	});
	$("body").on("click", "#plant_trigger", function() {
		if (fedChips)
		{
			$("body").off("click", "#plant_trigger");
			runDialog([
				"Maybe fairies eat flowers?",
				"You take your plant."
			],
			function() {
				$("#plant_img").hide();
				$("#plant_trigger").hide();
				inventory.push("Plant");
				openSidebar();
			})
		}
	});
	
	runDialog(
		[
			"Things have been rough lately.",
			"It's been quiet...",
			"And lonely...",
			"So you're spending your evening at the caves in the woods.",
			"It's what you do when you need to feel centered.",
			"You've been in these empty caves a million times, and you've never seen a single other creature here",
			"until today."
		],
		function() {
			$("#beast1").fadeIn(1000, function() {
				runDialog(
					[
						"In front of you is a small creature, a squishy ball of joy.",
						"It flutters up to your face and addresses you.",
						"\"Hi there! Are you a friend?\"",
						"You're generally good with animals, so you tell the creature that you're friendly.",
						"\"Wonderful! I'm a cave fairy and I love making new friends!\"",
						"\"Hey, do you have any food I can eat?\""
					],
					function() { openSidebar(); }
				);
			});
		}
	);
});