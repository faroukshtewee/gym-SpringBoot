document.addEventListener("DOMContentLoaded", () => {
    // ===============================
    // DOM Elements
    // ===============================
    const traineeForm = document.getElementById("trainee-form");
    const traineeIdInput = document.getElementById("trainee-id");
    const traineeNameInput = document.getElementById("traineeName");
    const traineeEmailInput = document.getElementById("traineeEmail");
    const traineeJoinDateInput = document.getElementById("traineejoinDate");
    const traineeActivePlanIdInput = document.getElementById("traineeActivePlanId");
    const refreshWorkoutTraineeBtn = document.getElementById("refresh-trainee-active-filter-btn");
    const traineePlanSubmitBtn = traineeForm.querySelector('button[type="submit"]');
    const traineePlanCancelEditeBtn = document.getElementById("cancel-edit-btn-trainee");
    const filteredCountDiv = document.getElementById("stats");
    const filteredCountValue = document.getElementById("total-trainee-count");
    const traineeTableBody = document.getElementById("trainee-table-body");
    const statsDiv = document.getElementById("stats");
    const statusMessage = document.getElementById('status-message-trainee-active-filter');
    const getTraineeJoinedAfterDateBtn = document.getElementById("get-trainee-joined-after-date-btn");
    const TraineeJoinedAfterDate = document.getElementById("traineejoinAfterDate");
    const getTraineeByYearBtn = document.getElementById("get-trainee-by-year-btn");
    const yearSelect = document.getElementById('join-year');
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 15; // Show the last 15 years
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }


    const API_URL = "http://localhost:8080/api/trainees";
    const API_URL_WORKOUT_PLANS = "http://localhost:8080/api/plans";
    const API_URL_TRAINEES_JOINED_AFTER_DATE = "http://localhost:8080/api/trainees/joined-after";
    const API_URL_TRAINEES_BY_YEAR = "http://localhost:8080/api/trainees/grouped-by-year";

    let allTrainees = [];

    // ===============================
    // Functions
    // ===============================
    const fetchtrainee = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch trainees");
            allTrainees = await response.json();
            renderTable(allTrainees);
            updateStats(allTrainees);
        } catch (error) {
            console.error("Error fetching trainees:", error);
        }
    };
     const renderTable = (trainees) => {
    traineeTableBody.innerHTML = "";
  if (trainees.length === 0) {
    traineeTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">
          📋 No trainee in the system. Add your first trainee!
          </td>
        </tr>`;
    return;
  }
    trainees.forEach((trainee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${escapeHTML(trainee.id)}</td>
            <td>${escapeHTML(trainee.name)}</td>
            <td>${escapeHTML(trainee.name)}</td>
            <td>${escapeHTML(trainee.joinDate)}</td>
            <td>${escapeHTML(trainee.activePlanId)}</td>
            <td class="actions-cell">
                <button class="edit-btn" data-id="${trainee.id}">Edit ✏️</button>
                <button class="delete-btn" data-id="${trainee.id}">Delete 🗑️</button>
            </td>
        `;
        traineeTableBody.appendChild(row);
    });
    };
    const escapeHTML = (str) => {
    if (str === null || str === undefined) return "";
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
    };
    const resetForm = () => {
    traineeForm.reset();
    traineeNameInput.value="";
    traineeEmailInput.value="";
    traineeJoinDateInput.value="";
    traineeActivePlanIdInput.value="";
    traineePlanSubmitBtn.textContent = "Add trainee";
    traineePlanSubmitBtn.classList.remove("edit-btn-trainee");
    traineePlanSubmitBtn.classList.add("btn-primary");
    traineePlanCancelEditeBtn.style.display = "none";
}   ;
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const traineeData = {
        //   traineeId: traineeIdInput.value.trim(),
          name: traineeNameInput.value.trim(),
          email: traineeEmailInput.value.trim(),
          joinDate:traineeJoinDateInput.value.trim(),
        activePlanId: parseInt(traineeActivePlanIdInput.value.trim(), 10),
        };
        console.log("Prepared trainee data for submission:", traineeData);
    
        const traineeId = traineeIdInput.value;
        console.log("Submitting trainee data:", traineeData, "ID:", traineeId);
        try {
          const method = traineeId ? "" : "POST";
          const url = traineeId ? `${API_URL}/${traineeId}/assign-plan/${traineeActivePlanIdInput.value}` : API_URL;
    
          const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(traineeData),
          });
              console.log("Submitting to URL:",response );
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error saving trainee");
          }
    
          resetForm();
          await fetchtrainee();
          alert(traineeId ? "✅ The training was successfully updated!" : "✅ The trainee was added successfully!");
        } catch (error) {
          console.error("Error submitting form:", error);
          alert(`❌ Error: ${error.message}`);
        }
    };
    const updateStats = (alltraineeList) => {
      filteredCountValue.textContent = alltraineeList.length;
    };
    const initWorkoutPlansDropdown= async () => {
        // A. Set Loading State
        traineeActivePlanIdInput.innerHTML = `<option selected disabled>${"Load Workout plans...."}</option>`;
        traineeActivePlanIdInput.disabled = true;
        statusMessage.textContent = "Load Workout plans...";
        statusMessage.classList.remove('text-green-500', 'text-red-500');
        statusMessage.classList.add('text-indigo-600');
    
        try {
           const response= await fetchWorkoutPlans(); 
            const plans = createNameIdMap(response);
             console.log("plans data for dropdown:", plans);
            // C. Success: Render the data
            renderWorkoutPlansDropdown(plans);
    
        } catch (error) {
            // D. Error: Display a meaningful error to the user
            traineeActivePlanIdInput.innerHTML = `<option selected disabled>Faild Loading!!!</option>`;
            statusMessage.textContent = `Error: ${error.message}`;
            statusMessage.classList.remove('text-indigo-600', 'text-green-500');
            statusMessage.classList.add('text-red-500');
            console.error("Error fetching Workout plans:", error);
        } finally {
            // E. Cleanup and enable interaction
            traineeActivePlanIdInput.disabled = false;
        }
    }  
    function renderWorkoutPlansDropdown(WorkoutPlans) {
        console.log("Rendering Workout plans dropdown with data:", WorkoutPlans);
        let optionsAdded = 0; 
        
        // 1. Clear any existing content
        traineeActivePlanIdInput.innerHTML = '';
    
        // 2. Add the default placeholder/selection prompt
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Select Workout Plan";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        traineeActivePlanIdInput.appendChild(defaultOption);
    
        // 3. Add the actual data options
       Object.keys(WorkoutPlans).forEach(workoutName => {

            if (typeof workoutName=== 'string' && workoutName !== null) {
                const workoutId = WorkoutPlans[workoutName];
                const option = document.createElement('option');
                option.value = workoutId; 
                option.textContent = workoutName;
                traineeActivePlanIdInput.appendChild(option); 
                optionsAdded++;
            } else {
                console.warn("Skipping invalid Workout Plans data format:", workoutName);
            }
        });
    
        // 4. Update status
        if (optionsAdded > 0) {
            statusMessage.textContent = `${optionsAdded} Workout Plans loaded successfully.`;
            statusMessage.classList.remove('text-indigo-600', 'text-red-500');
            statusMessage.classList.add('text-green-500');
        } else {
            statusMessage.textContent = "No Workout Plans available.";
            statusMessage.classList.remove('text-indigo-600', 'text-green-500');
            statusMessage.classList.add('text-red-500');
        }
    } 
    const fetchWorkoutPlans = async () => {
        try {
            const response = await fetch(API_URL_WORKOUT_PLANS);
            if (!response.ok) throw new Error("Failed to fetch workout plans");
            let allWorkoutPlans = await response.json();
            return allWorkoutPlans;
        } catch (error) {
            console.error("Error fetching workout plans:", error);
        }
    };
    const populateFormForEdit = (trainee) => {
            traineeIdInput.value = trainee.id;
            traineeNameInput.value=trainee.name,
            traineeEmailInput.value=trainee.email,
            traineeJoinDateInput.value=trainee.joinDate,
            traineeActivePlanIdInput.value =trainee.activePlanId,


        traineePlanSubmitBtn.textContent = "Edit Trainee";
        traineePlanSubmitBtn.classList.remove("btn-primary");
        traineePlanSubmitBtn.classList.add("edit-btn-appointment");
        traineePlanCancelEditeBtn.style.display = "inline-block";
        loadDashboard();

        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const removePlanFromTrainee = async (traineeId) => {
        if (!confirm("Are you sure you want to delete the trainee❓")) {
        return;
        }

        try {
        const response = await fetch(`${API_URL}/${traineeId}/remove-plan`, {
            method: "PUT",
        });

        if (!response.ok) {
            throw new Error("Error deleting the trainee");
        }

        await fetchtrainee();
        alert("✅ The trainee was successfully deleted!");
        } catch (error) {
        console.error("Error deleting trainee:", error);
        alert("❌ Error deleting the trainee");
        }
    };

    initWorkoutPlansDropdown();
    const createNameIdMap = (workoutPlans) => {
        const nameIdMap = workoutPlans.reduce((accumulator, currentWorkout) => {
            const nameKey = currentWorkout.name.trim(); 
            const idValue = currentWorkout.id;
            accumulator[nameKey] = idValue;
            return accumulator;
        }, {});
        return nameIdMap;
    };
    const getTraineePlansAfterDate= async (date) => {
        try {
            const response = await fetch(`${API_URL_TRAINEES_JOINED_AFTER_DATE}/${date}`);
            if (!response.ok) throw new Error("Failed to fetch trainee plans after date");  
            const plans = await response.json();
            return plans;
        } catch (error) {
            console.error("Error fetching trainee plans after date:", error);
        }
    };  
    const getTraineesByYear= async (year) => {
        try {
            const response = await fetch(`${API_URL_TRAINEES_BY_YEAR}`);
            if (!response.ok) throw new Error("Failed to fetch trainees by year");  
            const traineesByYear = await response.json();
            return traineesByYear;
        }
        catch (error) {
            console.error("Error fetching trainees by year:", error);
        }
    };

  // ===============================
    // Event Delegation for Edit/Delete
    // ===============================
    traineeTableBody.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-btn")) {
        const traineeId = event.target.dataset.id;
        const trainee = allTrainees.find((p) => p.id == traineeId);
        if (trainee) {
          populateFormForEdit(trainee);
        }
      }
  
      if (event.target.classList.contains("delete-btn")) {
        const traineeId = event.target.dataset.id;
        removePlanFromTrainee(traineeId);
      }

    });
    traineeForm.addEventListener("submit", handleFormSubmit);
    refreshWorkoutTraineeBtn.addEventListener("click", initWorkoutPlansDropdown);
    getTraineeJoinedAfterDateBtn.addEventListener("click", async () => {
        const date = TraineeJoinedAfterDate.value;
        const filteredPlans = await getTraineePlansAfterDate(date);
        renderTable(filteredPlans);
        updateStats(filteredPlans);
    });
    getTraineeByYearBtn.addEventListener("click", async () => {
        const year = yearSelect.value;
        const traineesByYear = await getTraineesByYear(year);
        renderTable(traineesByYear[year]||[]);
        updateStats(traineesByYear[year]||[]);
    });
    fetchtrainee();
});