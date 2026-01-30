import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate, HashRouter } from 'react-router-dom';
import { 
  Activity, QrCode, Users, BookOpen, Trophy, X, 
  Calendar, Zap, LogOut, CheckCircle, MessageSquare, Plus, Search,
  ChevronRight, Star, Award, Settings, UserPlus, Edit3, Trash2, RefreshCw, Shield,
  AlertTriangle, Clock, Megaphone, User as UserIcon, Play, Pause, RotateCcw,
  Book, StickyNote, HeartPulse, Filter, ClipboardList, MapPin,
  CircleDollarSign, CreditCard, Wallet, Ban, ChevronLeft, MoreHorizontal, Check
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis 
} from 'recharts';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { BeltRank, User, UserRole, ActivityLog, ActivityType, ClassSession, Announcement, Booking, MembershipStatus, PaymentPlan } from './types';
import { BELT_COLORS, MOCK_USERS, XP_PER_CLASS, CLASSES_PER_STRIPE, INITIAL_ACHIEVEMENTS, MOCK_SCHEDULE, INITIAL_ANNOUNCEMENTS, CURRENT_CURRICULUM } from './constants';
import BeltVisual from './components/BeltVisual';
import { askSensei } from './services/geminiService';

// --- IOS DESIGN SYSTEM COMPONENTS ---

// 1. IOS Button
interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}
const IOSButton: React.FC<IOSButtonProps> = ({ 
  children, variant = 'primary', size = 'md', fullWidth = false, className = '', disabled, ...props 
}) => {
  const baseStyle = "font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 rounded-xl";
  
  const variants = {
    primary: "bg-ios-blue text-white shadow-sm hover:brightness-110",
    secondary: "bg-ios-surface2 text-ios-blue hover:bg-ios-separator",
    tertiary: "bg-transparent text-ios-blue hover:opacity-70",
    destructive: "bg-ios-surface2 text-ios-red hover:bg-ios-separator",
    ghost: "bg-transparent text-ios-label2 hover:text-ios-label",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-11 px-6 text-[17px]",
    lg: "h-[50px] px-8 text-[17px]",
  };

  const width = fullWidth ? 'w-full' : '';
  const opacity = disabled ? 'opacity-40 pointer-events-none' : '';

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${width} ${opacity} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// 2. IOS Card & List Group
const IOSCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <motion.div 
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={`bg-ios-surface rounded-[12px] overflow-hidden ${onClick ? 'cursor-pointer active:brightness-90 transition-all' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

const IOSListGroup: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <div className="mb-8">
    {title && <h3 className="text-[13px] text-ios-label2 uppercase ml-4 mb-2 font-medium tracking-wide">{title}</h3>}
    <div className="bg-ios-surface rounded-[12px] overflow-hidden divide-y divide-ios-separator/50">
      {children}
    </div>
  </div>
);

const IOSListCell: React.FC<{ 
  icon?: React.ReactNode; 
  title: string; 
  subtitle?: string | React.ReactNode; 
  value?: string | React.ReactNode; 
  onClick?: () => void;
  destructive?: boolean;
  accessory?: 'chevron' | 'none' | React.ReactNode;
}> = ({ icon, title, subtitle, value, onClick, destructive, accessory = 'chevron' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center p-4 min-h-[44px] ${onClick ? 'cursor-pointer active:bg-ios-separator/30 transition-colors' : ''}`}
  >
    {icon && <div className="mr-4 text-ios-blue">{icon}</div>}
    <div className="flex-1 min-w-0">
      <div className={`text-[17px] ${destructive ? 'text-ios-red' : 'text-ios-label'} truncate`}>{title}</div>
      {subtitle && <div className="text-[15px] text-ios-label2 mt-0.5 truncate">{subtitle}</div>}
    </div>
    <div className="flex items-center gap-2 pl-4">
      {value && <div className="text-[17px] text-ios-label2">{value}</div>}
      {accessory === 'chevron' && <ChevronRight size={18} className="text-ios-label3" />}
      {accessory !== 'none' && accessory !== 'chevron' && accessory}
    </div>
  </div>
);

