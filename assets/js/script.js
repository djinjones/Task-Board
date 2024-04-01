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

const newCard = $('<li>').css('width', '18rem').css('z-index', '50').attr('data-taskId', task.id).addClass("taskCard");
const newCardBody = $('<div>').addClass("card-body draggable").attr('taskId', task.id).css('border', 'solid black 1px');
const newTaskName = $('<h5>').addClass("card-title").text(task.title);
const newDueDateField = $('<p>').addClass("card-text").text(task.dueDate);
const newStatus = $('<p>').addClass("card-text cardStatusText").text(task.status);
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

newCardBody.append(newTaskName, $('<hr>'), newDueDateField, newStatus, newDescription, newDeleteButton);
newCard.append(newCardBody);


return newCard;
}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {  
    
    $(function() {
        $(".taskCard").draggable({
            cancel: ".deleteBtn", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position 
        });
    });
    
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
    status: "done",
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

// $(".taskCard").on('click', function(){
//     let taskId = $(this).attr('taskId')
// })
// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    

     const tasks = JSON.parse(localStorage.getItem('tasks'));
     let taskId = ui.draggable[0].dataset.taskId;
     let dropStatus = $(this).attr('data-status')
    
     console.log(dropStatus)
     console.log(taskId)
for (let task of tasks){
    if (task.id == taskId) {
        task.status = dropStatus;
    }    
}
localStorage.setItem('tasks', JSON.stringify(tasks));

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $(function() {
        $( "#dueDate" ).datepicker();
    });
    
    $(".taskForm").on('submit',handleAddTask);
    $('.lane').droppable({
        classes: {
        "ui-droppable-active": "ui-state-highlight"
        },
        drop: handleDrop,
    });
    
    // var $draggable = $(".taskCard");
    // $($draggable).draggable({
    //     cancel: ".deleteBtn", // clicking an icon won't initiate dragging
    //     revert: "invalid", // when not dropped, the item will revert back to its initial position 
    //   });
});

$('.tripleList').on('click', '.deleteBtn', handleDeleteTask)



////////////////////////////////////////////////////////////////////////////////////////////// 

// function dragNDrop() {
//     var $droppable = $(".lane")
//     var $draggable = $(".taskCard")
    
//     $droppable.droppable({
//         // accept: ".draggable",
//         classes: {
//           "ui-droppable-active": "ui-state-highlight"
//         },
//         drop: handleDrop,
//       });

//       $($draggable).draggable({
//         cancel: ".deleteBtn", // clicking an icon won't initiate dragging
//         revert: "invalid", // when not dropped, the item will revert back to its initial position .gallery > li
//       });
    
    
    // var $notStarted = $("#todo-cards"),
    //     $inProgress = $("#in-progress-cards"),
    //     $done = $("#done-cards");

  
    // // Let the gallery items be draggable
    // $( "li", $notStarted ).draggable({
    //   cancel: ".deleteBtn", // clicking an icon won't initiate dragging
    //   //revert: "invalid", // when not dropped, the item will revert back to its initial position .gallery > li
    //   containment: "document",
    //   helper: "clone",
    //   cursor: "move"
    // });

    // $( "li", $inProgress ).draggable({
    //     cancel: ".deleteBtn", // clicking an icon won't initiate dragging
    //     //revert: "invalid", // when not dropped, the item will revert back to its initial position .gallery > li
    //     containment: "document",
    //     helper: "clone",
    //     cursor: "move"
    //   });

    //   $( "li", $done ).draggable({
    //     cancel: ".deleteBtn", // clicking an icon won't initiate dragging
    //     //revert: "invalid", // when not dropped, the item will revert back to its initial position .gallery > li
    //     containment: "document",
    //     helper: "clone",
    //     cursor: "move"
    //   });
 
    //   $notStarted.droppable({
    //     // accept: ".draggable",
    //     classes: {
    //       "ui-droppable-active": "ui-state-highlight"
    //     },
    //     drop: function( event, ui ) {
    //     event.target.append( ui.draggable );
    //       deleteImage( ui.draggable );
    //     }
    //   });

    //   $inProgress.droppable({
    //     // accept: ".draggable",
    //     classes: {
    //       "ui-droppable-active": "ui-state-highlight"
    //     },
    //     drop: function( event, ui ) {
    //       event.target.append( ui.draggable );
    //     }
    //   });

    //   $done.droppable({
    //     // accept: ".draggable",
    //     classes: {
    //       "ui-droppable-active": "ui-state-highlight"
    //     },
    //     drop: function( event, ui ) {
    //       event.target.append( ui.draggable );
    //       deleteImage( ui.draggable );
    //     }
    //   });
