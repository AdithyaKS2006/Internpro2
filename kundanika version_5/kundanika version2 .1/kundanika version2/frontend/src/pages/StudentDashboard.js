import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GraduationCap, LogOut, User, Briefcase, FileText, Award, Bell, Search, X, ChevronRight, Star, Trophy, Target, BookOpen, Users, Globe, MessageCircle, BarChart3, Plus, Download, Github, Play, Video, FileEdit, Rocket, Code, Lightbulb, Lock } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API, getAuthHeaders } from './api';
import InternshipCard from './InternshipCard';
import OnboardingWizard from '../components/OnboardingWizard';
import AddProjectModal from '../components/AddProjectModal';
import AddCertificateModal from '../components/AddCertificateModal';
import QuizModal from '../components/QuizModal';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function StudentDashboard({ user, logout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState({});
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hi there! I'm your career assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [badges, setBadges] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizStep, setQuizStep] = useState(0); // 0: info, 1: questions, 2: result
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [progressData, setProgressData] = useState({ radar_data: [], scores: {}, total_points: 0, quizzes_completed: 0 });
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    if (user && user.profile_completed === false) {
      setShowOnboarding(true);
    }
  }, [user]);
  
  // Available Badges Configuration
  const AVAILABLE_BADGES = [
    { key: 'first_application', name: 'Go Getter', icon: Rocket, color: 'text-red-500', description: 'Submitted your first application' },
    { key: 'project_pro', name: 'Project Pro', icon: Code, color: 'text-blue-500', description: 'Added a project to portfolio' },
    { key: 'skill_builder', name: 'Skill Builder', icon: Lightbulb, color: 'text-yellow-500', description: 'Added 5 or more skills' },
    { key: 'profile_completionist', name: 'All-Star Profile', icon: Star, color: 'text-yellow-500', description: 'Completed all core profile sections' },
    { key: 'certificate_earner', name: 'Certified Expert', icon: Award, color: 'text-green-500', description: 'Earned your first certificate' }
  ];
  
  // Mock data for learning resources
  const learningResources = [
    { id: 1, title: 'Advanced JavaScript Course', platform: 'Coursera', type: 'Course', url: 'https://www.coursera.org/learn/programming-languages' },
    { id: 2, title: 'Python for Data Science', platform: 'edX', type: 'Course', url: 'https://www.edx.org/learn/python/university-of-california-san-diego-python-for-data-science' },
    { id: 3, title: 'Communication Skills Workshop', platform: 'NPTEL', type: 'Workshop', url: 'https://nptel.ac.in/courses/109/104/109104031/' }
  ];
  
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, internshipsRes, applicationsRes, certificatesRes, notificationsRes, projectsRes, badgesRes, quizzesRes, progressRes] = await Promise.all([
        axios.get(`${API}/students/profile`, getAuthHeaders()),
        axios.get(`${API}/internships`, getAuthHeaders()),
        axios.get(`${API}/applications`, getAuthHeaders()),
        axios.get(`${API}/certificates`, getAuthHeaders()),
        axios.get(`${API}/notifications`, getAuthHeaders()),
        axios.get(`${API}/projects`, getAuthHeaders()),
        axios.get(`${API}/badges`, getAuthHeaders()),
        axios.get(`${API}/quizzes`, getAuthHeaders()),
        axios.get(`${API}/students/progress`, getAuthHeaders())
      ]);
      const pData = profileRes.data || {};
      const uData = JSON.parse(localStorage.getItem('user') || '{}');
      pData.name = pData.name || uData.name || '';
      pData.email = pData.email || uData.email || '';
      pData.phone = pData.phone || uData.phone || '';
      setProfile(pData);
      setInternships(internshipsRes.data);
      if (internshipsRes.data && internshipsRes.data.length > 0) {
        setOpportunities(internshipsRes.data);
      }
      setApplications(applicationsRes.data);
      setCertificates(certificatesRes.data);
      setNotifications(notificationsRes.data);
      setProjects(projectsRes.data);
      setBadges(badgesRes.data);
      setQuizzes(quizzesRes.data);
      setProgressData(progressRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data.");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/applications`, getAuthHeaders());
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/notifications`, getAuthHeaders());
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/projects`, getAuthHeaders());
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`, getAuthHeaders());
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const updateProfile = async () => {
    setProfileLoading(true);
    try {
      await axios.put(`${API}/students/profile`, profile, getAuthHeaders());
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills?.includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill)
    });
  };

  const applyToInternship = async (internshipId) => {
    try {
      if (!user) {
        toast.error('You must be logged in to apply');
        return;
      }
      
      const userId = user.user_id || user.id;
      if (!userId) {
        console.error('User ID not found in user object:', user);
        toast.error('User session error. Please log out and log in again.');
        return;
      }

      await axios.post(
        `${API}/applications`,
        { internship_id: String(internshipId), student_id: String(userId) },
        getAuthHeaders()
      );
      toast.success('Application submitted successfully!');
      fetchApplications();
    } catch (error) {
      console.error("Apply error:", error.response?.data);
      const errorDetail = error.response?.data?.detail;
      const errorMessage = Array.isArray(errorDetail) 
        ? errorDetail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        : (typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail);
      
      toast.error(errorMessage || 'Failed to apply');
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await axios.put(`${API}/notifications/${notificationId}/read`, {}, getAuthHeaders());
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      setQuizLoading(true);
      const response = await axios.get(`${API}/quizzes/${quizId}`, getAuthHeaders());
      setActiveQuiz(response.data);
      setQuizStep(0);
      setQuizAnswers([]);
      setCurrentQuestionIndex(0);
    } catch (error) {
      toast.error('Failed to load quiz details');
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      setQuizLoading(true);
      const response = await axios.post(`${API}/quizzes/${activeQuiz.id}/submit`, { answers: finalAnswers }, getAuthHeaders());
      setQuizResult(response.data);
      setQuizStep(2);
      fetchAllData(); // Refresh badges/points
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleNextQuestion = (answerIndex) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);
    
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const newMessage = {
      id: Date.now(),
      text: userMsg,
      sender: 'user'
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
    setIsTyping(true);
    
    try {
      const response = await axios.post(`${API}/chat`, { message: userMsg }, getAuthHeaders());
      const botResponse = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'bot'
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GraduationCap className="h-12 w-12 animate-spin text-blue-600" />
        <p className="ml-4 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="glass border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>InternPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab('notifications')} data-testid="notifications-icon-btn">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" data-testid="notification-count-badge">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} data-testid="logout-btn">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8" data-testid="student-tabs">
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="opportunities" data-testid="tab-opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="learning" data-testid="tab-learning">Learning</TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Main Dashboard */}
          <TabsContent value="dashboard" data-testid="dashboard-content">
            <div className="space-y-8">
              {/* Achievement Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Achievements</h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                  {AVAILABLE_BADGES.map((badgeConfig) => {
                    const earnedBadge = badges.find(b => b.key === badgeConfig.key);
                    const isEarned = !!earnedBadge;
                    const IconComponent = isEarned ? badgeConfig.icon : Lock;
                    
                    return (
                      <Card 
                        key={badgeConfig.key} 
                        className={`min-w-[150px] flex-shrink-0 transition-all ${isEarned ? 'border-l-4 border-l-blue-500' : 'opacity-60 bg-gray-50'}`}
                        title={badgeConfig.description}
                      >
                        <CardContent className="p-4 flex flex-col items-center relative">
                          <IconComponent className={`h-8 w-8 mb-2 ${isEarned ? badgeConfig.color : 'text-gray-400'}`} />
                          <h3 className={`font-medium text-center text-sm ${isEarned ? 'text-gray-900' : 'text-gray-500'}`}>
                            {badgeConfig.name}
                          </h3>
                          {isEarned && earnedBadge?.earned_at && (
                            <p className="text-[10px] text-gray-400 mt-2">
                              {new Date(earnedBadge.earned_at).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* Career Chatbot */}
              <div className="fixed bottom-6 right-6 z-50">
                {chatOpen ? (
                  <Card className="w-80 h-96 flex flex-col">
                    <CardHeader className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Career Assistant</h3>
                        <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>×</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 overflow-y-auto">
                      <div className="space-y-3">
                        {chatMessages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 max-w-[80%] rounded-lg p-3">
                              <p className="text-sm text-gray-500 italic">Thinking...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <form onSubmit={handleChatSubmit} className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1"
                        />
                        <Button type="submit" size="sm">Send</Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {['Help me find Python internships', 'Improve my coding skills', 'Resume tips'].map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                            onClick={() => setChatInput(prompt)}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </form>
                  </Card>
                ) : (
                  <Button
                    size="lg"
                    className="rounded-full h-14 w-14 p-0 shadow-lg"
                    onClick={() => setChatOpen(true)}
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                )}
              </div>

              {/* Skill Analytics */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Skill Analytics
                    </CardTitle>
                    <CardDescription>Your performance across key skill areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={progressData.radar_data.length > 0 ? progressData.radar_data : [
                          { subject: 'Technical Skills', A: 0, fullMark: 100 },
                          { subject: 'Logical Reasoning', A: 0, fullMark: 100 },
                          { subject: 'Verbal Ability', A: 0, fullMark: 100 },
                          { subject: 'Communication', A: 0, fullMark: 100 },
                          { subject: 'Projects', A: 0, fullMark: 100 },
                        ]}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#2563eb"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* InternMatch Link */}
              <section>
                <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold mb-2">Global Opportunities</h3>
                        <p className="opacity-90">Discover international internships and exchange programs</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            className="bg-white text-blue-600 hover:bg-gray-100"
                          >
                            View Global Opportunities
                            <Globe className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Global Opportunities</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4 cursor-pointer">
                            <Card className="hover:bg-slate-50 transition-colors" onClick={() => window.open('https://internshala.com', '_blank')}>
                              <CardContent className="p-4 flex items-center justify-between">
                                <div><h4 className="font-bold">Internshala</h4><p className="text-sm text-gray-500">India's top internship site</p></div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </CardContent>
                            </Card>
                            <Card className="hover:bg-slate-50 transition-colors" onClick={() => window.open('https://unstop.com', '_blank')}>
                              <CardContent className="p-4 flex items-center justify-between">
                                <div><h4 className="font-bold">Unstop</h4><p className="text-sm text-gray-500">Competitions & Internships</p></div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </CardContent>
                            </Card>
                            <Card className="hover:bg-slate-50 transition-colors" onClick={() => window.open('https://linkedin.com/jobs', '_blank')}>
                              <CardContent className="p-4 flex items-center justify-between">
                                <div><h4 className="font-bold">LinkedIn Jobs</h4><p className="text-sm text-gray-500">Global professional network</p></div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </CardContent>
                            </Card>
                            <Card className="hover:bg-slate-50 transition-colors" onClick={() => window.open('https://nptel.ac.in', '_blank')}>
                              <CardContent className="p-4 flex items-center justify-between">
                                <div><h4 className="font-bold">NPTEL</h4><p className="text-sm text-gray-500">Free courses and certifications</p></div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Quick Stats */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Briefcase className="h-10 w-10 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold">{applications.length}</p>
                        <p className="text-gray-500">Applications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Award className="h-10 w-10 text-yellow-500" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold">{certificates.length}</p>
                        <p className="text-gray-500">Certificates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Star className="h-10 w-10 text-green-500" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold">{badges.length}</p>
                        <p className="text-gray-500">Achievements</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Recent Applications */}
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk' }}>Recent Applications</h2>
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application) => (
                    <Card key={application.id} className="card-hover">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                              {application.internship_details?.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{application.internship_details?.company}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Applied: {new Date(application.applied_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`status-${application.status}`} data-testid="application-status-badge">
                            {application.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {applications.length === 0 && (
                    <div className="text-center py-8" data-testid="no-applications-message">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No applications yet</p>
                      <Button className="mt-4" onClick={() => setActiveTab('opportunities')}>
                        Browse Opportunities
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </TabsContent>

          {/* Profile & Portfolio */}
          <TabsContent value="profile" data-testid="profile-content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Profile</CardTitle>
                  <CardDescription>Manage your personal information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={profile.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={profile.email || ''}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="+1 234 567 8900"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>University</Label>
                      <Input
                        placeholder="University Name"
                        value={profile.university || ''}
                        onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Major</Label>
                      <Input
                        placeholder="Computer Science"
                        value={profile.major || ''}
                        onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Graduation Year</Label>
                      <Input
                        type="number"
                        placeholder="2025"
                        value={profile.graduation_year || ''}
                        onChange={(e) => setProfile({ ...profile, graduation_year: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>CGPA</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="9.5"
                        value={profile.cgpa || ''}
                        onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>LinkedIn Profile</Label>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        value={profile.linkedin || ''}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resume & Cover Letter</CardTitle>
                  <CardDescription>Manage your documents and professional materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Resume URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="https://drive.google.com/file/..."
                          value={profile.resume_url || ''}
                          onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          disabled={!profile.resume_url}
                          onClick={() => window.open(profile.resume_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Cover Letter Template</Label>
                      <div className="flex space-x-2">
                        <select className="w-full p-2 border rounded">
                          <option>Professional</option>
                          <option>Creative</option>
                          <option>Academic</option>
                        </select>
                        <Button variant="outline">
                          <FileEdit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Cover Letter</Label>
                    <Textarea
                      placeholder="Write a brief introduction about yourself..."
                      value={profile.cover_letter || ''}
                      onChange={(e) => setProfile({ ...profile, cover_letter: e.target.value })}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    disabled={!profile.resume_url}
                    onClick={() => window.open(profile.resume_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Certificates</CardTitle>
                  <CardDescription>Showcase your skills and earned certificates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Skills</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        placeholder="Add a skill"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button onClick={addSkill}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.map((skill) => (
                        <Badge key={skill} className="skill-badge py-2 px-3 text-base">
                          {skill}
                          <X
                            className="h-4 w-4 ml-2 cursor-pointer"
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Certificates</h3>
                      <Button variant="outline" size="sm" onClick={() => setShowCertificateModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Certificate
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {certificates.map((certificate) => (
                        <Card key={certificate.id} className="card-hover">
                          <CardContent className="p-4">
                            <Award className="h-8 w-8 text-yellow-500 mb-2" />
                            <h4 className="font-semibold text-sm mb-1">
                              {certificate.certificate_data.internship_title}
                            </h4>
                            <p className="text-gray-600 text-xs mb-1">{certificate.certificate_data.company}</p>
                            <p className="text-xs text-gray-500">
                              Issued: {new Date(certificate.issued_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {certificates.length === 0 && (
                        <div className="col-span-full text-center py-4">
                          <p className="text-gray-500">No certificates yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Showcase</CardTitle>
                  <CardDescription>Highlight your projects and GitHub repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Projects</h3>
                      <Button onClick={() => setShowProjectModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                    
                    {projects.length === 0 ? (
                      <div className="text-center py-6 text-gray-500 border rounded-lg border-dashed">
                        <Github className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>No projects added yet.</p>
                      </div>
                    ) : (
                      projects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4 relative group">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteProject(project.id)}
                            title="Delete Project"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center mb-3 pr-8">
                            <Github className="h-5 w-5 mr-2 text-gray-700" />
                            <h4 className="font-semibold text-lg">{project.title}</h4>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {project.description}
                          </p>
                          {project.tech_stack && project.tech_stack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tech_stack.map((tech, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{tech}</Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-3">
                            {project.github_url && (
                              <Button variant="outline" size="sm" onClick={() => window.open(project.github_url, '_blank')} className="border-gray-300">
                                <Github className="h-4 w-4 mr-2" /> View Source
                              </Button>
                            )}
                            {project.live_url && (
                              <Button variant="default" size="sm" onClick={() => window.open(project.live_url, '_blank')} className="bg-gray-900 hover:bg-gray-800 text-white">
                                <Globe className="h-4 w-4 mr-2" /> Live Demo
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={updateProfile} disabled={profileLoading} className="w-full">
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </TabsContent>

          {/* Opportunities Section */}
          <TabsContent value="opportunities" data-testid="opportunities-content">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Internship Opportunities</h2>
                  <p className="text-gray-600">Find the perfect internship for your career goals</p>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredInternships.map((internship) => (
                      <InternshipCard
                        key={internship.id}
                        internship={internship}
                        onApply={applyToInternship}
                        hasApplied={applications.some(app => app.internship_id === internship.id)}
                      />
                    ))}
                  </div>

                  {filteredInternships.length === 0 && (
                    <div className="text-center py-12" data-testid="no-internships-message">
                      <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No internships found</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended for You</CardTitle>
                      <CardDescription>Based on your skills and interests</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {opportunities.map((opportunity) => (
                        <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold">{opportunity.title}</h3>
                          <p className="text-sm text-gray-600">{opportunity.company}</p>
                          <Badge variant="secondary">{opportunity.stipend}</Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => applyToInternship(opportunity.id)}
                            disabled={applications.some(app => app.internship_id === opportunity.id)}
                          >
                            {applications.some(app => app.internship_id === opportunity.id) ? 'Applied' : 'Apply'}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Company Profiles</CardTitle>
                      <CardDescription>Learn about top recruiters</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div>
                            <h4 className="font-semibold">Google</h4>
                            <p className="text-sm text-gray-600">Technology • Mountain View, CA</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-gray-300 fill-current" />
                              <span className="text-xs text-gray-500 ml-1">(4.2)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div>
                            <h4 className="font-semibold">Microsoft</h4>
                            <p className="text-sm text-gray-600">Technology • Redmond, WA</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Learning & Preparation */}
          <TabsContent value="learning" data-testid="learning-content">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Learning & Preparation</h2>
                <p className="text-gray-600">Enhance your skills with curated resources and challenges</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Curated Skill-Development Resources
                      </CardTitle>
                      <CardDescription>Access courses from top platforms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {learningResources.map((resource) => (
                          <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">{resource.title}</h3>
                                <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                              </div>
                              <Badge variant="secondary">{resource.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{resource.platform}</p>
                            <Button size="sm" variant="outline" className="w-full" onClick={() => window.open(resource.url, '_blank')}>
                              Enroll Now
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Skill Assessments
                      </CardTitle>
                      <CardDescription>Test your skills and earn extra points</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {quizzes.length > 0 ? quizzes.map((quiz) => (
                          <div key={quiz.id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">{quiz.title}</h3>
                                <p className="text-xs text-gray-500 capitalize">{quiz.category} • {quiz.difficulty}</p>
                              </div>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                {quiz.points} pts
                              </Badge>
                            </div>
                            <div className="flex justify-end items-center mt-2">
                              <Button size="sm" onClick={() => handleStartQuiz(quiz.id)}>
                                <Play className="h-4 w-4 mr-2" />
                                Take Quiz
                              </Button>
                            </div>
                          </div>
                        )) : (
                          <p className="text-sm text-gray-500 text-center py-4">No quizzes available at the moment.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="h-5 w-5 mr-2" />
                        Aptitude Practice
                      </CardTitle>
                      <CardDescription>Sharpen your logical reasoning and quantitative skills</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover:bg-blue-50 transition-colors" onClick={() => window.open('https://www.indiabix.com/logical-reasoning/questions-and-answers/', '_blank')}>
                          <Target className="h-6 w-6 mb-2" />
                          Logical Reasoning
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover:bg-green-50 transition-colors" onClick={() => window.open('https://www.indiabix.com/aptitude/questions-and-answers/', '_blank')}>
                          <BarChart3 className="h-6 w-6 mb-2" />
                          Quantitative Aptitude
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col items-center justify-center hover:bg-purple-50 transition-colors" onClick={() => window.open('https://www.indiabix.com/verbal-ability/questions-and-answers/', '_blank')}>
                          <BookOpen className="h-6 w-6 mb-2" />
                          Verbal Ability
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Soft-Skill Zone
                      </CardTitle>
                      <CardDescription>Develop essential professional skills</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://www.pramp.com', '_blank')}>
                        <Video className="h-4 w-4 mr-2" />
                        Mock Interview Simulator
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://www.youtube.com/results?search_query=communication+skills+training', '_blank')}>
                        <Video className="h-4 w-4 mr-2" />
                        Communication Skills
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://www.grammarly.com/blog/email-etiquette-tips/', '_blank')}>
                        <Video className="h-4 w-4 mr-2" />
                        Email Etiquette
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://www.youtube.com/results?search_query=body+language+tips+professional', '_blank')}>
                        <Video className="h-4 w-4 mr-2" />
                        Body Language Tips
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://resumegenius.com/resume-samples', '_blank')}>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Resume Writing Guide
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => window.open('https://www.linkedin.com/learning/', '_blank')}>
                        <FileEdit className="h-4 w-4 mr-2" />
                        LinkedIn Building
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progress Tracker</CardTitle>
                      <CardDescription>Your learning journey insights</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl">
                          <Trophy className="h-6 w-6 text-blue-600 mb-1" />
                          <span className="text-xl font-bold">{progressData.total_points}</span>
                          <span className="text-xs text-blue-600 font-medium">Total Points</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-green-50 rounded-xl">
                          <Target className="h-6 w-6 text-green-600 mb-1" />
                          <span className="text-xl font-bold">{progressData.quizzes_completed}</span>
                          <span className="text-sm font-medium">Quizzes Solved</span>
                        </div>
                      </div>
                      <div className="space-y-4 mt-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Courses Completed</span>
                            <span className="text-sm font-medium">{progressData.courses_completed || 0}/{progressData.total_courses || 8}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${((progressData.courses_completed || 0) / (progressData.total_courses || 8)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Challenges Solved</span>
                            <span className="text-sm font-medium">{progressData.challenges_solved || 0}/{progressData.total_challenges || 1}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${((progressData.challenges_solved || 0) / (progressData.total_challenges || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Aptitude Score</span>
                            <span className="text-sm font-medium">{progressData.aptitude_score || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${progressData.aptitude_score || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" data-testid="notifications-content">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
                  onClick={() => !notification.read && markNotificationRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Bell className={`h-5 w-5 mt-0.5 ${notification.read ? 'text-gray-400' : 'text-blue-600'}`} />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full" data-testid="unread-indicator"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-12" data-testid="no-notifications-message">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <OnboardingWizard 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
        user={user}
        onComplete={fetchAllData}
      />
      
      <AddProjectModal 
        isOpen={showProjectModal} 
        onClose={() => setShowProjectModal(false)}
        onSuccess={fetchAllData}
      />
      
      <AddCertificateModal 
        isOpen={showCertificateModal} 
        onClose={() => setShowCertificateModal(false)}
        onSuccess={fetchAllData}
      />
      
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
          step={quizStep}
          setStep={setQuizStep}
          currentIndex={currentQuestionIndex}
          onNext={handleNextQuestion}
          result={quizResult}
          isLoading={quizLoading}
        />
      )}
    </div>
  );
}