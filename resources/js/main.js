//create an array to store tasks values in localstorage
let tasksData = (localStorage.getItem('tasksData')) ? JSON.parse(localStorage.getItem('tasksData')) : [];

//create an object to store task values
class TaskData {
    constructor(taskName, taskDescr, taskDate, taskStatus) {
        this.taskName = taskName;
        this.taskDescr = taskDescr;
        this.taskDate = taskDate;
        this.taskStatus = taskStatus;
    }
}

// get today date and show at load
let date = Date.now();
window.onload = () => {
    document.getElementById('todayDay').innerText = navigateDays(date)[0];
    document.getElementById('todayDate').innerText = navigateDays(date)[1];
};

/* Enable datepickr for calendar
* cudos @ https://github.com/joshsalverda
 */
datepickr('#taskDate', {
    dateFormat: 'd/m/Y',
    minDate: new Date().getTime()-86400000
});

/* Global Variables */
const previousControl = document.getElementById('leftArrow');
const nextControl = document.getElementById('rightArrow');
const taskInputContainer = document.getElementById('taskInputContainer');
const taskNameInput = document.getElementById('taskInput');
const taskDateInput = document.getElementById('taskDate');
const message = document.getElementById('message');
const messageText = message.querySelector('p');
const addTaskIcon = document.getElementById('addTaskIcon');
const cancelTaskIcon = document.getElementById('cancelTaskIcon');
const toDoList = document.getElementById('toDoList');
const editTaskIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"> <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" /></svg>`;
const removeTaskIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"> <path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" /></svg>`;


//render only tasks that are set for active date list
let dateToCompare = toISODate(date);
renderToDoList(dateToCompare);

/* On focus add task input, expand parent container to reveal task date input */
taskNameInput.addEventListener('focus', () => {
    taskInputContainer.classList.add('expand');
});

// add event listener to previous Control
previousControl.addEventListener('click', () => {
    date -= 86400000; // a day in miliseconds
    document.getElementById('todayDay').innerText = navigateDays(date)[0];
    document.getElementById('todayDate').innerText = navigateDays(date)[1];

    //load tasks based on their taskDate property
    dateToCompare = toISODate(date);
    renderToDoList(dateToCompare);
});

// add event listener to next Control
nextControl.addEventListener('click', () => {
    date += 86400000; // a day in miliseconds
    document.getElementById('todayDay').innerText = navigateDays(date)[0];
    document.getElementById('todayDate').innerText = navigateDays(date)[1];

    //load tasks based on their taskDate property
    dateToCompare = toISODate(date);
    renderToDoList(dateToCompare);
});

/* On click add task icon, save in local storage
and show task in task list*/ 
let result = "";
addTaskIcon.addEventListener('click', () => {
    const taskName = taskNameInput.value;
    const taskDate = taskDateInput.value;
    
    message.classList.add('show');

    if (taskName && taskDate) {
        let taskData = new TaskData(taskName, null, taskDate, 0);
        tasksData.push(taskData);
        
        result = "OK";
        if (taskDate == dateToCompare) addToTaskList(taskName, taskDate, null);
        
        clearFields(result);
        datatoLocalstorage();
    } 
    else{
        result = "";
        messageText.innerText = 'Please fill both fields.'
        messageText.classList.add('errorMessage');
        messageText.classList.remove('successMessage');
    }
});

/* On click, cancel task icon,
 contract parent container, to hide task date input
 and clear all inputs */
cancelTaskIcon.addEventListener('click', () => {
    clearFields(result);
});

//add data to local storage
function datatoLocalstorage() {
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
};

// render list 
function renderToDoList(dateToCompare) {
    // clear task list
    while (toDoList.firstChild) {
        toDoList.removeChild(toDoList.firstChild);
    }

    // if taskDate is empty, do nothing
    if (!tasksData.length) return;

    //render list if with tasks for active date
    for (var i = 0; i < tasksData.length; i++) {
        var task = tasksData[i];
        if (dateToCompare == task.taskDate){
            addToTaskList(task.taskName, task.taskDate, task.taskStatus);
        }
    }
}

