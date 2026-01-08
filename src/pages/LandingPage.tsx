import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Bot,
  UserCheck,
  Clock,
  BarChart3,
  CheckCircle,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Target,
  Zap,
  Shield,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Job Posting Automation',
      description: 'Create and distribute job postings across multiple platforms with AI-powered optimization.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Candidate Management',
      description: 'Streamline candidate tracking with intelligent filtering and automated screening.',
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI Interview Management',
      description: 'Conduct AI-powered interviews with real-time analysis and intelligent scoring.',
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: 'Employee Management',
      description: 'Manage your entire workforce from onboarding to performance tracking in one place.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Attendance & Payroll',
      description: 'Automate attendance tracking and payroll processing with accuracy and compliance.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Workforce Analytics',
      description: 'Gain insights with powerful analytics and data-driven hiring decisions.',
    },
  ];

  const steps = [
    { icon: <Briefcase />, title: 'Create Job', description: 'Post job openings with AI assistance' },
    { icon: <Users />, title: 'AI Screens Candidates', description: 'Automated candidate evaluation' },
    { icon: <Bot />, title: 'AI Interviews', description: 'Intelligent interview process' },
    { icon: <UserCheck />, title: 'Hire & Onboard', description: 'Seamless hiring and onboarding' },
    { icon: <BarChart3 />, title: 'Manage Workforce', description: 'Complete HR management' },
  ];

  const pricing = [
    {
      name: 'Starter',
      price: '$49',
      description: 'Perfect for small teams',
      features: [
        'Up to 10 job postings/month',
        '50 candidate profiles',
        'Basic AI screening',
        'Email support',
        '1 team member',
      ],
      popular: false,
    },
    {
      name: 'Growth',
      price: '$149',
      description: 'For growing companies',
      features: [
        'Unlimited job postings',
        '500 candidate profiles',
        'Advanced AI interviews',
        'Priority support',
        '5 team members',
        'Analytics dashboard',
        'Social media integration',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Growth',
        'Unlimited candidates',
        'Custom AI training',
        'Dedicated support',
        'Unlimited team members',
        'Advanced analytics',
        'API access',
        'Custom integrations',
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'HR Director',
      company: 'TechCorp Inc.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      quote: 'This platform reduced our hiring time by 60%. The AI interviews are incredibly accurate and save us countless hours.',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Talent Acquisition Manager',
      company: 'StartupHub',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      quote: 'The automation features are game-changing. We hired 3x more efficiently and found better candidates.',
    },
    {
      name: 'Emily Watson',
      role: 'CEO',
      company: 'InnovateLabs',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      quote: 'Best HR automation tool we\'ve used. The analytics help us make data-driven hiring decisions.',
    },
  ];

  const faqs = [
    {
      question: 'How does AI screening work?',
      answer: 'Our AI analyzes resumes, cover letters, and candidate profiles against job requirements, providing detailed screening reports and compatibility scores.',
    },
    {
      question: 'Can I customize the interview questions?',
      answer: 'Yes! You can customize interview questions, set scoring criteria, and configure the AI to match your company\'s hiring process.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption, comply with GDPR and SOC 2 standards, and never share your data with third parties.',
    },
    {
      question: 'How long does setup take?',
      answer: 'You can be up and running in minutes. Simply sign up, add your company details, and start posting jobs right away.',
    },
    {
      question: 'Do you offer training?',
      answer: 'Yes! All plans include onboarding support, and Enterprise customers get dedicated training sessions.',
    },
    {
      question: 'Can I integrate with my existing tools?',
      answer: 'Yes, we offer integrations with popular HR tools, ATS systems, and can provide custom API access for Enterprise customers.',
    },
    {
      question: 'What if I need to scale my team?',
      answer: 'You can easily upgrade your plan at any time. Growth and Enterprise plans support multiple team members.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Sign up for a 14-day free trial with no credit card required. Experience all features before committing.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HireAI</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')}>Start Free</Button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#faq" className="block text-gray-600 hover:text-gray-900">FAQ</a>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>Login</Button>
              <Button className="w-full" onClick={() => navigate('/register')}>Start Free</Button>
            </div>
          </div>
        )}
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered HR Automation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Hiring &<br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Workforce Automation
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Automate hiring, interviews, onboarding, attendance, payroll, and performance — powered by intelligent AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Book Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">14-day free trial • No credit card required</p>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <img
              src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Dashboard Preview"
              className="rounded-2xl shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to automate your HR processes and hire the best talent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, automated, effective</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute transform translate-x-24 mt-8">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-sm border-2 p-8 ${
                  plan.popular ? 'border-blue-600 relative' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                </div>
                <Button
                  className="w-full mb-6"
                  variant={plan.popular ? 'primary' : 'outline'}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">See what our customers are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaqIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Automating Your HR Today</h2>
          <p className="text-xl mb-10 text-blue-100">
            Join thousands of companies using AI to revolutionize their hiring process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => navigate('/register')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">HireAI</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered HR automation platform for modern companies
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 HireAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
