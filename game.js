var beastForm = 1;
var checkpoint = 0;
var location = 0;

var inventory = [
	"Chips"
]

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
	$("#inventory").show();
}

function talkRoom() {
	
}

function talkCave();

function talk() {
	switch (location) 
		case 0:
			talkRoom();
			break;
		case 1:
			talkCave();
			break;
		default:
			break;
}

$(function() {
	$("body").on("click", "#talkButton", function() {
		console.log("poke");
		runDialog([
			"Hi there!",
			"I'm very hungry",
			"Do you have anything you can feed me?"
		], function() {
			openSidebar();
		});
	});
	$("body").on("click", "#inventoryButton", function() {
		openInventory();
	});
	
	
});