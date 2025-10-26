const API_URL = "https://d25zzadgyf.execute-api.us-east-1.amazonaws.com/prod";
const API_KEY = "ql5H2UTRWM6Xgn43P33UA8cJYFrtg8cp3HduSkDQ";

// GET single student
export async function getStudent(id) {
  try {
    const res = await fetch(`${API_URL}/student?id=${id}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('getStudent response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
}

// GET all students
export async function getAllStudents() {
  try {
    const res = await fetch(`${API_URL}/student`, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('getAllStudents response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
}

// POST (create student)
export async function addStudent(student) {
  try {
    const res = await fetch(`${API_URL}/student`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'x-api-key': API_KEY
      },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('addStudent response:', data);
    return data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
}

// PUT (update student)
export async function updateStudent(id, student) {
  try {
    const res = await fetch(`${API_URL}/student?id=${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        'x-api-key': API_KEY
      },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('updateStudent response:', data);
    return data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

// DELETE student
export async function deleteStudent(id) {
  try {
    const res = await fetch(`${API_URL}/student?id=${id}`, {
      method: "DELETE",
      headers: {
        'x-api-key': API_KEY
      }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('deleteStudent response:', data);
    return data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}