// 3. IOS Page Structure with Collapsible Large Title
const IOSPage: React.FC<{ 
  title: string; 
  rightAction?: React.ReactNode; 
  children: React.ReactNode; 
  backAction?: () => void;
}> = ({ title, rightAction, children, backAction }) => {
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 40], [0, 1]);
  const titleScale = useTransform(scrollY, [0, 40], [1, 0.9]);
  const titleOpacity = useTransform(scrollY, [0, 20], [1, 0]);

  return (
    <div className="bg-ios-bg min-h-screen pb-24 relative">
      {/* Sticky Header (Blur) */}
      <motion.header 
        className="fixed top-0 left-0 right-0 h-[44px] z-40 flex items-center justify-between px-4"
        style={{ backgroundColor: 'rgba(28, 28, 30, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center w-1/3">
          {backAction && (
            <button onClick={backAction} className="flex items-center text-ios-blue text-[17px]">
              <ChevronLeft size={24} className="-ml-2" /> Back
            </button>
          )}
        </div>
        <motion.div style={{ opacity: headerOpacity }} className="font-semibold text-[17px] w-1/3 text-center truncate">
          {title}
        </motion.div>
        <div className="flex justify-end w-1/3">
          {rightAction}
        </div>
      </motion.header>

      {/* Large Title Area */}
      <div className="pt-[52px] px-4 pb-2">
        <motion.h1 
          style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left center' }}
          className="text-[34px] font-bold leading-tight tracking-tight text-white"
        >
          {title}
        </motion.h1>
      </div>

      {/* Content */}
      <main className="px-4 pt-2">
        {children}
      </main>
    </div>
  );
};

// 4. IOS Bottom Sheet (Spring Animation)
const IOSSheet: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }> = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-ios-surface2 rounded-t-[38px] z-[101] overflow-hidden max-h-[92vh] flex flex-col shadow-ios-modal"
          >
            {/* Drag Handle */}
            <div className="h-6 flex items-center justify-center pt-2 flex-shrink-0" onClick={onClose}>
              <div className="w-9 h-1 bg-ios-label3 rounded-full" />
            </div>
            {/* Header */}
            <div className="px-6 pb-4 flex justify-between items-center flex-shrink-0">
              {title && <h2 className="text-[20px] font-bold">{title}</h2>}
              <button onClick={onClose} className="w-8 h-8 bg-ios-label4 rounded-full flex items-center justify-center text-ios-label2">
                <X size={16} />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-12 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 5. IOS Segmented Control
const IOSSegmentedControl: React.FC<{ options: {id: string, label: string}[], value: string, onChange: (val: string) => void }> = ({ options, value, onChange }) => (
  <div className="bg-ios-surface2 p-0.5 rounded-[9px] flex h-8 relative">
    {options.map((opt) => {
      const isSelected = value === opt.id;
      return (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`flex-1 text-[13px] font-medium rounded-[7px] relative z-10 transition-all ${isSelected ? 'text-white' : 'text-ios-label'}`}
        >
          {opt.label}
        </button>
      );
    })}
    <motion.div 
      className="absolute top-0.5 bottom-0.5 bg-ios-separator rounded-[7px] shadow-sm z-0"
      layoutId="segmentIndicator"
      initial={false}
      animate={{ 
        left: `${(options.findIndex(o => o.id === value) / options.length) * 100}%`,
        width: `${100 / options.length}%` 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  </div>
);

// --- REFACTORED FEATURES ---

// WIZARD: Generic Component
const Wizard: React.FC<{ 
  steps: { id: string; title: string; component: React.ReactNode; isValid: boolean }[];
  onComplete: () => void;
  onCancel: () => void;
}> = ({ steps, onComplete, onCancel }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = steps[currentStepIdx];
  const isLastStep = currentStepIdx === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) onComplete();
    else setCurrentStepIdx(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStepIdx === 0) onCancel();
    else setCurrentStepIdx(prev => prev - 1);
  };

  return (
    <div className="flex flex-col h-[90vh] bg-ios-bg rounded-t-[38px] overflow-hidden">
      {/* Header */}
      <div className="h-[44px] flex items-center justify-between px-4 border-b border-ios-separator">
        <button onClick={onCancel} className="text-ios-blue text-[17px]">Cancel</button>
        <span className="font-semibold text-[17px]">Step {currentStepIdx + 1} of {steps.length}</span>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-ios-surface2">
        <motion.div 
          className="h-full bg-ios-blue" 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-[28px] font-bold text-center mb-2">{currentStep.title}</h2>
            {currentStep.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-6 pb-12 bg-ios-surface border-t border-ios-separator">
        <div className="flex gap-4">
          {currentStepIdx > 0 && (
             <IOSButton variant="secondary" onClick={handleBack} className="flex-1">Back</IOSButton>
          )}
          <IOSButton 
            fullWidth={currentStepIdx === 0} 
            className="flex-1" 
            disabled={!currentStep.isValid} 
            onClick={handleNext}
          >
            {isLastStep ? 'Complete' : 'Next'}
          </IOSButton>
        </div>
      </div>
    </div>
  );
};

