// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration settings
const appSettings = {
  databaseURL:
    "https://playground-vk-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);

//DOM
const notesArea = document.getElementById("js-tasks-container");

// Reference to the "notes" location in the database
const notesListInDB = ref(database, "notes");

document.addEventListener("DOMContentLoaded", () => {
  const addBtnChange = document.getElementById("js-add-btn");
  const incomplete = document.querySelector(".js-error");
  const clearBtn = document.getElementById("clear-btn");

  addBtnChange.addEventListener("click", () => {
    const title = document.getElementById("js-titleInput").value;
    const info = document.getElementById("js-infoInput").value;
    const date = document.getElementById("js-dateInput").value;
    const notesColor = document.getElementById("color").value;
    clearTask();

    if (!title || !info || !date) {
      const errorMessage =
        '<p class="error-message">*Please fill out all fields.</p>';
      incomplete.innerHTML = errorMessage;
      addBtnChange.classList.add("add-btn-error");
      addBtnChange.innerHTML = '<img src="./icons/close.png" alt="Close" />';
      setTimeout(() => {
        addBtnChange.classList.remove("add-btn-error");
        addBtnChange.innerHTML = '<img src="./icons/add.png" alt="Add" />';
      }, 1000);
      return;
    } else {
      incomplete.innerHTML = "";

      addBtnChange.innerHTML = '<img src="./icons/done.png" alt="Done" />';
      addBtnChange.classList.add("add-btn-success");
      setTimeout(() => {
        addBtnChange.classList.remove("add-btn-success");
        addBtnChange.innerHTML = '<img src="./icons/add.png" alt="Add" />';
      }, 1000);
    }
    push(notesListInDB, { title, info, date, notesColor });
    incomplete.textContent = "";
    document.getElementById("js-titleInput").value = "";
    document.getElementById("js-infoInput").value = "";
    document.getElementById("js-dateInput").value = "";
  });

  // Firebase event listener for changes in the "notes" data
  onValue(notesListInDB, function (snapshot) {
    // Check if items exist in the snapshot
    let notesExist = snapshot.exists();

    if (notesExist) {
      // Convert the snapshot values to an array of key-value pairs
      let notesArray = Object.entries(snapshot.val());
      // Clear the list section in the UI
      clearListSection();
      // Iterate through the items and append them to the list in the UI
      for (let i = 0; i < notesArray.length; i++) {
        let currentItem = notesArray[i];
        renderNotes(currentItem);
      }
    } else {
      // Display a message if no items exist
      notesArea.innerHTML = "No notes exists here!!...";
      notesArea.style.fontSize = "1.5rem";
      notesArea.style.color = "rgb(255,0,0)";
    }
  });

  function renderNotes(notes) {
    let itemID = notes[0];
    let itemValue = notes[1];
    // Create a new div item element for the notes
    let divEL = document.createElement("div");
    divEL.classList.add("tasks");
    divEL.style.backgroundColor = itemValue["notesColor"];

    const h3 = document.createElement("h3");
    h3.textContent = itemValue["title"];

    const dateText = document.createElement("p");
    dateText.classList.add("date-text");
    dateText.textContent = itemValue["date"];

    const infoText = document.createElement("p");
    infoText.classList.add("info-text");
    infoText.textContent = itemValue["info"];

    const delBtn = document.createElement("button");
    delBtn.classList.add("del-btn");
    delBtn.onclick = function () {
      // Remove the corresponding element from the DOM and other logic
      let exactLocationOfItemInDatabase = ref(database, `notes/${itemID}`);
      remove(exactLocationOfItemInDatabase);
    };
    const delImg = document.createElement("img");
    delImg.classList.add("del-img");
    delImg.src = "./icons/delete.svg";
    delImg.alt = "Delete";
    delImg.title = "Delete";

    const checkBtn = document.createElement("button");
    checkBtn.id = "check-btn";
    let isClicked = false;
    checkBtn.onclick = () =>{
      if(!isClicked){
        //Add a tick mark 
      checkBtn.style.backgroundColor = 'lightgreen'
      checkBtn.innerHTML = `<img src = "./icons/done.png" alt="Done" title="Marked Done" class="checkBtn-img">`
      isClicked = true
      }
      else{
        checkBtn.style.backgroundColor = 'white'
        checkBtn.innerHTML = ``
        isClicked = false
      }
      
    }

    // Append the elements to the parent div
    delBtn.appendChild(delImg);
    divEL.appendChild(h3);
    divEL.appendChild(dateText);
    divEL.appendChild(infoText);
    divEL.appendChild(delBtn);
    divEL.appendChild(checkBtn);

    // Append the parent div to the parent section in your HTML
    const section = document.getElementById("js-task-area");
    section.appendChild(divEL);

    // Append the notes to the UI
    notesArea.append(divEL);
  }

  // Function to clear input fields and error messages
  function clearTask() {
    clearBtn.addEventListener("click", () => {
      incomplete.textContent = "";
      document.getElementById("js-titleInput").value = "";
      document.getElementById("js-infoInput").value = "";
      document.getElementById("js-dateInput").value = "";
    });
  }

  // Function to clear the list section in the UI
  function clearListSection() {
    notesArea.innerHTML = " ";
  }
});
