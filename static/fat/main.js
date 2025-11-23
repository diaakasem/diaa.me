document.addEventListener('DOMContentLoaded', function() {
    // Set current date and goal date
    const currentDate = new Date();
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const goalDate = new Date();
    goalDate.setMonth(goalDate.getMonth() + 8);
    document.getElementById('goal-date').textContent = goalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Initialize local storage if needed
    if (!localStorage.getItem('weightLossApp')) {
        const initialData = {
            startDate: new Date().toISOString(),
            startWeight: 140,
            targetWeight: 80,
            currentWeight: 140,
            weightHistory: [{
                date: new Date().toISOString(),
                weight: 140
            }],
            meals: [],
            activities: [],
            waterGlasses: 0,
            calorieGoal: 1800,
            activityGoal: 30,
            measurementHistory: []
        };
        localStorage.setItem('weightLossApp', JSON.stringify(initialData));
    }

    // Load data from local storage
    const loadData = () => {
        return JSON.parse(localStorage.getItem('weightLossApp'));
    };

    // Save data to local storage
    const saveData = (data) => {
        localStorage.setItem('weightLossApp', JSON.stringify(data));
    };

    // Update dashboard
    const updateDashboard = () => {
        const data = loadData();
        document.getElementById('current-weight').textContent = data.currentWeight + ' kg';

        const weightLost = data.startWeight - data.currentWeight;
        const weightGoal = data.startWeight - data.targetWeight;
        const progressPercentage = Math.round((weightLost / weightGoal) * 100);

        document.getElementById('weight-lost').textContent = weightLost.toFixed(1);
        document.getElementById('weight-progress').style.width = progressPercentage + '%';
        document.getElementById('weight-progress').textContent = progressPercentage + '%';

        // Update calorie progress
        const todayMeals = data.meals.filter(meal => {
            const mealDate = new Date(meal.date);
            const today = new Date();
            return mealDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
        });

        const caloriesConsumed = todayMeals.reduce((total, meal) => total + meal.calories, 0);
        const caloriePercentage = Math.min(Math.round((caloriesConsumed / data.calorieGoal) * 100), 100);

        document.getElementById('calories-consumed').textContent = caloriesConsumed;
        document.getElementById('calorie-goal').textContent = data.calorieGoal;
        document.getElementById('calorie-progress').style.width = caloriePercentage + '%';
        document.getElementById('calorie-progress').textContent = caloriePercentage + '%';

        // Update meal plan calories
        document.getElementById('meal-plan-calories').textContent = data.calorieGoal;

        // Update activity progress
        const todayActivities = data.activities.filter(activity => {
            const activityDate = new Date(activity.date);
            const today = new Date();
            return activityDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
        });

        const activityMinutes = todayActivities.reduce((total, activity) => total + activity.duration, 0);
        const activityPercentage = Math.min(Math.round((activityMinutes / data.activityGoal) * 100), 100);

        document.getElementById('activity-completed').textContent = activityMinutes;
        document.getElementById('activity-goal').textContent = data.activityGoal;
        document.getElementById('activity-progress').style.width = activityPercentage + '%';
        document.getElementById('activity-progress').textContent = activityPercentage + '%';

        // Update water progress
        const waterPercentage = Math.min(Math.round((data.waterGlasses / 8) * 100), 100);
        document.getElementById('water-consumed').textContent = data.waterGlasses;
        document.getElementById('water-progress').style.width = waterPercentage + '%';
        document.getElementById('water-progress').textContent = waterPercentage + '%';

        // Update meals list
        const mealsList = document.getElementById('meals-list');
        mealsList.innerHTML = '';
        todayMeals.forEach(meal => {
            const li = document.createElement('li');
            li.textContent = `${meal.name} (${meal.calories} cal)`;
            mealsList.appendChild(li);
        });

        // Update activities list
        const activitiesList = document.getElementById('activities-list');
        activitiesList.innerHTML = '';
        todayActivities.forEach(activity => {
            const li = document.createElement('li');
            li.textContent = `${activity.name} - ${activity.duration} min, ${activity.intensity} intensity`;
            activitiesList.appendChild(li);
        });

        // Update weekly progress circles
        updateWeeklyProgress();

        // Initialize or update charts
        initializeCharts();
    };

    // Update weekly progress visualization
    const updateWeeklyProgress = () => {
        const data = loadData();
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.

        // Reorder to make Monday first day (0)
        const reorderedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const dayCircles = document.querySelectorAll('.day-circle');

        dayCircles.forEach((circle, index) => {
            if (index < reorderedDay) {
                // Past days
                const pastDate = new Date(today);
                pastDate.setDate(today.getDate() - (reorderedDay - index));

                // Check if there's activity data for this day
                const hasActivities = data.activities.some(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate.setHours(0,0,0,0) === pastDate.setHours(0,0,0,0);
                });

                // Check if there's meal data for this day
                const hasMeals = data.meals.some(meal => {
                    const mealDate = new Date(meal.date);
                    return mealDate.setHours(0,0,0,0) === pastDate.setHours(0,0,0,0);
                });

                if (hasActivities && hasMeals) {
                    circle.className = 'day-circle day-complete';
                } else if (hasActivities || hasMeals) {
                    circle.className = 'day-circle day-partial';
                } else {
                    circle.className = 'day-circle day-incomplete';
                }
            } else if (index === reorderedDay) {
                // Today
                const todayActivities = data.activities.filter(activity => {
                    const activityDate = new Date(activity.date);
                    return activityDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
                });

                const todayMeals = data.meals.filter(meal => {
                    const mealDate = new Date(meal.date);
                    return mealDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
                });

                if (todayActivities.length > 0 && todayMeals.length > 0) {
                    circle.className = 'day-circle day-complete';
                } else if (todayActivities.length > 0 || todayMeals.length > 0) {
                    circle.className = 'day-circle day-partial';
                } else {
                    circle.className = 'day-circle day-incomplete animation-pulse';
                }
            } else {
                // Future days
                circle.className = 'day-circle day-future';
            }
        });
    };

    // Initialize charts
    const initializeCharts = () => {
        const data = loadData();

        // Weight Chart
        const weightCtx = document.getElementById('weight-chart').getContext('2d');
        const weightDates = data.weightHistory.map(entry => new Date(entry.date).toLocaleDateString());
        const weights = data.weightHistory.map(entry => entry.weight);

        // Add projected weights
        const startDate = new Date(data.startDate);
        const endDate = new Date(goalDate);
        const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        const weightLossPerDay = (data.startWeight - data.targetWeight) / totalDays;

        const allDates = [];
        const allWeights = [];
        const projectedWeights = [];

        for (let i = 0; i <= totalDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            allDates.push(currentDate.toLocaleDateString());

            const projectedWeight = data.startWeight - (weightLossPerDay * i);
            projectedWeights.push(projectedWeight);

            // Find if we have an actual weight for this date
            const actualEntry = data.weightHistory.find(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.setHours(0,0,0,0) === currentDate.setHours(0,0,0,0);
            });

            if (actualEntry) {
                allWeights.push(actualEntry.weight);
            } else {
                allWeights.push(null);
            }
        }

        if (window.weightChart) {
            window.weightChart.destroy();
        }

        window.weightChart = new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: allDates,
                datasets: [
                    {
                        label: 'Actual Weight',
                        data: allWeights,
                        backgroundColor: 'rgba(79, 70, 229, 0.2)',
                        borderColor: 'rgba(79, 70, 229, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                        tension: 0.1
                    },
                    {
                        label: 'Projected Weight',
                        data: projectedWeights,
                        borderColor: 'rgba(156, 163, 175, 0.5)',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Weight Progress'
                    }
                },
                scales: {
                    y: {
                        min: Math.max(data.targetWeight - 5, 40),
                        max: Math.min(data.startWeight + 5, 160)
                    }
                }
            }
        });

        // Meal Pattern Analysis Chart
        const mealPatternCtx = document.getElementById('meal-pattern-chart').getContext('2d');

        if (window.mealPatternChart) {
            window.mealPatternChart.destroy();
        }

        window.mealPatternChart = new Chart(mealPatternCtx, {
            type: 'bar',
            data: {
                labels: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
                datasets: [{
                    label: 'Average Calories',
                    data: [250, 400, 380, 180],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.5)',
                        'rgba(16, 185, 129, 0.5)',
                        'rgba(239, 68, 68, 0.5)',
                        'rgba(245, 158, 11, 0.5)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Activity Consistency Chart
        const activityConsistencyCtx = document.getElementById('activity-consistency-chart').getContext('2d');

        if (window.activityConsistencyChart) {
            window.activityConsistencyChart.destroy();
        }

        window.activityConsistencyChart = new Chart(activityConsistencyCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Activity Minutes',
                    data: [30, 25, 15, 20, 25, 10, 5],
                    fill: true,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    tension: 0.3
                }]
            }
        });

        // Weight Projection Chart
        const weightProjectionCtx = document.getElementById('weight-projection-chart').getContext('2d');

        if (window.weightProjectionChart) {
            window.weightProjectionChart.destroy();
        }

        window.weightProjectionChart = new Chart(weightProjectionCtx, {
            type: 'line',
            data: {
                labels: ['Start', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8'],
                datasets: [{
                    label: 'Projected Weight',
                    data: [140, 132.5, 125, 117.5, 110, 102.5, 95, 87.5, 80],
                    borderColor: 'rgba(79, 70, 229, 1)',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Weight Loss Projection'
                    }
                }
            }
        });

        // Measurements Chart
        const measurementsCtx = document.getElementById('measurements-chart').getContext('2d');

        if (window.measurementsChart) {
            window.measurementsChart.destroy();
        }

        window.measurementsChart = new Chart(measurementsCtx, {
            type: 'line',
            data: {
                labels: ['Start', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Waist',
                        data: [120, 118, 116, 114, 112],
                        borderColor: 'rgba(79, 70, 229, 1)',
                        tension: 0.1
                    },
                    {
                        label: 'Hip',
                        data: [130, 128, 127, 125, 123],
                        borderColor: 'rgba(16, 185, 129, 1)',
                        tension: 0.1
                    },
                    {
                        label: 'Chest',
                        data: [125, 124, 122, 121, 119],
                        borderColor: 'rgba(245, 158, 11, 1)',
                        tension: 0.1
                    }
                ]
            }
        });

        // Caloric Balance Chart
        const calorieBalanceCtx = document.getElementById('calorie-balance-chart').getContext('2d');

        if (window.calorieBalanceChart) {
            window.calorieBalanceChart.destroy();
        }

        window.calorieBalanceChart = new Chart(calorieBalanceCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Calories Consumed',
                        data: [1750, 1820, 1780, 1850, 1920, 2100, 2050],
                        backgroundColor: 'rgba(239, 68, 68, 0.5)'
                    },
                    {
                        label: 'Calories Burned',
                        data: [2100, 2150, 2080, 2100, 2200, 2250, 2000],
                        backgroundColor: 'rgba(16, 185, 129, 0.5)'
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Activity Progress Chart
        const activityProgressCtx = document.getElementById('activity-progress-chart').getContext('2d');

        if (window.activityProgressChart) {
            window.activityProgressChart.destroy();
        }

        window.activityProgressChart = new Chart(activityProgressCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
                datasets: [
                    {
                        label: 'Walking (min/week)',
                        data: [90, 105, 120, 140, 160, 180, 200, 210],
                        borderColor: 'rgba(79, 70, 229, 1)',
                        tension: 0.1
                    },
                    {
                        label: 'Strength (min/week)',
                        data: [30, 30, 45, 45, 60, 60, 75, 75],
                        borderColor: 'rgba(245, 158, 11, 1)',
                        tension: 0.1
                    },
                    {
                        label: 'Swimming (min/week)',
                        data: [0, 20, 30, 30, 40, 45, 60, 60],
                        borderColor: 'rgba(16, 185, 129, 1)',
                        tension: 0.1
                    }
                ]
            }
        });
    };

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = tab.getAttribute('data-tab');
            document.getElementById(contentId).classList.add('active');
        });
    });

    // Weight logging modal
    const weightLogModal = document.getElementById('weight-log-modal');
    const logWeightBtn = document.getElementById('log-weight-btn');
    const cancelWeightBtn = document.getElementById('cancel-weight-btn');
    const saveWeightBtn = document.getElementById('save-weight-btn');

    logWeightBtn.addEventListener('click', () => {
        const data = loadData();
        document.getElementById('weight-input').value = data.currentWeight;
        weightLogModal.classList.remove('hidden');
    });

    cancelWeightBtn.addEventListener('click', () => {
        weightLogModal.classList.add('hidden');
    });

    saveWeightBtn.addEventListener('click', () => {
        const weightInput = document.getElementById('weight-input');
        const newWeight = parseFloat(weightInput.value);

        if (!isNaN(newWeight) && newWeight > 0) {
            const data = loadData();
            data.currentWeight = newWeight;
            data.weightHistory.push({
                date: new Date().toISOString(),
                weight: newWeight
            });

            // Sort weight history by date
            data.weightHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

            saveData(data);
            updateDashboard();
            weightLogModal.classList.add('hidden');

            // Show feedback message
            const feedbackContainer = document.getElementById('behavior-feedback-container');
            const weightChange = data.weightHistory.length > 1 ?
                newWeight - data.weightHistory[data.weightHistory.length - 2].weight : 0;

            let feedbackClass = 'feedback-good';
            let feedbackTitle = 'Great Job!';
            let feedbackMessage = 'You\'ve lost weight since your last measurement!';

            if (weightChange > 0) {
                feedbackClass = 'feedback-warning';
                feedbackTitle = 'Weight Gain Detected';
                feedbackMessage = 'Don\'t worry! Small fluctuations are normal. Let\'s focus on your plan for the coming days.';
            } else if (weightChange === 0) {
                feedbackClass = 'feedback-warning';
                feedbackTitle = 'Weight Maintained';
                feedbackMessage = 'Your weight is stable. Let\'s look for ways to continue your progress.';
            }

            const feedbackCard = document.createElement('div');
            feedbackCard.className = `feedback-card ${feedbackClass} p-3 mb-3`;
            feedbackCard.innerHTML = `
                <h4 class="font-medium">${feedbackTitle}</h4>
                <p>${feedbackMessage}</p>
            `;

            // Insert at the beginning
            feedbackContainer.insertBefore(feedbackCard, feedbackContainer.firstChild);
        }
    });

    // Add water glass
    document.getElementById('add-water-btn').addEventListener('click', () => {
        const data = loadData();
        if (data.waterGlasses < 8) {
            data.waterGlasses += 1;
            saveData(data);
            updateDashboard();
        }
    });

    // Reset today's data
    document.getElementById('reset-day-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset today\'s data?')) {
            const data = loadData();
            const today = new Date();

            // Remove today's meals
            data.meals = data.meals.filter(meal => {
                const mealDate = new Date(meal.date);
                return mealDate.setHours(0,0,0,0) !== today.setHours(0,0,0,0);
            });

            // Remove today's activities
            data.activities = data.activities.filter(activity => {
                const activityDate = new Date(activity.date);
                return activityDate.setHours(0,0,0,0) !== today.setHours(0,0,0,0);
            });

            // Reset water glasses
            data.waterGlasses = 0;

            saveData(data);
            updateDashboard();
        }
    });

    // Log activity functionality
    document.getElementById('log-activity-btn').addEventListener('click', () => {
        const activityType = document.getElementById('activity-type').value;
        const activityDuration = parseInt(document.getElementById('activity-duration').value, 10);

        // Get selected intensity
        let intensity = 'medium';
        document.querySelectorAll('.intensity-btn').forEach(btn => {
            if (btn.classList.contains('btn-primary')) {
                intensity = btn.getAttribute('data-intensity');
            }
        });

        if (!isNaN(activityDuration) && activityDuration > 0) {
            const data = loadData();
            data.activities.push({
                name: activityType.charAt(0).toUpperCase() + activityType.slice(1),
                duration: activityDuration,
                intensity: intensity,
                date: new Date().toISOString()
            });

            saveData(data);
            updateDashboard();

            // Feedback
            alert('Activity logged successfully!');
        }
    });

    // Intensity buttons
    document.querySelectorAll('.intensity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.intensity-btn').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        });
    });

    // Quick add meal items
    document.querySelectorAll('.meal-item').forEach(item => {
        item.addEventListener('click', () => {
            const mealName = item.getAttribute('data-name');
            const mealCalories = parseInt(item.getAttribute('data-calories'), 10);
            const mealType = document.getElementById('meal-type').value;

            const data = loadData();
            data.meals.push({
                name: mealName,
                calories: mealCalories,
                type: mealType,
                date: new Date().toISOString()
            });

            saveData(data);
            updateDashboard();
        });
    });

    // Quick add activity items
    document.querySelectorAll('.activity-item').forEach(item => {
        item.addEventListener('click', () => {
            const activityName = item.getAttribute('data-name');
            const activityDuration = parseInt(item.getAttribute('data-duration'), 10);
            const activityIntensity = item.getAttribute('data-intensity');

            const data = loadData();
            data.activities.push({
                name: activityName,
                duration: activityDuration,
                intensity: activityIntensity,
                date: new Date().toISOString()
            });

            saveData(data);
            updateDashboard();
        });
    });

    // Save settings
    document.getElementById('save-settings-btn').addEventListener('click', () => {
        const startingWeight = parseFloat(document.getElementById('starting-weight').value);
        const targetWeight = parseFloat(document.getElementById('target-weight').value);
        const calorieGoal = parseInt(document.getElementById('calorie-goal-setting').value, 10);

        if (!isNaN(startingWeight) && !isNaN(targetWeight) && !isNaN(calorieGoal)) {
            const data = loadData();

            // Update only if values have changed
            if (data.startWeight !== startingWeight) {
                data.startWeight = startingWeight;
                // If this is the first weight entry, update it too
                if (data.weightHistory.length === 1) {
                    data.weightHistory[0].weight = startingWeight;
                }
            }

            data.targetWeight = targetWeight;
            data.calorieGoal = calorieGoal;

            saveData(data);
            updateDashboard();

            alert('Settings saved successfully!');
        }
    });

    // Initialize dashboard on page load
    updateDashboard();

    // Set default intensity button
    document.querySelector('[data-intensity="medium"]').classList.add('btn-primary');
    document.querySelector('[data-intensity="low"]').classList.add('btn-secondary');
    document.querySelector('[data-intensity="high"]').classList.add('btn-secondary');

    // Save measurements
    document.getElementById('save-measurements-btn').addEventListener('click', () => {
        const waist = parseFloat(document.getElementById('waist-measurement').value);
        const hip = parseFloat(document.getElementById('hip-measurement').value);
        const chest = parseFloat(document.getElementById('chest-measurement').value);
        const thigh = parseFloat(document.getElementById('thigh-measurement').value);

        if (!isNaN(waist) || !isNaN(hip) || !isNaN(chest) || !isNaN(thigh)) {
            const data = loadData();

            data.measurementHistory.push({
                date: new Date().toISOString(),
                measurements: {
                    waist: waist || null,
                    hip: hip || null,
                    chest: chest || null,
                    thigh: thigh || null
                }
            });

            saveData(data);
            alert('Measurements saved successfully!');

            // Clear input fields
            document.getElementById('waist-measurement').value = '';
            document.getElementById('hip-measurement').value = '';
            document.getElementById('chest-measurement').value = '';
            document.getElementById('thigh-measurement').value = '';
        }
    });

    // Export data
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const data = loadData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = 'weight-loss-data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    // Reset data
    document.getElementById('reset-data-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.removeItem('weightLossApp');
            location.reload();
        }
    });

    // Personalized tips
    document.getElementById('get-personalized-tips-btn').addEventListener('click', () => {
        const data = loadData();

        // Calculate weight loss rate
        const weightLossRate = (data.startWeight - data.currentWeight) /
            (Math.max(1, (new Date() - new Date(data.startDate)) / (1000 * 60 * 60 * 24 * 7)));

        const adaptiveRecommendations = document.getElementById('adaptive-recommendations');
        adaptiveRecommendations.innerHTML = '';

        // Create different recommendations based on progress
        if (weightLossRate < 1) {
            // Slow progress
            adaptiveRecommendations.innerHTML += `
                <div class="p-3 border-l-4 border-indigo-500 bg-indigo-50 mb-3">
                    <h4 class="font-medium text-indigo-700">Increase Your Deficit</h4>
                    <p class="text-gray-700">Your weight loss is slower than your goal. Consider reducing your daily calorie intake by 200 calories.</p>
                </div>

                <div class="p-3 border-l-4 border-indigo-500 bg-indigo-50 mb-3">
                    <h4 class="font-medium text-indigo-700">Add More Activity</h4>
                    <p class="text-gray-700">Try adding a second short walking session each day to boost your metabolism.</p>
                </div>
            `;
        } else if (weightLossRate > 2.5) {
            // Too fast progress
            adaptiveRecommendations.innerHTML += `
                <div class="p-3 border-l-4 border-indigo-500 bg-indigo-50 mb-3">
                    <h4 class="font-medium text-indigo-700">Slow Down For Sustainability</h4>
                    <p class="text-gray-700">Your weight loss is faster than recommended. Consider increasing your calories slightly to ensure you're getting proper nutrition.</p>
                </div>

                <div class="p-3 border-l-4 border-indigo-500 bg-indigo-50 mb-3">
                    <h4 class="font-medium text-indigo-700">Focus on Protein</h4>
                    <p class="text-gray-700">Make sure you're getting enough protein (at least 140g daily) to preserve muscle mass during rapid weight loss.</p>
                </div>
            `;
        } else {
            // Good progress
            adaptiveRecommendations.innerHTML += `
                <div class="p-3 border-l-4 border-indigo-500 bg-indigo-50 mb-3">
                    <h4 class="font-medium text-indigo-700">Great Progress!</h4>
                    <p class="text-gray-700">You're right on track with your weight loss goals. Keep up the great work!</p>
                </div>

                <div class="p-3 border-l-4 border-indigo-500 bg-indigo-50 mb-3">
                    <h4 class="font-medium text-indigo-700">Progressive Challenge</h4>
                    <p class="text-gray-700">Consider adding a new challenge to your routine, such as a new type of exercise or extending your walking time by 5 minutes.</p>
                </div>
            `;
        }

        // Add common recommendation
        adaptiveRecommendations.innerHTML += `
            <div class="p-3 border-l-4 border-indigo-500 bg-indigo-50 mb-3">
                <h4 class="font-medium text-indigo-700">Weekly Planning</h4>
                <p class="text-gray-700">Take 15 minutes each Sunday to plan your meals and activities for the week ahead. This simple habit significantly increases adherence.</p>
            </div>
        `;

        // Scroll to recommendations
        adaptiveRecommendations.scrollIntoView({ behavior: 'smooth' });
    });

    // Customize meal plan button
    document.getElementById('customize-meal-plan-btn').addEventListener('click', () => {
        alert('This feature will allow you to customize your meal plan based on preferences, allergies, and dietary restrictions. This functionality will be available in the next update.');
    });

    // Customize activity plan button
    document.getElementById('customize-activity-plan-btn').addEventListener('click', () => {
        alert('This feature will allow you to customize your activity plan based on preferences, physical limitations, and available equipment. This functionality will be available in the next update.');
    });
});
