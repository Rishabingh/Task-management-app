document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector(".add-task-button");
  const inputBar = document.querySelector(".task-input");
  const container = document.querySelector(".task-lists");

  const now = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };

  let tasks = JSON.parse(localStorage.getItem('tasksai')) || [];

  if (tasks.length > 0) {
  // If there are saved tasks, render them otherwise it will show hardcoded task in html;
  tasksLoop();
}

  function tasksLoop() {
     container.replaceChildren();
     tasks.forEach((element) => {
       displayTask(element);
  });
      addEventListeners();
  }
  inputBar.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  })

  addBtn.addEventListener("click", addTask);

  function addTask() {
     const task = inputBar.value.trim();
    if (!task) {return;}
    
    
    const taskObj = {
      id: Date.now(),
      text: task,
      completed: false,
      priority: "Low", //Medium and High
      date: now.toLocaleDateString("en-GB", options),
      subText: "",
    }

    tasks.push(taskObj);
    inputBar.value = "";
    tasksLoop();
    savingLocal();
  }

  function flagColor(priority) {
    if (priority === "Low") {
      return "green"
    } else if (priority === "Medium") {
      return "yellow"
    } else if (priority === "High")  {
      return "red"
    } else {
      return "green"
    }
  }

  function color(priority) {
    if (priority === "Low") {
      return "#75FB4C"
    } else if (priority === "Medium") {
      return "#EAC452"
    } else if (priority === "High")  {
      return "#75FB4C"
    } else {
      return "#75FB4C"
    }
  }

  function displayTask(data) {
    const div = document.createElement('div');
    div.classList.add("tasks", "mt-4", "border-[0.5px]", "border-gray-600", "p-4", "rounded-2xl");
    div.dataset.id = data.id;


    div.innerHTML = `
      <div class="flex justify-between items-center">
              <div class="flex gap-1.5 items-center">
                <input
                  type="checkbox"
                  name=""
                  data-uID="${data.id}"
                  ${data.completed ? "checked" : ""}
                  class="w-5 h-5 task-check"
                />
                <span class="${data.completed ? "line-through" : ""}"
                  >${data.text}</span
                >
              </div>
              <div class="delete-button" id="${data.id}">
                <img src="./images/delete.svg" alt="" class="cursor-pointer" />
              </div>
            </div>

            <div class="text-sm text-gray-300 ml-7 max-w-2xl">
              ${"Custom Created Task, not a part of task created by our AI"}
            </div>

            <div class="flex gap-3 mt-5 ml-7">
              <span class="text-sm text-[${color(data.priority)}] flex gap-1">
                <img src="./images/${flagColor(data.priority)}-flag.svg" alt="" />
                ${data.priority}
              </span>
              <span class="text-sm text-gray-300">${data.date}</span>
            </div>
    `

    container.appendChild(div);
  }

 function addEventListeners() {
    if (tasks.length === 0) return;
    //handling delete buttons
    const delBtn = document.querySelectorAll(".delete-button");
    delBtn.forEach(element => {
     element.addEventListener("click", () => {
     const delId = Number(element.id);
     tasks = tasks.filter(task => task.id !== delId);
     tasksLoop();
     savingLocal();
  });
    });

    //handle checkboxes
      const taskCheck = document.querySelectorAll(".task-check");
      taskCheck.forEach((element) => {
      element.addEventListener("click", () => {
      let checkId = Number(element.dataset.uid);
      console.log(checkId);

      let position = tasks.findIndex(task => task.id === checkId);
      
      if (position !== -1) {
        tasks[position].completed = !tasks[position].completed;
      }
      tasksLoop();
      savingLocal();
      
    });
  });


 }
  
 function savingLocal() {
  localStorage.setItem('tasksai', JSON.stringify(tasks));
 }

});

/*
  <div
            class="tasks mt-4 border-[0.5px] border-gray-600 p-4 rounded-2xl"
          >
            <div class="flex justify-between items-center">
              <div class="flex gap-1.5 items-center">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  class="w-5 h-5 rounded-full border border-black"
                />
                <span class="line-through"
                  >Complete JavaScript Arrays lesson</span
                >
              </div>
              <div>
                <img src="./images/delete.svg" alt="" class="cursor-pointer" />
              </div>
            </div>

            <div class="text-sm text-gray-300 ml-7 max-w-2xl">
              Learn about array methods like map, filter, and reduce
            </div>

            <div class="flex gap-3 mt-5 ml-7">
              <span class="text-sm text-[#EAC452] flex gap-1">
                <img src="./images/yellow-flag.svg" alt="" />
                Medium
              </span>
              <span class="text-sm text-gray-300">14th Aug 2025</span>
            </div>
            <!-- red-flag- #EA3323 -high yellow- #EAC452 medium green- #75FB4C low  -->
          </div>

          */