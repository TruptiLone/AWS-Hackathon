import { motion } from 'framer-motion'
import { Search, Plus, Eye, Mail, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { useState, useEffect } from 'react'
import { getAllStudents, addStudent } from '../services/api'

const students = [
  { id: 'ST001', name: 'John Doe', photo: '👨‍🎓', class: 'CS 301', attendance: 92, engagement: 88, lastActive: '2 hours ago' },
  { id: 'ST002', name: 'Sarah Johnson', photo: '👩‍🎓', class: 'Math 101', attendance: 88, engagement: 95, lastActive: '1 hour ago' },
  { id: 'ST003', name: 'Michael Chen', photo: '👨‍🎓', class: 'Physics 202', attendance: 95, engagement: 90, lastActive: '30 mins ago' },
  { id: 'ST004', name: 'Emily Rodriguez', photo: '👩‍🎓', class: 'CS 301', attendance: 78, engagement: 82, lastActive: '3 hours ago' },
  { id: 'ST005', name: 'David Kim', photo: '👨‍🎓', class: 'Math 101', attendance: 85, engagement: 87, lastActive: '1 hour ago' },
  { id: 'ST006', name: 'Lisa Wang', photo: '👩‍🎓', class: 'Physics 202', attendance: 91, engagement: 93, lastActive: '45 mins ago' },
  { id: 'ST007', name: 'James Wilson', photo: '👨‍🎓', class: 'CS 301', attendance: 65, engagement: 70, lastActive: '5 hours ago' },
  { id: 'ST008', name: 'Maria Garcia', photo: '👩‍🎓', class: 'Math 101', attendance: 89, engagement: 91, lastActive: '2 hours ago' },
  { id: 'ST009', name: 'Robert Taylor', photo: '👨‍🎓', class: 'Physics 202', attendance: 94, engagement: 89, lastActive: '1 hour ago' },
  { id: 'ST010', name: 'Anna Lee', photo: '👩‍🎓', class: 'CS 301', attendance: 87, engagement: 85, lastActive: '4 hours ago' },
]

const getStatusColor = (attendance: number) => {
  if (attendance >= 80) return 'bg-green-100 text-green-800 border-green-200'
  if (attendance >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

// Helper function to transform DynamoDB format to UI format
const transformDynamoDBStudent = (dbStudent: any) => {
  return {
    id: dbStudent.student_id?.S || dbStudent.record_id?.S || 'N/A',
    name: dbStudent.student_name?.S || 'Unknown',
    photo: dbStudent.photo_url?.S || '👨‍🎓',
    class: dbStudent.class_name?.S || 'N/A',
    attendance: Math.round((parseFloat(dbStudent.time_inside_class?.N || '0') / 3600) * 100) || 0,
    engagement: Math.round(parseFloat(dbStudent.engagement?.N || '0') * 100) || 0,
    lastActive: dbStudent.session_date?.S || 'N/A',
    email: dbStudent.student_email?.S || '',
    grade: dbStudent.grade?.N || 'N/A',
    teacher: dbStudent.teacher_name?.S || 'N/A',
  }
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [apiStudents, setApiStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch students from API on component mount
  useEffect(() => {
    // API backend not configured yet - using mock data
    setLoading(false)
    setError('API backend configuration pending - displaying demo data')
    // Uncomment when API is ready:
    // const fetchStudents = async () => {
    //   try {
    //     setLoading(true)
    //     const data = await getAllStudents()
    //     if (data && typeof data === 'object') {
    //       const dataArray = Array.isArray(data) ? data : [data]
    //       const transformed = dataArray.map(transformDynamoDBStudent)
    //       setApiStudents(transformed)
    //     }
    //     setError(null)
    //   } catch (err) {
    //     setError('Failed to load students from database')
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // fetchStudents()
  }, [])

  // Handler for adding a new student
  const handleAddStudent = async () => {
    try {
      const newStudent = {
        id: "S124",
        name: "Alice Johnson",
        email: "alice@university.edu",
        class_id: "COEN233",
        class_name: "Networking"
      }
      const result = await addStudent(newStudent)
      console.log('Student added:', result)
      // Refresh the student list
      const data = await getAllStudents()
      setApiStudents(data)
    } catch (err) {
      console.error('Error adding student:', err)
      alert('Failed to add student')
    }
  }

  // Combine API students with mock students, prioritize API data
  const allStudents = apiStudents.length > 0 ? apiStudents : students
  
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = filterClass === 'all' || student.class === filterClass
    return matchesSearch && matchesClass
  })

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Students Management</h1>
              <p className="text-muted-foreground">
                Manage and track student information and performance
              </p>
            </div>
            <Button className="gap-2" onClick={handleAddStudent}>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <Card className="p-6 mb-6">
              <p className="text-center text-muted-foreground">Loading students from database...</p>
            </Card>
          )}

          {/* Info State */}
          {error && (
            <Card className="p-6 mb-6 border-blue-200 bg-blue-50">
              <p className="text-center text-blue-600">ℹ️ {error}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">Configure API Gateway Lambda integration to connect to DynamoDB</p>
            </Card>
          )}

          {/* API Data Display */}
          {!loading && apiStudents.length > 0 && (
            <Card className="p-6 mb-6 border-green-200 bg-green-50">
              <p className="text-center text-green-600 font-semibold">✅ Connected to database! Displaying {apiStudents.length} student(s) from AWS DynamoDB</p>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded">
                  <p className="text-muted-foreground">Student Name</p>
                  <p className="font-semibold">{apiStudents[0]?.name}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-muted-foreground">Class</p>
                  <p className="font-semibold">{apiStudents[0]?.class}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-muted-foreground">Grade</p>
                  <p className="font-semibold">{apiStudents[0]?.grade}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-muted-foreground">Engagement</p>
                  <p className="font-semibold">{apiStudents[0]?.engagement}%</p>
                </div>
              </div>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Classes</option>
                <option value="CS 301">CS 301</option>
                <option value="Math 101">Math 101</option>
                <option value="Physics 202">Physics 202</option>
              </select>
            </div>
          </Card>

          {/* Desktop Table View */}
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Student ID</th>
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">Class</th>
                    <th className="text-left p-4 font-semibold">Attendance</th>
                    <th className="text-left p-4 font-semibold">Engagement</th>
                    <th className="text-left p-4 font-semibold">Last Active</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium">{student.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {student.photo?.startsWith('http') ? (
                            <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="text-3xl">{student.photo}</div>
                          )}
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{student.class}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.attendance)}`}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2 w-20">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${student.engagement}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{student.engagement}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{student.lastActive}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{student.photo}</div>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.attendance)}`}>
                      {student.attendance}%
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Class:</span>
                      <span className="font-medium">{student.class}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement:</span>
                      <span className="font-medium">{student.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active:</span>
                      <span className="font-medium">{student.lastActive}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredStudents.length} of {allStudents.length} students {apiStudents.length > 0 && '(from database)'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
