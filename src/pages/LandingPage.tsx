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
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingEmail: '',
  });
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  const resetPaymentState = () => {
    setPaymentForm({
      nameOnCard: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      billingEmail: '',
    });
    setPaymentErrors({});
    setPaymentMessage(null);
    setIsProcessingPayment(false);
  };

  const openPaymentModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    resetPaymentState();
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
  };

  const handlePaymentInputChange = (field: string, value: string) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
    if (paymentErrors[field]) {
      setPaymentErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};
    const cardNumberDigits = paymentForm.cardNumber.replace(/\s+/g, '');
    if (!paymentForm.nameOnCard.trim()) errors.nameOnCard = 'Name on card is required.';
    if (!/^[\d]{13,19}$/.test(cardNumberDigits)) errors.cardNumber = 'Enter a valid card number.';
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentForm.expiryDate)) errors.expiryDate = 'Use MM/YY format.';
    if (!/^\d{3,4}$/.test(paymentForm.cvv)) errors.cvv = 'CVV must be 3 or 4 digits.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentForm.billingEmail)) errors.billingEmail = 'Enter a valid email address.';
    return errors;
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validatePaymentForm();
    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      return;
    }
    setIsProcessingPayment(true);
    setPaymentMessage(null);

    try {
      // Placeholder for Stripe integration.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentMessage('Payment successful! Redirecting you to create your account...');
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        navigate('/register');
      }, 1800);
    } catch (error) {
      setPaymentMessage('Payment failed. Please try again or use a different card.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

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

  type PricingPlan = {
    name: string;
    price: string;
    priceSuffix?: string;
    description: string;
    features: string[];
    popular: boolean;
    cta: string;
    paymentIntegration?: string;
    isPaid: boolean;
  };

  const pricing: PricingPlan[] = [
    {
      name: 'Starter',
      price: 'Free',
      priceSuffix: '',
      description: 'Launch your HR automation with zero cost',
      features: [
        'Up to 10 job postings/month',
        '50 candidate profiles',
        'Basic AI screening',
        'Email support',
        '1 team member',
      ],
      popular: false,
      cta: 'Create Free Account',
      isPaid: false,
    },
    {
      name: 'Growth',
      price: 'Rs 49,999',
      priceSuffix: '/month',
      description: 'For scaling teams that need AI orchestration',
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
      cta: 'Get Started',
      paymentIntegration: 'Stripe-secured billing (Visa, Mastercard, Amex)',
      isPaid: true,
    },
    {
      name: 'Enterprise',
      price: 'Rs 99,999',
      priceSuffix: '/month',
      description: 'Custom automation with dedicated success',
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
      cta: 'Get Started',
      paymentIntegration: 'Stripe-secured billing (Visa, Mastercard, Amex)',
      isPaid: true,
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

  const heroHighlights = [
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Precision Matching',
      description: 'AI scores every applicant against your role with crystal-clear fit data.',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Instant Automations',
      description: 'Interviews, nudges, and next steps trigger themselves—no manual chase.',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Enterprise Security',
      description: 'SOC 2 controls, encrypted flows, and full audit trails on every action.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <div className="md:w-48 flex-shrink-0">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">HireAI</span>
              </button>
            </div>

            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
              </div>
            </div>

            <div className="hidden md:flex md:w-48 items-center justify-end gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" onClick={() => navigate('/register')}>Start Free Trial</Button>
            </div>

            <button
              className="md:hidden ml-auto"
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
              <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#faq" className="block text-gray-600 hover:text-gray-900">FAQ</a>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" className="w-full" onClick={() => navigate('/register')}>Start Free Trial</Button>
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
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              Join thousands of companies using AI to revolutionize their hiring process.
            </p>
            <p className="text-base text-gray-500 mb-6">
              Start Automating Your HR Today
            </p>
            <div className="flex justify-center">
              <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-10">
                Start Free Trial
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">14-day free trial • No credit card required</p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[3fr_2fr]">
            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/40 to-cyan-400/40 blur-3xl" />
              <div className="absolute -left-16 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-br from-blue-300/30 to-cyan-300/40 blur-3xl" />
              <div className="relative p-10 space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
                  Live AI Workflow
                </div>
                <h3 className="text-3xl font-semibold leading-snug text-gray-900">
                  Automations run sourcing, interviews, approvals, and onboarding so you stay people-first.
                </h3>
                <div className="grid gap-5 md:grid-cols-2">
                  {heroHighlights.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-sm"
                    >
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow">
                        {item.icon}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Operational Impact</p>
              <div className="mt-6 space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <p className="text-5xl font-bold text-gray-900">3x</p>
                  <p className="mt-2 text-sm text-gray-600">faster hiring cycles with HireAI orchestrating every workflow.</p>
                </div>
                <div className="border-b border-gray-100 pb-6">
                  <p className="text-4xl font-bold text-gray-900">92%</p>
                  <p className="mt-2 text-sm text-gray-600">of candidates call the AI interview smooth and helpful.</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-900">24/7</p>
                  <p className="mt-2 text-sm text-gray-600">coverage for scheduling, reminders, and global follow-ups.</p>
                </div>
              </div>
            </div>
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

      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
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
                  {plan.priceSuffix && <span className="text-gray-600">{plan.priceSuffix}</span>}
                </div>
                <Button
                  className="w-full mb-4"
                  variant="primary"
                  onClick={() => {
                    if (plan.isPaid) {
                      openPaymentModal(plan);
                    } else {
                      navigate('/register');
                    }
                  }}
                >
                  {plan.cta}
                </Button>
                {plan.paymentIntegration && (
                  <p className="mb-4 text-xs text-gray-500 italic">{plan.paymentIntegration}</p>
                )}
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
          <div className="flex justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Start Free Trial
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

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        title={selectedPlan ? `Complete Purchase - ${selectedPlan.name}` : 'Complete Purchase'}
        size="lg"
      >
        <form className="space-y-6" onSubmit={handlePaymentSubmit}>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
            Secure payment via Stripe • Credit & Debit Cards (Visa, Mastercard, Amex)
          </div>

          <Input
            label="Name on Card"
            placeholder="Sarah Ahmed"
            value={paymentForm.nameOnCard}
            onChange={(e) => handlePaymentInputChange('nameOnCard', e.target.value)}
            required
            error={paymentErrors.nameOnCard}
          />

          <Input
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            value={paymentForm.cardNumber}
            onChange={(e) => handlePaymentInputChange('cardNumber', e.target.value)}
            required
            error={paymentErrors.cardNumber}
            inputMode="numeric"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              value={paymentForm.expiryDate}
              onChange={(e) => handlePaymentInputChange('expiryDate', e.target.value)}
              required
              error={paymentErrors.expiryDate}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={paymentForm.cvv}
              onChange={(e) => handlePaymentInputChange('cvv', e.target.value)}
              required
              error={paymentErrors.cvv}
              inputMode="numeric"
            />
            <Input
              label="Billing Email"
              placeholder="you@company.com"
              type="email"
              value={paymentForm.billingEmail}
              onChange={(e) => handlePaymentInputChange('billingEmail', e.target.value)}
              required
              error={paymentErrors.billingEmail}
            />
          </div>

          {paymentMessage && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                paymentMessage.includes('successful')
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {paymentMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closePaymentModal} disabled={isProcessingPayment}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isProcessingPayment}>
              Pay & Continue
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