// clear input fields and close input container
function clearFields(action) {
    taskInput.value = "";
    taskDate.value = "";

    // action parameter refers to the state of let result = 'ok' ||''.
    if (action){
        messageText.innerText = 'Task added succesfully in list.';
        messageText.classList.add('successMessage');
        messageText.classList.remove('errorMessage');
        taskInputContainer.classList.remove('expand');

        setTimeout(function () {
            message.classList.remove('show');
        }, 1500);

    } else {
        messageText.innerText = "";
        messageText.classList.remove('errorMessage', 'successMessage');
        taskInputContainer.classList.remove('expand');
    }
}

// add new tasks to DOM
function  addToTaskList(name, date, status){
    let task = document.createElement('li');
    task.classList.add('task');

    let taskActions = document.createElement('div');
    taskActions.classList.add('taskActions');

    let editTask = document.createElement('button');
    editTask.classList.add('editTask');
    editTask.innerHTML = editTaskIcon;

    let removeTask = document.createElement('button');
    removeTask.classList.add('deleteTask');
    removeTask.innerHTML = removeTaskIcon;
    // On click remove task icon, remove task from task list 
    removeTask.addEventListener('click', removeTaskItem);

    let checkComplete = document.createElement('label');
    // check the value of task status, and add checked attribute if needed 
    (status == 1) ? status = 'checked' : '';
    checkComplete.classList.add('checkbox-container', 'taskStatus');
    checkComplete.innerHTML = `<input type="checkbox" ${status}/><span class="checkmark"></span>`;
    // On click, set taskStatus as completed(1)
    checkComplete.querySelector('input').addEventListener('click', setTaskStatus);

    let taskHeading = document.createElement('p');
    taskHeading.classList.add('taskName');
    taskHeading.innerText = name;

    let taskDescr = document.createElement('p');
    taskDescr.classList.add('taskDescr');
    //taskDescr.innerText = name;

    taskActions.appendChild(editTask);
    taskActions.appendChild(removeTask);

    task.appendChild(checkComplete);
    task.appendChild(taskHeading);
    task.appendChild(taskDescr);
    task.appendChild(taskActions);

    toDoList.appendChild(task);
};

// set task as completed
function setTaskStatus() {
    let taskItem = this.parentNode.parentNode;
    let taskItemName = taskItem.querySelector('.taskName').innerText;
    for (var i=0; i<tasksData.length; i++){
        if (tasksData[i].taskName == taskItemName){
            if (this.checked) {
                tasksData[i].taskStatus = 1;    //task completed
                break;
            } else {
                tasksData[i].taskStatus = 0;    //task to do
                break;
            }
        }
    }

    //add to local storage
    datatoLocalstorage();
}

// remove from DOM
function removeTaskItem() {
    let taskItem = this.parentNode.parentNode;
    let taskItemName = taskItem.querySelector('.taskName').innerText;
    toDoList.removeChild(taskItem);

    // remove from tasksData array the object with key: taskName 
    tasksData = tasksData.filter(task => task.taskName != taskItemName);

    //add to local storage
    datatoLocalstorage()
}

//  set previous and next days
function navigateDays(getDate) {
    var days = ["Sunday", "Monday", "Tuesday",
      "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    var months = ["January", "February", "March",
      "April", "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    var theDate = new Date(getDate);
    return [
        days[theDate.getDay()],
        theDate.getDate() + ' ' + months[theDate.getMonth()] + ' ' + theDate.getFullYear()
    ]
  }

  //get the date and format like the value of taskDate
  function toISODate(milliseconds) {
    var date = new Date(milliseconds);
    var y = date.getFullYear()
    var m = date.getMonth() + 1;
    var d = date.getDate();
    m = (m < 10) ? '0' + m : m;
    d = (d < 10) ? '0' + d : d;
    return [d, m, y].join('/');
}