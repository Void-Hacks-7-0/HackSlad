import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Heart, Activity, TrendingUp, Users } from 'lucide-react';
import { isAuthenticated } from '@/utils/authMock';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const accuracyData = [
  { month: 'Jan', accuracy: 92 },
  { month: 'Feb', accuracy: 94 },
  { month: 'Mar', accuracy: 95 },
  { month: 'Apr', accuracy: 96 },
  { month: 'May', accuracy: 97 },
  { month: 'Jun', accuracy: 98 },
];

const progressData = [
  { month: 'Jan', patients: 280 },
  { month: 'Feb', patients: 295 },
  { month: 'Mar', patients: 305 },
  { month: 'Apr', patients: 315 },
  { month: 'May', patients: 325 },
  { month: 'Jun', patients: 334 },
];

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-hero">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Alzheimer's Support</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary text-sm py-2"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm mb-6">
            <Heart className="w-4 h-4" />
            <span>Compassionate Care Technology</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-foreground leading-tight mb-6">
            Supporting Every Step of the{' '}
            <span className="text-primary">Alzheimer's Journey</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            A compassionate platform designed to help patients, caregivers, and clinicians 
            monitor cognitive health, stay connected, and coordinate care with confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              Create Your Account
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="w-full sm:w-auto btn-secondary text-lg px-8 py-4"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Platform Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Total Patients', value: '334', icon: Users, color: 'text-primary' },
              { label: 'Diagnosed Patients', value: '146', icon: Heart, color: 'text-primary' },
              { label: 'Ongoing Treatment', value: '93', icon: Activity, color: 'text-primary' },
              { label: 'Prediction Accuracy', value: '98%', icon: TrendingUp, color: 'text-primary' },
            ].map((stat, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Accuracy Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6">Prediction Accuracy Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[90, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-6">Patient Growth Tracking</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Comprehensive Care Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced tools designed to support patients, caregivers, and healthcare professionals throughout the Alzheimer's journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Health Analysis",
                description: "Machine learning algorithms analyze symptoms and cognitive patterns to predict potential health risks before they become serious.",
              },
              {
                icon: Activity,
                title: "Real-time Monitoring",
                description: "Connect wearable devices for continuous health tracking and instant insights into wellness metrics and cognitive function.",
              },
              {
                icon: Heart,
                title: "Caregiver Support",
                description: "Access resources, connect with support groups, and receive guidance on providing compassionate, informed care.",
              },
              {
                icon: TrendingUp,
                title: "Health Insights",
                description: "Get personalized lifestyle recommendations based on health data, cognitive patterns, and wellness goals.",
              },
              {
                icon: Users,
                title: "Care Coordination",
                description: "Seamlessly coordinate between family members, caregivers, and healthcare providers for optimal care delivery.",
              },
              {
                icon: ArrowRight,
                title: "Early Warning System",
                description: "Receive intelligent alerts about potential health concerns, allowing you to take preventive action immediately.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded gradient-hero">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              © 2024 Alzheimer's Support. Not a medical device.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
