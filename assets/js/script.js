// Retrieve tasks and nextId from localStorage

let nextId = JSON.parse(localStorage.getItem("nextId"));
const todoList= $("#todo-cards");
const inProgressList = $("#in-progress-cards");
const doneList = $("#done-cards");
const taskTitleInput = $('#taskTitle');
const dueDateInput =$('#dueDate');
const taskDescriptionInput = $('#taskDescription');
//let currentId = JSON.parse(localStorage.getItem("currentId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    
    let currentId = JSON.parse(localStorage.getItem("currentId"));
    if (!currentId) {currentId = 0} 
    currentId++;
    localStorage.setItem('currentId', currentId);
    return currentId;
}

// Todo: create a function to create a task card
function createTaskCard(newTask) {

const newCard = $('<div>').addClass("card draggable").css("width: 18rem;").attr('data-task-id', newTask.id);
const newCardBody = $('<div>').addClass("card-body");
const newTaskName = $('<h5>').addClass("card-title").text(newTask.title)
const newDueDateField = $('<p>').addClass("card-text").text(newTask.dueDate);
const newStatus = $('<p>').addClass("card-text").text(newTask.currentStatus);
const newDescription = $('<p>').addClass("card-text").text(newTask.description);
const newDeleteButton = $('<button>').addClass("btn btn-danger").text('delete');



if (newTask.dueDate && newTask.status !== 'done') {
    const today = dayjs();
    const dueDate = dayjs(newTask.dueDate, 'DD/MM/YYYY');
    if (today.isSame(dueDate, 'day')) {
      newCard.addClass('bg-warning text-white');
    } else if (today.isAfter(dueDate)) {
      newCard.addClass('bg-danger text-white');
    }
    }


newCardBody.append(newTaskName, newDueDateField, newStatus, newDescription, newDeleteButton);
newCard.append(newCardBody);

todoList.append(newCard);
}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
   
    $(function() {
        $( "#dueDate" ).datepicker();
    });
    $(".deleteBtn").on('click',function(){
        handleDeleteTask();
    })
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
    $(function() {
        $(".draggable").draggable();
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
let taskList = JSON.parse(localStorage.getItem("tasks"));
const taskTitle = taskTitleInput.value;
const taskdueDate = dueDateInput.value;
const taskDescription = taskDescriptionInput.value;
if (taskTitle=='' || taskdueDate=='' || taskDescription=='') {
    alert('please fill out all fields.');
} else {
const newTask = {
    title: taskTitle,
    dueDate: taskdueDate,
    description: taskDescription,
    id: generateTaskId(),
    currentStatus: "notStarted",
}
if (taskList==null) {taskList=[]}
taskList.push(newTask);
taskList = JSON.stringify(taskList);    
localStorage.setItem('tasks', taskList);
   
return newTask;
}
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
const taskId = $(this).attr('data-task-id');
//$(".deleteBtn").parent.empty();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

});


$(".taskForm").on('submit',handleAddTask);