// };



//////////////////////////////////////////////////////////////////////////////////////////////////
    // There's the gallery and the trash
    // var $gallery = $( ".gallery" ),
    //   $trash = $( ".trash" );
 
    
    // Let the trash be droppable, accepting the gallery items
    // $trash.droppable({
        //   accept: ".gallery > li",
        //   classes: {
        //     "ui-droppable-active": "ui-state-highlight"
        //   },
        //   drop: function( event, ui ) {
        //     deleteImage( ui.draggable );
        //   }
        // });
                
    // // Let the gallery be droppable as well, accepting items from the trash
        // $gallery.droppable({
        //   accept: ".trash li",
        //   classes: {
        //     "ui-droppable-active": "custom-state-active"
        //   },
        //   drop: function( event, ui ) {
        //     recycleImage( ui.draggable );
        //   }
        // });
                
    // Image deletion function
    // var recycle_icon = "<a href='link/to/recycle/script/when/we/have/js/off' title='Recycle this image' class='ui-icon ui-icon-refresh'>Recycle image</a>";
    // function deleteImage( $item ) {
    //   $item.fadeOut(function() {
    //     var $list = $( "ul", $trash ).length ?
    //       $( "ul", $trash ) :
    //       $( "<ul class='gallery ui-helper-reset'/>" ).appendTo( $trash );
 
    //     $item.find( "a.ui-icon-trash" ).remove();
    //     $item.append( recycle_icon ).appendTo( $list ).fadeIn(function() {
    //       $item
    //         .animate({ width: "48px" })
    //         .find( "img" )
    //           .animate({ height: "36px" });
    //     });
    //   });
    // }
 
    // Image recycle function
    // var trash_icon = "<a href='link/to/trash/script/when/we/have/js/off' title='Delete this image' class='ui-icon ui-icon-trash'>Delete image</a>";
    // function recycleImage( $item ) {
    //   $item.fadeOut(function() {
    //     $item
    //       .find( "a.ui-icon-refresh" )
    //         .remove()
    //       .end()
    //       .css( "width", "96px")
    //       .append( trash_icon )
    //       .find( "img" )
    //         .css( "height", "72px" )
    //       .end()
    //       .appendTo( $gallery )
    //       .fadeIn();
    //   });
    // }
 
    // Image preview function, demonstrating the ui.dialog used as a modal window
    // function viewLargerImage( $link ) {
    //   var src = $link.attr( "href" ),
    //     title = $link.siblings( "img" ).attr( "alt" ),
    //     $modal = $( "img[src$='" + src + "']" );
 
    //   if ( $modal.length ) {
    //     $modal.dialog( "open" );
    //   } else {
    //     var img = $( "<img alt='" + title + "' width='384' height='288' style='display: none; padding: 8px;' />" )
    //       .attr( "src", src ).appendTo( "body" );
    //     setTimeout(function() {
    //       img.dialog({
    //         title: title,
    //         width: 400,
    //         modal: true
    //       });
    //     }, 1 );
    //   }
    // }
 
    // Resolve the icons behavior with event delegation
    // $( "ul.gallery > li" ).on( "click", function( event ) {
    //   var $item = $( this ),
    //     $target = $( event.target );
 
    //   if ( $target.is( "a.ui-icon-trash" ) ) {
    //     deleteImage( $item );
    //   } else if ( $target.is( "a.ui-icon-zoomin" ) ) {
    //     viewLargerImage( $target );
    //   } else if ( $target.is( "a.ui-icon-refresh" ) ) {
    //     recycleImage( $item );
    //   }
 
    //   return false;
    // });
  