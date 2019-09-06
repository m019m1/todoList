class Task {
	constructor (text, made = false) {
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
		this._made = made;
		this._running =  true;
		this.run();
	}

	run() {
		if(this._made) {
			this._$task.addClass('made');
			this._$done.attr('checked', 'checked');
			this._$close.toggle();
		}

		this._$done.on('click', () => {
			this._$task.toggleClass('made');
			this._$close.toggle();
			this._made ? this._made = false : this._made = true;
			showCount();
		});

		this._$close.on('click', () => {
			this._$task.remove();
			this._running = false;
			tasks = tasks.filter ( (task) => {
				return task._running;
			});
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

let tasksToDo;
let tasks = [];

// do on load
$(()=> {
	let tasksNumber = +localStorage['tasksNumber'];
	if (!tasksNumber) return;
	for(let i = 0; i < tasksNumber; i++) {
		let task = JSON.parse( localStorage[`task${i}`] );
		tasks.push( new Task(task[0], task[1]) );
	}
	showCount();
});

// do before unload
$(window).on('beforeunload', () => {
	tasks.forEach( (task, i) => {
		let json = JSON.stringify( [ task._$textOfTask[0].innerHTML, task._made] )
		localStorage[`task${i}`] = json;
	});

	//delete all extra slots in local storage
	let tasksNumber = +localStorage['tasksNumber'];
	for(let i = tasks.length; i < tasksNumber ; i++) {
		delete localStorage[`task${i}`];
	}

	localStorage['tasksToDo'] = tasksToDo;
	localStorage['tasksNumber'] = tasks.length;
});


// set focus to the last character in textarea
let text = $('.newTask').val();
$('.newTask').focus().val('').val(text);


// create a task
$('.newTask').on('keyup', function (e) {
	if( !(e.key == 'Enter' && e.ctrlKey) || !this.value ) return;
	tasks.push( new Task(this.value) );
	showCount();
	this.value = '';
});

function showCount() {
	tasksToDo = tasks.filter( task => { return !task._made; } ).length;
	switch (tasksToDo) {
		case 0:
			$('.taskListHeader').text(`Nothing to do... boring...`);
			break;
		case 1:
			$('.taskListHeader').html(`To do <span class="tasksToDo">1</span>  task <br> Double click to edit.<br>  "Ctrl+Enter" to save. Esc to exit`);
			break;
		default:
			$('.taskListHeader').html(`To do <span class="tasksToDo">${tasksToDo}</span> tasks <br> Double click to edit.<br>  "Ctrl+Enter" to save. Esc to exit`);
			break;
	}
}