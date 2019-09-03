let counter = 0;

// set focus to the last character in textarea
let text = $('.newTask').val();
$('.newTask').focus().val('').val(text);
$('.newTask').on('keyup', function(e) {
	
	if( !(e.key == 'Enter' && e.ctrlKey) ) return;

	counter++;
	
	let $task = $('<li/>', {
		'class': 'task'
	}).appendTo('.taskList');

	let $done = $("<input>", {
		'class': 'done',
		type: 'checkbox'
	}).appendTo($task);
	
	let $close = $("<button/>", {
		'class': 'close',
		text: 'x'
	}).appendTo($task);

	let $text = $("<p/>", {
		text: this.value
	}).appendTo($task);
	
	$done.on('click', (e) => {
		if(!$task.is('.made')) {
			counter--;
		} else counter++;
		showCount();
		$task.toggleClass('made');
		$close.toggle();
	});

	$close.on('click', () => {
		$task.remove();
	});
	
	$task.on('dblclick', function (e) {
		if($(e.target).is('.done')) return;
		$task.hide();
		let $edit = $("<textarea/>", {
			'class': 'edit'
		});
		$edit.insertAfter($task);
		$edit.focus().val( $text.text() );
		
		$edit.on('keyup', function(e) {
			if( !(e.key == 'Enter' && e.ctrlKey) ) return;
			$text.text($edit.val());
			$edit.hide();
			$task.show();
		});

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
			$('.taskListHeader').html(`To do 1 task <br> Double click to edit, "Ctrl+Enter" to save.`);
			break;
		default:
			$('.taskListHeader').html(`To do ${counter} tasks <br> Double click to edit, "Ctrl+Enter" to save.`);
			break;
	}
}
