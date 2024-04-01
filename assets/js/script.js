// Retrieve tasks and nextId from localStorage


const todoList= $('#todo-cards');
const inProgressList = $('#in-progress-cards');
const doneList = $('#done-cards');
const taskTitleInput = $("#taskTitle");
const dueDateInput =$("#dueDate");
const taskDescriptionInput = $("#taskDescription");
const deleteBtn = $('.deleteBtn');
const lane = $('.tripleList');
lane.css('z-index', '-1');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    
    let currentId = JSON.parse(localStorage.getItem("currentId"));
    if (!currentId) {currentId = 0} 
    currentId++;
    localStorage.setItem('currentId', currentId);
    return currentId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {

const newCard = $('<div>').css('width', '18rem').css('z-index', '50');
const newCardBody = $('<div>').addClass("card-body");
const newTaskName = $('<h5>').addClass("card-title").text(task.title)
const newDueDateField = $('<p>').addClass("card-text").text(task.dueDate);
const newStatus = $('<p>').addClass("card-text").text(task.status);
const newDescription = $('<p>').addClass("card-text").text(task.description);
const newDeleteButton = $('<button>').addClass("btn btn-danger custom-delete-btn deleteBtn").text('delete').attr('data-task-id', task.id);



if (task.dueDate && task.status !== 'done') {
    const today = dayjs();
    const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    if (today.isSame(dueDate, 'day')) {
      newCard.addClass('bg-warning text-white card draggable');
    } else if (today.isAfter(dueDate)) {
      newCard.addClass('bg-danger text-white card draggable');
    } else {newCard.addClass('card bg-info draggable')}
    
} else {newCard.addClass('card bg-info draggable')}

newCardBody.append(newTaskName, newDueDateField, newStatus, newDescription, newDeleteButton);
newCard.append(newCardBody);


return newCard;
}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {  
    
    $(function() {
        $(".draggable").draggable();
    });
    $(function() {
        $('.droppable').droppable();
    })
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    if (!tasks) {tasks = []}
    for (let task of tasks) {
        if (task.status == 'notStarted'){
            todoList.append(createTaskCard(task));
        } else if (task.status == 'inProgress'){
            inProgressList.append(createTaskCard(task));
        } else if (task.status == 'done'){
            doneList.append(createTaskCard(task));
        }
        
    }



}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

if (taskTitleInput.val()==null || dueDateInput.val()==null || taskDescriptionInput.val()==null){
    alert('Please fill out all fields.');
    return;
} else {

let taskList = JSON.parse(localStorage.getItem("tasks"));
const taskTitle = taskTitleInput.val();
const taskdueDate = dueDateInput.val();
const taskDescription = taskDescriptionInput.val();
console.log(taskList);
const newTask = {
    title: taskTitle,
    dueDate: taskdueDate,
    description: taskDescription,
    id: generateTaskId(),
    status: "inProgress",
}
if (taskList==null) {taskList=[]}
taskList.push(newTask);
taskList = JSON.stringify(taskList);    
localStorage.setItem('tasks', taskList);

taskTitleInput.val('')
dueDateInput.val('')
taskDescriptionInput.val('')
console.log(newTask)

renderTaskList();
}
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
const taskId = $(this).attr('data-task-id');
let tasks = JSON.parse(localStorage.getItem('tasks'))
console.log(taskId);

tasks.forEach((task) => {
    if (task.id == taskId) {
        console.log(task.id)
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  console.log(tasks)
tasks = JSON.stringify(tasks);
localStorage.setItem('tasks', tasks)
location.reload();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
     const tasks = JSON.parse(localStorage.getItem('tasks'));
     taskId = ui.draggable[0].dataset.projectId
     let dropStatus = $(this).attr('data-status')

for (let task of tasks){
    
    if (taskId==task.id){
        task.status = dropStatus;
    }
}
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $(function() {
        $( "#dueDate" ).datepicker();
    });
    // $(".deleteBtn").on('click',function(){
    //     handleDeleteTask();
    //})
    $(".taskForm").on('submit',handleAddTask);
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});

$('.tripleList').on('click', '.deleteBtn', handleDeleteTask)