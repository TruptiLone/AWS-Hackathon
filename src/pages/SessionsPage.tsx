import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, Upload, X, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

const sessions = [
  {
    title: 'Data Science Workshop',
    date: 'Oct 28, 2025',
    time: '2:00 PM - 4:00 PM',
    type: 'Virtual',
    instructor: 'Dr. Sarah Johnson',
  },
  {
    title: 'Web Development Q&A',
    date: 'Oct 30, 2025',
    time: '10:00 AM - 11:30 AM',
    type: 'Virtual',
    instructor: 'Prof. Michael Chen',
  },
  {
    title: 'ML Study Group',
    date: 'Nov 2, 2025',
    time: '3:00 PM - 5:00 PM',
    type: 'In-Person',
    instructor: 'Dr. Emily Rodriguez',
  },
]

export default function SessionsPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        setUploadedFile(file)
      } else {
        alert('Please upload a video file')
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('video/')) {
        setUploadedFile(file)
      } else {
        alert('Please upload a video file')
      }
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return
    
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      setUploading(false)
      alert(`Video "${uploadedFile.name}" uploaded successfully for ${selectedSession}!`)
      setUploadModalOpen(false)
      setUploadedFile(null)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Sessions</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Upcoming learning sessions and workshops
        </p>

        <div className="space-y-6">
          {sessions.map((session, index) => (
            <motion.div
              key={session.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{session.title}</CardTitle>
                      <CardDescription>Instructor: {session.instructor}</CardDescription>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {session.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{session.time}</span>
                    </div>
                    {session.type === 'Virtual' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" />
                        <span>Online Session</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm">Register Now</Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedSession(session.title)
                        setUploadModalOpen(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Class Recording
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-lg w-full p-6 relative"
          >
            <button
              onClick={() => {
                setUploadModalOpen(false)
                setUploadedFile(null)
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold mb-2">Upload Class Recording</h2>
            <p className="text-sm text-muted-foreground mb-6">{selectedSession}</p>

            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              {uploadedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <div>
                    <p className="font-semibold">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-semibold mb-1">Drag and drop your video here</p>
                    <p className="text-sm text-muted-foreground">or</p>
                  </div>
                  <label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">Browse Files</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, AVI, MOV (Max 2GB)
                  </p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={!uploadedFile || uploading}
                className="flex-1"
              >
                {uploading ? 'Uploading...' : 'Upload Recording'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadModalOpen(false)
                  setUploadedFile(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