// FEATURE: Add Student Wizard Flow
const AddStudentWizard: React.FC<{ onClose: () => void; onAdd: (data: any) => void }> = ({ onClose, onAdd }) => {
  const [data, setData] = useState({ name: '', belt: BeltRank.WHITE, plan: 'UNLIMITED' as PaymentPlan });

  const steps = [
    {
      id: 'identity',
      title: "Who is joining?",
      isValid: data.name.length > 2,
      component: (
        <div className="space-y-4">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-ios-surface2 rounded-full flex items-center justify-center text-ios-label2">
              <UserIcon size={48} />
            </div>
          </div>
          <div className="bg-ios-surface2 rounded-[10px] px-4 py-2">
            <label className="text-[13px] text-ios-label2 block mb-1">Full Name</label>
            <input 
              type="text" 
              value={data.name}
              onChange={(e) => setData({...data, name: e.target.value})}
              className="w-full bg-transparent text-[22px] text-white outline-none placeholder:text-ios-label4"
              placeholder="e.g. Jane Doe"
              autoFocus
            />
          </div>
          <p className="text-[13px] text-ios-label2 text-center">We'll generate a unique ID for them.</p>
        </div>
      )
    },
    {
      id: 'rank',
      title: "Current Experience",
      isValid: true,
      component: (
        <div className="space-y-4">
          <p className="text-center text-ios-label2 mb-6">Select their current belt rank.</p>
          <div className="grid grid-cols-1 gap-3">
            {Object.values(BeltRank).map(rank => (
              <IOSCard 
                key={rank} 
                onClick={() => setData({...data, belt: rank})}
                className={`p-4 border-2 transition-all ${data.belt === rank ? 'border-ios-blue bg-ios-blue/10' : 'border-transparent'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[17px] capitalize">{rank} Belt</span>
                  {data.belt === rank && <CheckCircle className="text-ios-blue" size={20} />}
                </div>
                <div className={`h-2 mt-3 rounded-full w-full ${BELT_COLORS[rank].main}`} />
              </IOSCard>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'plan',
      title: "Membership Plan",
      isValid: true,
      component: (
        <div className="space-y-4">
           <IOSListGroup>
             {(['UNLIMITED', '2X_WEEK', 'DROP_IN', 'FAMILY'] as const).map(plan => (
               <IOSListCell 
                 key={plan}
                 title={plan.replace('_', ' ')}
                 accessory={data.plan === plan ? <Check className="text-ios-blue" /> : 'none'}
                 onClick={() => setData({...data, plan})}
               />
             ))}
           </IOSListGroup>
           <div className="bg-ios-surface2 p-4 rounded-[12px] flex items-start gap-3">
             <Shield className="text-ios-green flex-shrink-0" size={20} />
             <p className="text-[13px] text-ios-label2">Billing will start today. You can pause or freeze this membership at any time from the admin panel.</p>
           </div>
        </div>
      )
    }
  ];

  return <Wizard steps={steps} onCancel={onClose} onComplete={() => onAdd(data)} />;
};

// FEATURE: Round Timer (Apple Fitness Style)
const AppleRoundTimer: React.FC = () => {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<'WORK' | 'REST'>('WORK');
  const [timeLeft, setTimeLeft] = useState(300);
  const totalTime = mode === 'WORK' ? 300 : 60;
  
  // Simulated Tick
  useEffect(() => {
    let interval: any = null;
    if (active && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      // Phase Change
      if (mode === 'WORK') { setMode('REST'); setTimeLeft(60); }
      else { setMode('WORK'); setTimeLeft(300); }
    }
    return () => clearInterval(interval);
  }, [active, timeLeft, mode]);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <IOSCard className="p-6 relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-ios-label text-opacity-60 uppercase tracking-wide">Round Timer</h3>
          <p className={`text-[13px] font-medium mt-1 ${mode === 'WORK' ? 'text-ios-red' : 'text-ios-green'}`}>
             {mode === 'WORK' ? '🔥 FIGHT TIME' : '🌿 RECOVER'}
          </p>
        </div>
        <div className="bg-ios-surface2 px-2 py-1 rounded text-[13px] font-mono">{active ? 'LIVE' : 'PAUSED'}</div>
      </div>

      <div className="flex items-center justify-between">
        {/* Apple Ring Simulation */}
        <div className="relative w-32 h-32 flex items-center justify-center">
           <svg className="w-full h-full transform -rotate-90">
             <circle cx="64" cy="64" r="58" stroke="#2C2C2E" strokeWidth="8" fill="none" />
             <motion.circle 
               cx="64" cy="64" r="58" stroke={mode === 'WORK' ? '#FF453A' : '#30D158'} strokeWidth="8" fill="none"
               strokeDasharray="364"
               strokeDashoffset={364 - (364 * progress) / 100}
               strokeLinecap="round"
               animate={{ strokeDashoffset: 364 - (364 * progress) / 100 }}
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-[34px] font-bold font-mono tracking-tighter tabular-nums">{timeString}</span>
           </div>
        </div>

        <div className="flex flex-col gap-3 w-1/2">
           <IOSButton onClick={() => setActive(!active)} variant={active ? 'secondary' : 'primary'}>
             {active ? 'Pause' : 'Start'}
           </IOSButton>
           <IOSButton onClick={() => { setActive(false); setTimeLeft(300); setMode('WORK'); }} variant="ghost" size="sm">
             Reset
           </IOSButton>
        </div>
      </div>
    </IOSCard>
  );
};

// PAGE: Student Dashboard
const StudentDashboard: React.FC<{ user: User; history: ActivityLog[] }> = ({ user, history }) => {
  const [showHistory, setShowHistory] = useState(false); // Progressive Disclosure
  
  const nextStripeClasses = CLASSES_PER_STRIPE[user.belt];
  const progressInStripe = user.classesAttended % nextStripeClasses;
  const pct = (progressInStripe / nextStripeClasses) * 100;

  return (
    <IOSPage title="My Progress" rightAction={<div className="w-8 h-8 rounded-full overflow-hidden border border-ios-separator"><img src={user.profileImage} /></div>}>
      
      <div className="space-y-8 pb-8">
        {/* Hero Card */}
        <section>
          <div className="mb-4 flex items-center justify-between">
             <h2 className="text-[20px] font-bold">Current Rank</h2>
             {user.injuryStatus && <span className="text-ios-orange text-[13px] font-bold flex items-center gap-1"><AlertTriangle size={12}/> {user.injuryStatus}</span>}
          </div>
          <BeltVisual rank={user.belt} stripes={user.stripes} size="lg" className="shadow-ios-card" />
          
          <div className="mt-4 px-2">
            <div className="flex justify-between text-[13px] font-medium text-ios-label2 mb-2">
              <span>Progress to Stripe {user.stripes + 1}</span>
              <span>{Math.floor(pct)}%</span>
            </div>
            <div className="h-2 bg-ios-surface2 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} animate={{ width: `${pct}%` }} 
                 className={`h-full ${BELT_COLORS[user.belt].main}`}
               />
            </div>
            <p className="text-[12px] text-ios-label2 mt-2 text-center">
              {nextStripeClasses - progressInStripe} more classes needed
            </p>
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 gap-4">
           <IOSCard className="p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                 <span className="text-[12px] font-bold text-ios-blue uppercase">Total Classes</span>
                 <Activity size={16} className="text-ios-blue opacity-50"/>
              </div>
              <span className="text-[34px] font-bold leading-none">{user.classesAttended}</span>
           </IOSCard>
           <IOSCard className="p-4 flex flex-col justify-between h-[100px]">
              <div className="flex justify-between items-start">
                 <span className="text-[12px] font-bold text-ios-orange uppercase">Streak</span>
                 <Zap size={16} className="text-ios-orange opacity-50"/>
              </div>
              <span className="text-[34px] font-bold leading-none">{user.streak}</span>
           </IOSCard>
        </section>

        {/* Curriculum (Technique of Week) */}
        <IOSCard className="p-0 bg-gradient-to-br from-indigo-900/50 to-ios-surface">
           <div className="p-5">
              <div className="flex items-center gap-2 mb-2 text-indigo-400">
                 <BookOpen size={18} />
                 <span className="text-[13px] font-bold uppercase">This Week</span>
              </div>
              <h3 className="text-[22px] font-bold mb-3">{CURRENT_CURRICULUM.topic}</h3>
              <div className="flex flex-wrap gap-2">
                {CURRENT_CURRICULUM.techniques.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-[13px] font-medium">
                    {tech}
                  </span>
                ))}
              </div>
           </div>
        </IOSCard>

        {/* Apple Timer */}
        <AppleRoundTimer />

        {/* History (Progressive Disclosure) */}
        <section>
           <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-[20px] font-bold">History</h3>
              <button onClick={() => setShowHistory(!showHistory)} className="text-ios-blue text-[15px]">
                {showHistory ? 'Show Less' : 'See All'}
              </button>
           </div>
           <IOSListGroup>
             {history.filter(h => h.userId === user.id).slice(0, showHistory ? 10 : 3).map(log => (
               <IOSListCell 
                 key={log.id}
                 title={log.title}
                 subtitle={log.description}
                 value={new Date(log.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                 accessory="none"
                 icon={
                   log.type === 'ATTENDANCE' ? <CheckCircle size={20} className="text-ios-green" /> :
                   log.type === 'STRIPE' ? <Award size={20} className="text-ios-purple" /> :
                   <StickyNote size={20} className="text-ios-gray" />
                 }
               />
             ))}
           </IOSListGroup>
        </section>

        {/* Financial Info (Collapsed by default, expand on tap) */}
        <section>
          <IOSListGroup title="Membership">
             <IOSListCell 
               title="Plan Status" 
               value={<span className={user.membershipStatus === 'OVERDUE' ? 'text-ios-red' : 'text-ios-green'}>{user.membershipStatus}</span>} 
               accessory="none"
             />
             <IOSListCell 
               title="Next Billing" 
               value={user.nextBillingDate}
               accessory="none"
             />
          </IOSListGroup>
        </section>
      </div>
    </IOSPage>
  );
};

// PAGE: Instructor Panel
const InstructorPanel: React.FC<{ 
  users: User[]; 
  logs: ActivityLog[];
  onCheckIn: (id: string) => void;
  onUpdate: (id: string, data: any, msg: string) => void;
  onAddStudent: (data: any) => void;
}> = ({ users, logs, onCheckIn, onUpdate, onAddStudent }) => {
  const [tab, setTab] = useState('ROSTER');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showAddWizard, setShowAddWizard] = useState(false);
  
  const students = users.filter(u => u.role === UserRole.STUDENT);
  const dueForPromotion = students.filter(s => (s.classesAttended % CLASSES_PER_STRIPE[s.belt]) / CLASSES_PER_STRIPE[s.belt] > 0.9);

  return (
    <IOSPage 
      title="Instructor" 
      rightAction={<button onClick={() => setShowAddWizard(true)} className="text-ios-blue text-[17px] font-medium"><Plus size={24}/></button>}
    >
      <div className="mb-6">
        <IOSSegmentedControl 
          options={[
            { id: 'ROSTER', label: 'Roster' },
            { id: 'GRADING', label: `Grading ${dueForPromotion.length ? '•' : ''}` },
            { id: 'LIVE', label: 'Live' }
          ]} 
          value={tab} 
          onChange={setTab} 
        />
      </div>

      <AnimatePresence mode="wait">
        {tab === 'ROSTER' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <IOSListGroup>
               {students.map(s => (
                 <IOSListCell 
                   key={s.id}
                   title={s.name}
                   subtitle={`${s.belt} Belt • ${s.stripes} Stripes`}
                   icon={<img src={s.profileImage} className="w-8 h-8 rounded-full bg-ios-surface2" />}
                   onClick={() => setSelectedStudent(s)}
                   accessory={s.membershipStatus === 'OVERDUE' ? <span className="text-ios-red text-[12px] font-bold">DUE</span> : 'chevron'}
                 />
               ))}
             </IOSListGroup>
          </motion.div>
        )}

        {tab === 'GRADING' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             {dueForPromotion.length === 0 ? (
               <div className="text-center py-12 text-ios-label2">
                 <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                 <p>No promotions due yet.</p>
               </div>
             ) : (
               <IOSListGroup title="Ready for Promotion">
                 {dueForPromotion.map(s => (
                   <IOSListCell 
                     key={s.id}
                     title={s.name}
                     subtitle="Attendance Requirement Met"
                     value="+1 Stripe"
                     onClick={() => setSelectedStudent(s)}
                     accessory={<div className="w-2 h-2 bg-ios-red rounded-full" />}
                   />
                 ))}
               </IOSListGroup>
             )}
          </motion.div>
        )}

        {tab === 'LIVE' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IOSCard className="p-8 flex flex-col items-center justify-center text-center space-y-4 mb-6">
                 <div className="relative">
                   <QrCode size={160} />
                   <div className="absolute inset-0 border-4 border-ios-blue/50 rounded-xl animate-pulse" />
                 </div>
                 <p className="text-ios-label2 text-[15px]">Scan student badge</p>
              </IOSCard>
              <IOSListGroup title="Recent Check-Ins">
                 {logs.filter(l => l.type === 'ATTENDANCE').slice(0, 5).map(l => {
                    const u = users.find(user => user.id === l.userId);
                    return u ? (
                      <IOSListCell 
                         key={l.id}
                         title={u.name}
                         subtitle={new Date(l.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         accessory="none"
                      />
                    ) : null;
                 })}
              </IOSListGroup>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Student Detail Sheet */}
      <IOSSheet isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={selectedStudent?.name}>
        {selectedStudent && (
          <div className="space-y-8">
             {/* Profile Header */}
             <div className="flex items-center gap-4">
               <img src={selectedStudent.profileImage} className="w-20 h-20 rounded-full shadow-lg" />
               <div>
                  <div className="text-[13px] text-ios-label2 font-medium uppercase tracking-wide mb-1">Current Rank</div>
                  <BeltVisual rank={selectedStudent.belt} stripes={selectedStudent.stripes} size="sm" />
               </div>
             </div>

             {/* Quick Actions */}
             <div className="grid grid-cols-2 gap-3">
               <IOSButton onClick={() => { onCheckIn(selectedStudent.id); setSelectedStudent(null); }}>
                 Check In
               </IOSButton>
               <IOSButton variant="secondary" onClick={() => { onUpdate(selectedStudent.id, { stripes: selectedStudent.stripes + 1 }, 'Manual Stripe'); setSelectedStudent(null); }}>
                 Promote
               </IOSButton>
             </div>

             {/* Detailed Settings (Inset List) */}
             <IOSListGroup title="Management">
                <IOSListCell 
                  title="Membership" 
                  value={selectedStudent.membershipStatus} 
                  accessory={selectedStudent.membershipStatus === 'OVERDUE' ? <span className="text-ios-red">Pay</span> : 'none'}
                  onClick={() => onUpdate(selectedStudent.id, { membershipStatus: 'ACTIVE' }, 'Manual Payment')}
                />
                <IOSListCell 
                  title="Plan" 
                  value={selectedStudent.plan}
                />
                <IOSListCell 
                   title="Injury Status" 
                   value={selectedStudent.injuryStatus || 'Healthy'}
                   onClick={() => {
                     const status = prompt("Update injury (leave empty to clear):", selectedStudent.injuryStatus);
                     if (status !== null) onUpdate(selectedStudent.id, { injuryStatus: status }, 'Updated Injury');
                   }}
                />
                <IOSListCell 
                  title="Delete Student" 
                  destructive 
                  onClick={() => alert("Delete feature disabled for demo")}
                />
             </IOSListGroup>
          </div>
        )}
      </IOSSheet>

      {/* Add Student Wizard */}
      <IOSSheet isOpen={showAddWizard} onClose={() => setShowAddWizard(false)}>
        <AddStudentWizard onClose={() => setShowAddWizard(false)} onAdd={(d) => { onAddStudent(d); setShowAddWizard(false); }} />
      </IOSSheet>

    </IOSPage>
  );
};

// PAGE: Schedule & Booking
const SchedulePage: React.FC<{ user: User; onBook: (id: string) => void; bookings: string[] }> = ({ user, onBook, bookings }) => {
  return (
    <IOSPage title="Schedule">
      <div className="space-y-4">
        {MOCK_SCHEDULE.map(s => {
           const isBooked = bookings.includes(s.id);
           return (
             <IOSCard key={s.id} className="p-4" onClick={() => !isBooked && onBook(s.id)}>
                <div className="flex justify-between items-start mb-2">
                   <div className="text-[13px] font-bold text-ios-blue uppercase tracking-wide">{s.day} • {s.time}</div>
                   {isBooked && <CheckCircle size={16} className="text-ios-green" />}
                </div>
                <h3 className="text-[20px] font-semibold mb-1">{s.title}</h3>
                <p className="text-[15px] text-ios-label2 mb-4">{s.instructor}</p>
                <div className="flex items-center gap-3">
                   <div className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase border border-white/20 text-white/60`}>
                     {s.type}
                   </div>
                   <div className="text-[12px] text-ios-label2">
                     {s.bookedCount}/{s.capacity} Spots
                   </div>
                </div>
                {!isBooked && (
                  <IOSButton size="sm" variant="secondary" fullWidth className="mt-4">Book Class</IOSButton>
                )}
             </IOSCard>
           );
        })}
      </div>
    </IOSPage>
  );
};

// COMPONENT: Tab Bar (Glassmorphism)
const TabBar: React.FC<{ role: UserRole }> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = role === UserRole.STUDENT ? [
    { path: '/', icon: Activity, label: 'Progress' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/pass', icon: QrCode, label: 'Pass' },
    { path: '/knowledge', icon: MessageSquare, label: 'Sensei' }
  ] : [
    { path: '/', icon: Users, label: 'Manage' },
    { path: '/content', icon: BookOpen, label: 'Content' }
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-[83px] pb-[34px] bg-ios-surface/80 backdrop-blur-xl border-t border-ios-separator flex justify-around items-center z-50"
    >
      {tabs.map(t => {
        const active = location.pathname === t.path;
        return (
          <button 
            key={t.path} 
            onClick={() => navigate(t.path)} 
            className={`flex flex-col items-center gap-1 w-16 ${active ? 'text-ios-blue' : 'text-ios-gray'}`}
          >
            <t.icon size={24} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// PAGE: Login (Apple TV User Switcher Style)
const LoginPage: React.FC<{ users: User[], onSelect: (u: User) => void }> = ({ users, onSelect }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="w-16 h-16 bg-ios-blue rounded-[16px] mx-auto mb-6 flex items-center justify-center shadow-ios-glow">
          <Trophy size={32} className="text-white" />
        </div>
        <h1 className="text-[34px] font-bold mb-2">MatShark</h1>
        <p className="text-[17px] text-ios-label2">Select your profile</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-12 max-w-md">
        {users.map(u => (
          <motion.button 
            key={u.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(u)}
            className="flex flex-col items-center group"
          >
            <div className={`w-24 h-24 rounded-full mb-4 overflow-hidden border-4 transition-colors ${u.role === 'INSTRUCTOR' ? 'border-ios-purple' : 'border-transparent group-hover:border-ios-label2'}`}>
              <img src={u.profileImage} className="w-full h-full object-cover" />
            </div>
            <span className="text-[17px] font-medium text-ios-label group-hover:text-white">{u.name.split(' ')[0]}</span>
            <span className="text-[13px] text-ios-label2 uppercase">{u.role === 'INSTRUCTOR' ? 'Staff' : u.belt}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// --- APP ROOT ---
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [bookings, setBookings] = useState<string[]>([]);

  // Generic activity logger
  const log = (userId: string, type: ActivityType, title: string, desc: string) => {
    setLogs(prev => [{ id: Math.random().toString(), userId, type, title, description: desc, timestamp: new Date().toISOString() }, ...prev]);
  };

  return (
    <HashRouter>
      {!currentUser ? (
        <LoginPage users={users} onSelect={setCurrentUser} />
      ) : (
        <div className="bg-black min-h-screen text-white font-sans antialiased">
          <Routes>
              <Route path="/" element={
                currentUser.role === UserRole.STUDENT 
                ? <StudentDashboard user={currentUser} history={logs} />
                : <InstructorPanel 
                    users={users} logs={logs} 
                    onCheckIn={(id) => log(id, 'ATTENDANCE', 'Checked In', 'Manual Instructor Check-in')}
                    onUpdate={(id, data, msg) => {
                        setUsers(prev => prev.map(u => u.id === id ? {...u, ...data} : u));
                        log(id, 'PROMOTION', 'Profile Update', msg);
                    }}
                    onAddStudent={(d) => {
                      setUsers(prev => [...prev, { ...d, id: Math.random().toString(), role: UserRole.STUDENT, profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${d.name}`, classesAttended: 0, stripes: 0, streak: 0, xp: 0, joinDate: new Date().toISOString(), achievements: [] }]);
                    }}
                  />
              } />
              <Route path="/schedule" element={
                <SchedulePage 
                  user={currentUser} 
                  bookings={bookings}
                  onBook={(id) => { setBookings(p => [...p, id]); log(currentUser.id, 'BOOKING', 'Class Booked', 'Reserved a spot'); }} 
                />
              } />
              <Route path="/pass" element={
                <IOSPage title="My Pass">
                  <div className="flex flex-col items-center justify-center h-[60vh]">
                    <IOSCard className="p-8 bg-white">
                      <QRCode value={currentUser.id} size={200} />
                    </IOSCard>
                    <p className="mt-8 text-ios-label2 text-center max-w-xs">Show this QR code to the instructor at the front desk to check in.</p>
                  </div>
                </IOSPage>
              } />
              <Route path="/knowledge" element={
                <IOSPage title="Sensei AI">
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
                    <MessageSquare size={48} className="text-ios-blue mb-4" />
                    <h2 className="text-[22px] font-bold mb-2">Ask Sensei</h2>
                    <p className="text-ios-label2 mb-8">AI knowledge base coming soon in the next update.</p>
                    <IOSButton onClick={() => alert("Feature preview only.")}>Start Chat</IOSButton>
                  </div>
                </IOSPage>
              } />
              <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <TabBar role={currentUser.role} />
        </div>
      )}
    </HashRouter>
  );
};

export default App;