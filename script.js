class Task {
	constructor (text) {
		this._$task = $('<li/>', {
			'class': 'task',
			
			// it doesn't work in case you want to press "Enter" for 
			// new line (so-called "pre-text") at the time of editing
			// contenteditable: true
		}).appendTo('.taskList');
	
		this._$done = $("<input>", {
			'class': 'done',
			type: 'checkbox'
		}).appendTo(this._$task);
		
		this._$close = $("<button/>", {
			'class': 'close',
			text: 'x'
		}).appendTo(this._$task);
	
		this._$textOfTask = $("<p/>", {
			'class': 'textOfTask',
			text
		}).appendTo(this._$task);
		this.run();
	}

	run() {
		this._$done.on('click', () => {
			this._$task.toggleClass('made');
			this._$task.is('.made') ? taskCounter-- : taskCounter++;
			showCount();
			this._$close.toggle();
		});
		this._$close.on('click', () => {
			this._$task.remove();
		});
		this._$task.on('dblclick', (e) => {
			if($(e.target).is('.done')) return;
			let $edit = $("<textarea/>", {
				'class': 'edit'
			});
			$edit.css('height', `${this._$task.height()}px`);
			this._$task.hide();
			$edit.insertAfter(this._$task);
			$edit.focus().val( this._$textOfTask.text() );
			
			$edit.on('keyup', (e) => {
				if(e.key == 'Escape') {
					$edit.remove();
					this._$task.show();
				}
				if(e.key == 'Enter' && e.ctrlKey) {
					this._$textOfTask.text($edit.val());
					$edit.remove();
					this._$task.show();
				}		
			});
		});
	}
}

let taskCounter = 0;

$(()=> {
	let numberOfTasks = +localStorage['numberOfTasks'];
	if (!numberOfTasks) return;
	// let $taskList = $('.taskList');
	for(let i = 0; i < numberOfTasks; i++) {
		// let task = JSON.parse(localStorage[`task${i}`]);
		// $taskList.append(task);
		// console.log(task);
		let task = new Task(localStorage[`task${i}`]);
	}

	taskCounter = numberOfTasks;
	showCount();
});

$(window).on('beforeunload', () => {
	let $texts = $('.textOfTask');
	$texts.each( (i, text) => {
	// let $tasks =  Array.from(document.getElementsByClassName('task'));
	// $tasks.forEach( (task, i) => {
		// let json = JSON.stringify(text);
		// let json = JSON.stringify(this);
		localStorage[`task${i}`] = $(text).text();
	}); 
	localStorage['taskCounter'] = taskCounter;
	localStorage['numberOfTasks'] = $texts.length;
});


// set focus to the last character in textarea
let text = $('.newTask').val();
$('.newTask').focus().val('').val(text);

$('.newTask').on('keyup', function (e) {
	if( !(e.key == 'Enter' && e.ctrlKey) || !this.value ) return;
	let task = new Task(this.value);
	taskCounter++;
	showCount();
	this.value = '';
});

function showCount() {
	switch (taskCounter) {
		case 0:
			$('.taskListHeader').text(`Nothing to do... boring...`);
			break;
		case 1:
			$('.taskListHeader').html(`To do 1 task (Double click to edit.<br>  "Ctrl+Enter" to save. Esc to exit)`);
			break;
		default:
			$('.taskListHeader').html(`To do ${taskCounter} tasks (Double click to edit.<br>  "Ctrl+Enter" to save. Esc to exit)`);
			break;
	}
}