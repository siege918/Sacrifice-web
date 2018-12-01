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
	var index = 0;
	function _nextLine() {
		$("body").off("click", _nextLine);
		
		index++;
		if (index < lines.length)
		{
			_run();
		}
		else {
			callback();
		}
	}
	
	function _run() {
		writeText(lines[index], function() {
			$("body").on("click", _nextLine);
		});
	}
	
	_run();
}

function openSidebar() {
	$("#textbox").hide();
	$("#sidebar").show();
}

runDialog([
	"Part 1",
	"Part 2",
	"And here's the third line"
], function() {
	openSidebar();
});