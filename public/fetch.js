const form = document.getElementById('studentForm');
        const studentList = document.getElementById('studentList');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('studentId').value;
            const name = document.getElementById('studentName').value;

            try {
                const response = await fetch('/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, name }),
                });

                if (response.ok) {
                    // Student added successfully
                    console.log('Student added successfully');
                    // You can update the student list here
                    // Example: fetchStudents();
                } else {
                    console.error('Error adding student:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        });

        // Fetch and display students (you can call this function when the page loads)
        async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:4000/students'); 
        const students = await response.json();

        // Clear existing list items
        studentList.innerHTML = '';

        // Append each student to the list
        students.forEach((student) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${student.id}: ${student.name}`;
            studentList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

// Call fetchStudents initially
fetchStudents();
