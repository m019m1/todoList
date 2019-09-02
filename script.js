let counter = 0;

$('.newTask').on('keyup', function(e) {
	
	if( !(e.key == 'Enter' && e.ctrlKey) ) return;

	counter++;
	
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
		if($task.is('.made')) {
			counter++;
		} else counter--;
		showCount();
		$task.toggleClass('made');
		$close.toggle();
	});

	$close.on('click', () => {
		$task.remove();
	});

	$task.on('mousemove', () => {
		return false;
	});

	showCount();
	this.value = '';
});

function showCount() {
switch (counter) {
	case 0:
		$('.taskListHeader').text(`Nothing to do... boring...`);
		break;
	case 1:
		$('.taskListHeader').text(`To do 1 task`);
		break;
	default:
		$('.taskListHeader').text(`To do ${counter} tasks`);
		break;
}
}