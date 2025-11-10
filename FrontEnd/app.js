document.addEventListener("DOMContentLoaded", () => {
    // ===============================
    // DOM Elements
    // ===============================
    const workoutForm = document.getElementById("workout-plan-form");
    const workoutIdInput = document.getElementById("workout-id");
    const workoutNameInput = document.getElementById("workoutPlanName");
    const workoutDescInput = document.getElementById("workoutPlanDescription");
    const workoutDifficultyInput = document.getElementById("workoutPlanDifficulty");
    const workoutPlanSubmitBtn = workoutForm.querySelector('button[type="submit"]');
    const workoutPlanCancelEditeBtn = document.getElementById("cancel-edit-btn-workout-plan");
    const filteredCountDiv = document.getElementById("stats");
    const filteredCountValue = document.getElementById("total-workouts-count");
    const workoutTableBody = document.getElementById("workout-plans-table-body");
    const statsDiv = document.getElementById("stats");

    const API_URL = "http://localhost:8080/api/plans";

    let allWorkoutPlans = [];

    // ===============================
    // Functions
    // ===============================
    const fetchWorkoutPlans = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch workout plans");
            allWorkoutPlans = await response.json();
            renderTable(allWorkoutPlans);
            updateStats(allWorkoutPlans);
        } catch (error) {
            console.error("Error fetching workout plans:", error);
        }
    };
     const renderTable = (workouts) => {
    workoutTableBody.innerHTML = "";
  if (workouts.length === 0) {
    workoutTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">
          📋 No workout plans in the system. Add your first workout plan!
          </td>
        </tr>`;
    return;
  }
    workouts.forEach((workout) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${escapeHTML(workout.id)}</td>
            <td>${escapeHTML(workout.name)}</td>
            <td>${escapeHTML(workout.description)}</td>
            <td>${escapeHTML(workout.difficulty)}</td>
            <td class="actions-cell">
                <button class="edit-btn" data-id="${workout.id}">Edit ✏️</button>
                <button class="delete-btn" data-id="${workout.id}">Delete 🗑️</button>
            </td>
        `;
        workoutTableBody.appendChild(row);
    });
};
const escapeHTML = (str) => {
    if (str === null || str === undefined) return "";
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
};
const resetForm = () => {
    workoutForm.reset();
    workoutNameInput.value="";
    workoutDescInput.value="";
    workoutDifficultyInput.value="";
    workoutPlanSubmitBtn.textContent = "Add Workout Plan";
    workoutPlanSubmitBtn.classList.remove("edit-btn-workout-plan");
    workoutPlanSubmitBtn.classList.add("btn-primary");
    workoutPlanCancelEditeBtn.style.display = "none";
};
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const workoutPlanData = {
        //   workoutId: workoutIdInput.value.trim(),
          name: workoutNameInput.value.trim(),
          description: workoutDescInput.value.trim(),
          difficulty: parseInt(workoutDifficultyInput.value.trim(), 5),
        };
        console.log("Prepared Workout plan data for submission:", workoutPlanData);
    
        const workoutId = workoutIdInput.value;
        console.log("Submitting Workout plan data:", workoutPlanData, "ID:", workoutId);
        try {
          const method = workoutId ? "PUT" : "POST";
          const url = workoutId ? `${API_URL}/${workoutId}` : API_URL;
    
          const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workoutPlanData),
          });
              console.log("Submitting to URL:",response );
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error saving workout plan");
          }
    
          resetForm();
          await fetchWorkoutPlans();
          alert(workoutId ? "✅ The training was successfully updated!" : "✅ The workout was added successfully!");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert(`❌ Error: ${error.message}`);
        }
      };
          const updateStats = (allWorkoutPlansList) => {
      filteredCountValue.textContent = allWorkoutPlansList.length;
    };
    workoutForm.addEventListener("submit", handleFormSubmit);

    fetchWorkoutPlans();
});