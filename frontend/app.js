document.addEventListener("DOMContentLoaded",async () => {
  const todoContainer = document.querySelector(".todos")
  const urlParams = new URLSearchParams(window.location.search);
  const fromLoginPage = urlParams.get('loggedIn')
  const addBtn = document.querySelector(".add-todo-button")
  const errorContainer = document.querySelector(".error-result")
  const spinner = document.querySelector(".spinner");

  let todosArray = []

  let fetchTodo = async () => {
    try {
      const req = await fetch('api/v2/todo/get', {
      method: "GET",
      credentials: "include"
      });

      if(req.status === 200) {
        const decodeData = await req.json()
        todosArray = decodeData.data;
        renderTodo();
      } else if(req.status === 269) {
          todosArray = [];
          renderTodo();
      }
    } catch (error) {
        console.log(error, "something went wrong")
        showError(error)
    } finally {
        spinner.classList.add("hidden");
    }
  }

  let refreshToken = async () => {
    try {
      spinner.classList.remove("hidden")
      const req = await fetch('api/v2/user/refresh', {
        method: "GET",
        credentials: "include"
      })

      if(req.status === 200) {
        console.log("token generated fetch the todos")
        return true;
      } else {
        window.location.href = "/login"
        return false;
      }
    } catch (error) {
    console.log(error, "something went wrong refresh the page or try again in some time");
    showError(error);
    return false;
  } finally {
        spinner.classList.add("hidden");
    }
  }

  let renderTodo = async() => {
    todoContainer.innerHTML = ""
    spinner.classList.add('hidden')
    todosArray.forEach(todo => displayTodo(todo));
    
  }

  let displayTodo = (todo) => {
    const title = todo.title
    const subText = todo.subTitle
    const isCompleted = todo.isCompleted
    const priority = todo.priority
    const date = todo.createdAt
    const id = todo._id
    let priorityText
    let priorityBg 
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
    });
    // "createdAt": "2025-09-06T12:01:47.863Z",
    if(priority === "Low") {
      priorityBg = "bg-green-900"
      priorityText = "text-green-300"
    } else if(priority === "Medium") {
        priorityBg = "bg-yellow-900"
        priorityText = "text-yellow-300"
    } else {
        priorityBg = "bg-red-900"
        priorityText = "text-red-300"
    }

    const div = document.createElement('div');
    div.classList.add("todo", "flex", "flex-col", "bg-gray-800", "border", "border-pink-600", "shadow-lg", "p-4", "mt-4", "rounded-xl", "font-mono", "gap-3")
    div.dataset.id = id
    div.innerHTML = `
      <div class="line-1 flex justify-between items-center gap-4"> 
        <div class="flex items-center gap-3">
            <input id="todo-checkbox-${id}" type="checkbox" class="peer h-5 w-5 rounded border-gray-600 bg-gray-700 text-pink-600 focus:ring-pink-500" ${isCompleted ? "checked" : ""}>
            
            <label for="todo-checkbox-${id}" class="font-bold text-lg text-gray-100 cursor-pointer transition-colors peer-checked:line-through peer-checked:text-gray-500">
                ${title}
            </label>
        </div>
        
        <button class="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500">
            <img src="images/delete.svg" alt="Delete todo" class="w-5 h-5">
        </button>
    </div>

    <div class="line-2 text-gray-300">
        ${subText}
    </div>

    <hr class="border-gray-700">

        <div class="line-3 flex items-center gap-4 text-sm">
        <div class="flex items-center gap-2">
            <span class="text-gray-400">Priority:</span>
            <span class="text-xs font-medium px-2.5 py-0.5 rounded-full ${priorityBg} ${priorityText}">${priority}</span>
        </div>
        
        <div class="flex items-center gap-2">
            <span class="text-gray-400">Date:</span>
            <span class="text-xs font-medium text-gray-300">${formattedDate}</span>
        </div>
    </div>
    `
    todoContainer.append(div);

    div.addEventListener("click", (e) => {handleTodoActions(e)})
  }

  const handleTodoActions = async(e) => {
    //deleting todo 
    spinner.classList.remove("hidden");
    if (e.target.closest("button")) {
      const _id = e.currentTarget.dataset.id;

      try {
        const req = await fetch('api/v2/todo/delete', {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify({
            _id
          })
        })

        if(req.status === 200) {
          const decodeTodo = await req.json();
          todosArray = decodeTodo.data;
          renderTodo();
        } else {
          throw new Error("for some reason todo didnt get Deleted")
        }
      } catch (error) {
         console.log(error, "todo didnt get deleted");
         showError(error);
      } finally {
        spinner.classList.add("hidden");
    } //updating completed or not
    } else if(e.target.type === 'checkbox') {
       const clickedElement = e.target;
        const isCompleted = clickedElement.checked;
        const _id = e.currentTarget.dataset.id;
        try {
          const req = await fetch('api/v2/todo/update', {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
              isCompleted,
              _id
            })
          })
          if(req.status === 201) {
            console.log("do nothing no need to do anything")
          } else {
            throw new Error("something went wrong")
          }
        } catch (error) {
           clickedElement.checked = !isCompleted;
            console.log(error, "something went wrong")
            showError(error);
        } finally {
        spinner.classList.add("hidden");
    }
    }
  }

  let saveTodo = async() => {
    addBtn.disabled = true;
    addBtn.textContent = "Adding..."
    spinner.classList.remove("hidden")
    const titleInput = document.querySelector("#todo-title");
    const textInput = document.querySelector("#todo-subtext")
    const priorityInput = document.querySelector("#priority-select")
    const title = titleInput.value;
    const subTitle = textInput.value;
    const isCompleted = false
    const priority = priorityInput.value;
    if (!title.trim()) {
        alert("Title cannot be empty!");
    addBtn.disabled = false;
    addBtn.textContent = "+Add Todo"
        return; // Stop the function
    }

    try {
      const req = await fetch('api/v2/todo/save', {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          title,
          subTitle,
          isCompleted,
          priority
        })
      })
      if (req.status === 201) {
        titleInput.value = ""
        textInput.value = ""
        priorityInput.value = "Low"
        addBtn.disabled = false;
        addBtn.textContent = "+Add Todo"
        const decode = await req.json();
        todosArray = decode.data;
        renderTodo();
      } else {
        throw new Error("something went wrong while saving todo")
      }
    } catch (error) {
        console.log(error, "something definetly have gone wrong i swear(*_*)")
        showError(error);
    } finally {
        spinner.classList.add("hidden");
    }
  }

  let showError = (errorMessage) => {
    spinner.classList.add("hidden");
    errorContainer.classList.remove("hidden");
  errorContainer.textContent = errorMessage.message;
  setTimeout(() => {
    errorContainer.classList.add("hidden");
  }, 3000);
  }

  if(fromLoginPage) {
    fetchTodo()
  } else {
      const isTokenGenerated = await refreshToken();
      if(isTokenGenerated) {
        fetchTodo();
      }
  }



  addBtn.addEventListener("click", saveTodo)

  setInterval(() => {refreshToken()}, 13 * 60 * 1000);
})


/*
  secret -> usp0cWTDvNfLf1EUnOJC5ZkZMrs
  Api Key -> 	754416677281548
  url -> CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dzwlqc5xt





document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector("#todo-subtext");
    const maxHeight = 150; // Maximum height in pixels

    textarea.addEventListener("input", () => {
        // Temporarily reset height to calculate the new scrollHeight correctly
        textarea.style.height = "auto"; 
        
        // Calculate the new height, but don't let it exceed maxHeight
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        
        // Set the new height
        textarea.style.height = `${newHeight}px`;
    });
});
*/