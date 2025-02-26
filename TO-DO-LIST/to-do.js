// ============= MODAL FUNCTIONS =============
// Display modal with a custom message
function showModal(message) {
  document.getElementById("modal-message").textContent = message;
  document.getElementById("modal-overlay").style.display = "flex";
}

// Hide the modal
function closeModal() {
  document.getElementById("modal-overlay").style.display = "none";
}

// ============= EVENT LISTENERS INITIALIZATION =============
document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");

  // Close modal when clicking outside the content area
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal with the X button or OK button
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", closeModal);
  document.getElementById("modal-ok-btn").addEventListener("click", closeModal);
});

// ============= FETCH & DISPLAY TODOS =============
fetch("https://jsonplaceholder.typicode.com/todos")
  .then((todos) => todos.json())
  .then((result) => {
    // Set the page title
    const titre = document.getElementById("h1");
    titre.textContent = "TO-DO List";
    const list = document.getElementById("todoslist");

    // Iterate through todos and create list items
    result.forEach((todo) => {
      const titre = document.createElement("li");
      let statut;

      // Create container for action buttons
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";

      // Create span for the todo text
      const titleSpan = document.createElement("span");
      titleSpan.className = "todo-title";

      // Different display based on completion status
      if (todo.completed == true) {
        // For completed tasks
        statut = "✅";
        titleSpan.textContent = todo.title + statut;
      } else {
        // For incomplete tasks
        statut = "❌";
        titleSpan.textContent = todo.title + statut;

        // Add "Complete" button for incomplete tasks
        const completeButton = document.createElement("button");
        completeButton.textContent = "Terminer";
        completeButton.className = "btn-terminer";
        completeButton.addEventListener("click", () => {
          updateTodoStatus(todo, titre);
        });
        buttonContainer.appendChild(completeButton);
      }

      // Add "Delete" button for all tasks
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "btn-supprimer";
      deleteButton.addEventListener("click", () => {
        deleteTodoItem(todo, titre);
      });
      buttonContainer.appendChild(deleteButton);

      // Assemble the list item
      titre.appendChild(titleSpan);
      titre.appendChild(buttonContainer);
      list.appendChild(titre);
    });

    // ============= ADD NEW TODO FUNCTIONALITY =============
    const ajouter = document.getElementById("button");
    ajouter.addEventListener("click", () => {
      const tache = document.getElementById("input").value;

      // Validate input is not empty
      if (!tache.trim()) {
        showModal("Veuillez entrer une tâche");
        return;
      }

      // Create new todo via API
      fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        body: JSON.stringify({
          completed: false,
          title: tache,
          id: 201,
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((tache) => {
          // Create and display the new todo item
          const list = document.getElementById("todoslist");
          let li = document.createElement("li");

          // Create title span
          const titleSpan = document.createElement("span");
          titleSpan.className = "todo-title";
          titleSpan.textContent = tache.title + "❌";
          li.appendChild(titleSpan);

          // Create button container
          const buttonContainer = document.createElement("div");
          buttonContainer.className = "button-container";

          // Add "Complete" button
          let button = document.createElement("button");
          button.textContent = "Terminer";
          button.className = "btn-terminer";
          button.addEventListener("click", () => {
            updateTodoStatus(tache, li);
          });
          buttonContainer.appendChild(button);

          // Add "Delete" button
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Supprimer";
          deleteButton.className = "btn-supprimer";
          deleteButton.addEventListener("click", () => {
            deleteTodoItem(tache, li);
          });
          buttonContainer.appendChild(deleteButton);

          // Assemble and add to list at the top
          li.appendChild(buttonContainer);
          list.insertBefore(li, list.firstChild);

          // Clear input field after adding
          document.getElementById("input").value = "";
        });
    });
  })
  .catch((error) => console.error(error));

// ============= TODO ACTION FUNCTIONS =============
// Mark a todo as completed
function updateTodoStatus(todo, listItem) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed: true }),
    headers: { "Content-type": "application/json" },
  })
    .then((response) => response.json())
    .then(() => {
      todo.completed = true;

      // Update the task title with completed status
      const titleSpan = listItem.querySelector(".todo-title");
      const title = titleSpan.textContent.replace("❌", "");
      titleSpan.textContent = title + "✅";

      // Remove the "Complete" button but keep the "Delete" button
      const buttonContainer = listItem.querySelector(".button-container");
      const completeButton = buttonContainer.querySelector(".btn-terminer");
      if (completeButton) {
        buttonContainer.removeChild(completeButton);
      }

      // Show success message
      showModal("Tâche terminée avec succès ✅");
    });
}

// Delete a todo item
function deleteTodoItem(todo, listItem) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Add fade-out animation
        listItem.classList.add("fade-out");

        // Remove the item after animation completes
        setTimeout(() => {
          listItem.remove();
        }, 300);

        // Show success message
        showModal("Tâche supprimée avec succès ❌");
      } else {
        showModal("Erreur lors de la suppression de la tâche");
      }
    })
    .catch((error) => {
      console.error("Error deleting todo:", error);
      showModal("Erreur lors de la suppression de la tâche");
    });
}
