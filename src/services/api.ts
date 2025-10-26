// Use CORS proxy (works in both dev and production)
const API_URL = "https://corsproxy.io/?https://d25zzadgyf.execute-api.us-east-1.amazonaws.com/prod/students";
const API_KEY = "ql5H2UTRWM6Xgn43P33UA8cJYFrtg8cp3HduSkDQ";

// GET single student
export async function getStudent(record_id: string): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/students?record_id=${record_id}`, {
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

// GET all students (fetch multiple records if you have more in DynamoDB)
export async function getAllStudents(): Promise<any> {
  try {
    // List of known record IDs - add more if you have them in DynamoDB
    const recordIds = ['EDU-001', 'EDU-002', 'EDU-003'];
    
    // Fetch all students in parallel
    const promises = recordIds.map(id => 
      fetch(`${API_URL}/students?record_id=${id}`, {
        headers: { 'x-api-key': API_KEY }
      })
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
    );
    
    const results = await Promise.all(promises);
    // Filter out null results (failed requests)
    const students = results.filter(data => data !== null);
    
    console.log('getAllStudents response:', students);
    return students;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
}

// POST (create student)
export async function addStudent(student: any): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/students`, {
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
export async function updateStudent(record_id: string, student: any): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/students?record_id=${record_id}`, {
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
export async function deleteStudent(record_id: string): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/students?record_id=${record_id}`, {
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
