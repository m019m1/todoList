$('.newTask').on('keyup', function(e) {
	if(e.key != 'Enter') return;
	if(!e.ctrlKey) return;

	let $task = $('<li/>', {
		'class': 'task',
		text: this.value
	}).appendTo('.taskList');


	let $done = $("<input>", {
		'class': 'done',
		type: 'checkbox'
	}).appendTo($task);
	
	let $close = $("<button/>", {
		'class': 'close',
		text: 'x'
	}).appendTo($task);
	
	$done.on('click', () => {
		$task.toggleClass('made');
		$close.toggle();
	});
	$close.on('click', () => {
		$task.remove();
	});

	$task.on('mousemove', () => {
		return false;
	});

	this.value = '';

});