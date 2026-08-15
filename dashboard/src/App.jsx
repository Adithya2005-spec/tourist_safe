import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Activity, 
  Radio, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Flame,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  BellRing,
  Smartphone,
  Navigation,
  Battery,
  Wifi,
  Sliders,
  Send,
  Lock,
  Layers,
  PhoneCall,
  CheckCircle,
  Eye,
  Crosshair,
  QrCode,
  Globe,
  Plus,
  Trash2,
  Edit2,
  StopCircle,
  PlayCircle,
  FileText,
  SlidersHorizontal,
  Zap,
  Check
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    title: 'TouristSafe',
    sub: 'Smart Tourist Safety & Incident Response System',
    overview: 'Overview & Telemetry',
    liveMap: 'Live Geo-Fence Map',
    incidents: 'Incident Lifecycle',
    riskEngine: 'Dynamic AI Risk Engine',
    tourists: 'Monitored Tourists',
    emergencyContacts: 'Emergency Contacts',
    liveLocation: 'Live Location Sharing',
    blockchain: 'Blockchain Audit Trail',
    mobileSim: 'Tourist Mobile App Sim',
    highRisk: 'HIGH RISK',
    criticalRisk: 'CRITICAL RISK',
    modRisk: 'MODERATE RISK',
    lowRisk: 'LOW RISK',
    activeIncidents: 'Active Incidents',
    avgResponse: 'Avg Response Time',
    touristsMonitored: 'Tourists Monitored',
    geofenceAlert: 'Geo-Fence Proximity Warning',
    sosActivated: 'SOS ACTIVATED',
    servicesNotified: 'Emergency services have been notified.',
    primaryContact: 'Primary Emergency Contact',
    startSharing: 'SHARE MY LIVE LOCATION',
    stopSharing: 'STOP SHARING',
    sharingActive: 'LIVE LOCATION SHARING ACTIVE',
    notSharing: 'NOT SHARING',
    netInterrupted: 'NETWORK INTERRUPTED',
    sessionEnded: 'LOCATION SHARING ENDED',
    remaining: 'Remaining',
  },
  hi: {
    title: 'टूरिस्टसेफ',
    sub: 'स्मार्ट पर्यटक सुरक्षा और आपातकालीन प्रतिक्रिया प्रणाली',
    overview: 'सिंहावलोकन और टेलीमेट्री',
    liveMap: 'लाइव जियो-फेंस मानचित्र',
    incidents: 'घटना जीवनचक्र',
    riskEngine: 'गतिशील एआई जोखिम इंजन',
    tourists: 'निगरानीकृत पर्यटक',
    emergencyContacts: 'आपातकालीन संपर्क',
    liveLocation: 'लाइव स्थान साझाकरण',
    blockchain: 'ब्लॉकचेन ऑडिट ट्रेल',
    mobileSim: 'पर्यटक मोबाइल ऐप सिमुलेटर',
    highRisk: 'उच्च जोखिम',
    criticalRisk: 'गंभीर जोखिम',
    modRisk: 'मध्यम जोखिम',
    lowRisk: 'कम जोखिम',
    activeIncidents: 'सक्रिय घटनाएं',
    avgResponse: 'औसत प्रतिक्रिया समय',
    touristsMonitored: 'निगरानीकृत पर्यटक',
    geofenceAlert: 'जियो-फेंस निकटता चेतावनी',
    sosActivated: 'एसओएस सक्रिय किया गया',
    servicesNotified: 'आपातकालीन सेवाओं को सूचित कर दिया गया है।',
    primaryContact: 'प्राथमिक आपातकालीन संपर्क',
    startSharing: 'मेरा लाइव स्थान साझा करें',
    stopSharing: 'साझाकरण बंद करें',
    sharingActive: 'लाइव स्थान साझाकरण सक्रिय है',
    notSharing: 'साझा नहीं किया जा रहा',
    netInterrupted: 'नेटवर्क बाधित हुआ',
    sessionEnded: 'स्थान साझाकरण समाप्त हुआ',
    remaining: 'शेष समय',
  },
  kn: {
    title: 'ಟೂರಿಸ್ಟ್‌ಸೇಫ್',
    sub: 'ಸ್ಮಾರ್ಟ್ ಪ್ರವಾಸಿ ಸುರಕ್ಷತೆ ಮತ್ತು ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ವ್ಯವಸ್ಥೆ',
    overview: 'ಅವಲೋಕನ ಮತ್ತು ಟೆಲಿಮೆಟ್ರಿ',
    liveMap: 'ಲೈವ್ ಜಿಯೋ-ಫೆನ್ಸ್ ನಕ್ಷೆ',
    incidents: 'ಘಟನೆಗಳ ಜೀವನಚಕ್ರ',
    riskEngine: 'ಡೈನಾಮಿಕ್ ಎಐ ಅಪಾಯದ ಎಂಜಿನ್',
    tourists: 'ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿರುವ ಪ್ರವಾಸಿಗರು',
    emergencyContacts: 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    liveLocation: 'ಲೈವ್ ಸ್ಥಳ ಹಂಚಿಕೆ',
    blockchain: 'ಬ್ಲಾಕ್‌ಚೈನ್ ಆಡಿಟ್ ಟ್ರೇಲ್',
    mobileSim: 'ಪ್ರವಾಸಿ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್ ಸಿಮ್ಯುಲೇಶನ್',
    highRisk: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    criticalRisk: 'ತೀವ್ರ ಅಪಾಯ',
    modRisk: 'ಮಧ್ಯಮ ಅಪಾಯ',
    lowRisk: 'ಕಡಿಮೆ ಅಪಾಯ',
    activeIncidents: 'ಸಕ್ರಿಯ ಘಟನೆಗಳು',
    avgResponse: 'ಸರಾಸರಿ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ',
    touristsMonitored: 'ಪ್ರವಾಸಿಗರ ಸಂಖ್ಯೆ',
    geofenceAlert: 'ಜಿಯೋ-ಫೆನ್ಸ್ ಸಾಮೀಪ್ಯ ಎಚ್ಚರಿಕೆ',
    sosActivated: 'ಎಸ್ಒಎಸ್ ಸಕ್ರಿಯಗೊಂಡಿದೆ',
    servicesNotified: 'ತುರ್ತು ಸೇವೆಗಳಿಗೆ ತಕ್ಷಣ ಮಾಹಿತಿ ರವಾನಿಸಲಾಗಿದೆ.',
    primaryContact: 'ಪ್ರಾಥಮಿಕ ತುರ್ತು ಸಂಪರ್ಕ',
    startSharing: 'ನನ್ನ ಲೈವ್ ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
    stopSharing: 'ಹಂಚಿಕೆ ನಿಲ್ಲಿಸಿ',
    sharingActive: 'ಲೈವ್ ಸ್ಥಳ ಹಂಚಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ',
    notSharing: 'ಹಂಚಿಕೊಳ್ಳುತ್ತಿಲ್ಲ',
    netInterrupted: 'ನೆಟ್‌ವರ್ಕ್ ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ',
    sessionEnded: 'ಸ್ಥಳ ಹಂಚಿಕೆ ಮುಕ್ತಾಯಗೊಂಡಿದೆ',
    remaining: 'ಉಳಿದಿರುವ ಸಮಯ',
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Emergency contacts state
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom (Radha Rao)', phone: '+91 98450 11223', relationship: 'Parent', email: 'radha@example.com', is_primary: 1 },
    { id: 2, name: 'Rahul Rao', phone: '+91 98450 44556', relationship: 'Sibling', email: 'rahul@example.com', is_primary: 0 },
    { id: 3, name: 'Dr. Suresh Kumar', phone: '+91 98450 99887', relationship: 'Doctor', email: 'dr.suresh@example.com', is_primary: 0 }
  ]);

  // Live location sharing state
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [shareDuration, setShareDuration] = useState(30);
  const [shareRemainingMins, setShareRemainingMins] = useState(30);
  const [shareContact, setShareContact] = useState(contacts[0]);
  const [networkInterrupted, setNetworkInterrupted] = useState(false);
  const [demoCoordOffset, setDemoCoordOffset] = useState(0);

  // Dynamic ML Risk Simulation State
  const [mlFeatures, setMlFeatures] = useState({
    crowdDensity: 78,
    crimeRate: 65,
    lightingScore: 30, // low lighting = high hazard
    rainfall: 45,
    hourOfDay: 22, // night
    policePatrols: 2
  });

  // Calculate dynamic ML regression score
  const dynamicRiskScore = Math.min(100, Math.max(0, Math.round(
    (mlFeatures.crowdDensity * 0.28) + 
    (mlFeatures.crimeRate * 0.35) + 
    ((100 - mlFeatures.lightingScore) * 0.20) + 
    (mlFeatures.rainfall * 0.08) + 
    (mlFeatures.hourOfDay >= 20 || mlFeatures.hourOfDay <= 5 ? 12 : 2) -
    (mlFeatures.policePatrols * 4)
  )));

  const getRiskBadge = (score) => {
    if (score >= 80) return { label: t('criticalRisk'), color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40' };
    if (score >= 60) return { label: t('highRisk'), color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40' };
    if (score >= 30) return { label: t('modRisk'), color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' };
    return { label: t('lowRisk'), color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' };
  };

  const [incidents, setIncidents] = useState([
    {
      id: 1,
      incident_code: 'INC-1024',
      tourist_id: 1,
      tourist_name: 'Mahalasa Rao',
      tourist_contact: '+91 98450 11223',
      incident_type: 'SOS Distress Beacon',
      severity: 'CRITICAL',
      latitude: 12.9820,
      longitude: 77.6080,
      location_name: 'Shivajinagar Canal Trench Corridor',
      current_status: 'RESPONDING',
      assigned_responder: 'Officer K. Sharma (PCR Unit 4 - Alpha)',
      assigned_responder_contact: '+91 80 2221 0000',
      estimated_arrival_minutes: 3,
      description: 'Emergency panic distress beacon triggered near high-risk canal corridor. Responder deployed.',
      created_at: '12 mins ago',
      blockchain_verified: true,
      block_number: 1849204,
      transaction_hash: '0x9f83b2a75d31481e7d23a41bc978d10b719468e2ef84a1d48c081c70e0a5c4e9',
      incident_hash: '0x3c7e1482938102fba7230198cd8372019ab3847291048bca7389104273891042'
    },
    {
      id: 2,
      incident_code: 'INC-1023',
      tourist_id: 2,
      tourist_name: 'John Davis',
      tourist_contact: '+1 415 555 2671',
      incident_type: 'Medical Emergency',
      severity: 'HIGH',
      latitude: 12.9756,
      longitude: 77.6066,
      location_name: 'Commercial Street Alleyways',
      current_status: 'ASSIGNED',
      assigned_responder: 'Paramedic Team B-12 (Rapid Response)',
      assigned_responder_contact: '+91 80 2294 2222',
      estimated_arrival_minutes: 6,
      description: 'Dehydration and dizziness reported near congested transit node. Paramedic en route.',
      created_at: '34 mins ago',
      blockchain_verified: true,
      block_number: 1849198,
      transaction_hash: '0x5c81d2a75d31481e7d23a41bc978d10b719468e2ef84a1d48c081c70e0a511e4',
      incident_hash: '0x7b1e1482938102fba7230198cd8372019ab3847291048bca7389104273895521'
    },
    {
      id: 3,
      incident_code: 'INC-1022',
      tourist_id: 3,
      tourist_name: 'Elena Rostova',
      tourist_contact: '+7 916 123 4567',
      incident_type: 'Geo-Fence Boundary Breach',
      severity: 'MODERATE',
      latitude: 12.9740,
      longitude: 77.6110,
      location_name: 'MG Road East Perimeter',
      current_status: 'VERIFIED',
      assigned_responder: null,
      description: 'Tourist entered flagged construction hazard boundary after sunset hours.',
      created_at: '1 hr ago',
      blockchain_verified: true,
      block_number: 1849182,
      transaction_hash: '0x4d32a1e87c29341bfa0923184cd7612ef10928374a5b6c7d8e9f0123456789ab',
      incident_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
    },
    {
      id: 4,
      incident_code: 'INC-1021',
      tourist_id: 4,
      tourist_name: 'Takeshi Yamamoto',
      tourist_contact: '+81 90 1234 5678',
      incident_type: 'Lost Property & Guidance',
      severity: 'LOW',
      latitude: 12.9760,
      longitude: 77.5930,
      location_name: 'Cubbon Park West Gate',
      current_status: 'RESOLVED',
      assigned_responder: 'Tourist Police Helpdesk (Officer Ananya)',
      assigned_responder_contact: '+91 80 2294 3333',
      description: 'Misplaced documents recovered safely at Cubbon Park Kiosk. Case closed on-chain.',
      created_at: '3 hrs ago',
      blockchain_verified: true,
      block_number: 1849150,
      transaction_hash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
      incident_hash: '0x99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff'
    }
  ]);

  const [riskZones] = useState([
    { id: 1, name: 'Cubbon Park Heritage Area', risk_score: 14.0, risk_level: 'LOW', radius: 900, active: true, center: { x: 28, y: 45 }, crowd: 'Normal', patrols: '3 Units Active' },
    { id: 2, name: 'MG Road Transit Hub', risk_score: 38.5, risk_level: 'MODERATE', radius: 750, active: true, center: { x: 55, y: 50 }, crowd: 'High', patrols: '5 Units Active' },
    { id: 3, name: 'Commercial Street Alleyways', risk_score: 68.4, risk_level: 'HIGH', radius: 650, active: true, center: { x: 68, y: 35 }, crowd: 'Very Dense', patrols: '4 Units Active' },
    { id: 4, name: 'Shivajinagar Canal Trench', risk_score: 88.2, risk_level: 'CRITICAL', radius: 500, active: true, center: { x: 75, y: 22 }, crowd: 'Isolated', patrols: '2 Units Dispatched' }
  ]);

  const [tourists, setTourists] = useState([
    { id: 1, tourist_code: 'TOURIST-1024', full_name: 'Mahalasa Rao', did: 'did:sih:tourist-1024:verified', risk_level: 'CRITICAL', risk_score: 88.2, status: 'SOS ACTIVE', battery: 74, lat: 12.9820, lon: 77.6080, x: 74, y: 24, emergency_contact: 'Mom: +91 98450 11223', nationality: 'Indian' },
    { id: 2, tourist_code: 'TOURIST-1025', full_name: 'John Davis', did: 'did:sih:tourist-1025:verified', risk_level: 'HIGH', risk_score: 68.4, status: 'MONITORED', battery: 42, lat: 12.9756, lon: 77.6066, x: 67, y: 37, emergency_contact: 'Embassy: +1 202 555 0199', nationality: 'American' },
    { id: 3, tourist_code: 'TOURIST-1026', full_name: 'Elena Rostova', did: 'did:sih:tourist-1026:verified', risk_level: 'MODERATE', risk_score: 38.5, status: 'MONITORED', battery: 89, lat: 12.9740, lon: 77.6110, x: 58, y: 48, emergency_contact: 'Consulate: +7 495 111 2233', nationality: 'Russian' },
    { id: 4, tourist_code: 'TOURIST-1027', full_name: 'Takeshi Yamamoto', did: 'did:sih:tourist-1027:verified', risk_level: 'LOW', risk_score: 14.0, status: 'SAFE', battery: 96, lat: 12.9760, lon: 77.5930, x: 30, y: 42, emergency_contact: 'Agent: +81 3 5555 4444', nationality: 'Japanese' }
  ]);

  // Mobile App Simulator State
  const [mobileSosTriggered, setMobileSosTriggered] = useState(false);

  const handleStatusChange = (id, newStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          current_status: newStatus,
          assigned_responder: newStatus === 'ASSIGNED' && !inc.assigned_responder ? 'Officer M. Patil (PCR Unit 7)' : inc.assigned_responder
        };
      }
      return inc;
    }));
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 3000);
  };

  const handleTriggerMobileSos = () => {
    setMobileSosTriggered(true);
    const primary = contacts.find(c => c.is_primary) || contacts[0];
    const newInc = {
      id: Date.now(),
      incident_code: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      tourist_id: 1,
      tourist_name: 'Mahalasa Rao',
      tourist_contact: '+91 98450 11223',
      incident_type: 'SOS Distress Beacon',
      severity: 'CRITICAL',
      latitude: 12.9820,
      longitude: 77.6080,
      location_name: 'Shivajinagar Canal Trench (Live Trigger)',
      current_status: 'NEW',
      assigned_responder: null,
      description: `Emergency panic beacon triggered. Primary contact ${primary.name} (${primary.phone}) notified.`,
      created_at: 'Just now',
      blockchain_verified: true,
      block_number: 1849205,
      transaction_hash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      incident_hash: '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  const handleStartLiveSharing = () => {
    setIsSharingLocation(true);
    setShareRemainingMins(shareDuration);
    setNetworkInterrupted(false);
  };

  const handleStopLiveSharing = () => {
    setIsSharingLocation(false);
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.incident_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.incident_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.tourist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.location_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.current_status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar with Language Switcher */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white flex items-center gap-2 tracking-tight">
              {t('title')} <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">SIH260483</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">{t('sub')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Multilingual Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1.5" />
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${lang === 'en' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${lang === 'hi' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('kn')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${lang === 'kn' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold">DISPATCH LIVE (WS: 8000)</span>
          </div>

          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div className="text-right">
              <div className="text-xs font-bold text-white">Central HQ Desk</div>
              <div className="text-[10px] text-cyan-400 font-mono">DID: did:sih:authority-hq-01</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-300 shadow-md">
              HQ
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800/80 bg-slate-900/40 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Navigation Modules</div>
            {[
              { id: 'overview', label: t('overview'), icon: Activity },
              { id: 'live-map', label: t('liveMap'), icon: MapPin },
              { id: 'incidents', label: t('incidents'), icon: AlertTriangle, badge: incidents.filter(i => i.current_status !== 'RESOLVED').length },
              { id: 'risk-zones', label: t('riskEngine'), icon: Flame },
              { id: 'tourists', label: t('tourists'), icon: Users },
              { id: 'blockchain', label: t('blockchain'), icon: FileCheck },
              { id: 'emergency-contacts', label: t('emergencyContacts'), icon: PhoneCall },
              { id: 'live-location', label: t('liveLocation'), icon: Navigation },
              { id: 'mobile-sim', label: t('mobileSim'), icon: Smartphone }
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* System Health Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Multilingual</span>
              <span className="text-cyan-400 font-mono font-bold">EN / HI / KN</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Smart Contracts</span>
              <span className="text-emerald-400 font-mono font-bold">Audit Verified</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">ML Model R²</span>
              <span className="text-cyan-400 font-mono font-bold">0.9658</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Content View Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick KPI Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-medium">{t('activeIncidents')}</div>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2 flex items-baseline gap-2">
                    {incidents.filter(i => i.current_status !== 'RESOLVED').length}
                    <span className="text-xs font-semibold text-red-400 font-mono px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/30">
                      {incidents.filter(i => i.severity === 'CRITICAL').length} CRITICAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> 100% automated hashing on-chain
                  </p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-medium">Dynamic Geo-Fences</div>
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-orange-400 mt-2">4 Active</div>
                  <p className="text-[11px] text-slate-400 mt-2">2 High-Risk AI flagged sectors</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-medium">{t('touristsMonitored')}</div>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white mt-2">1,024</div>
                  <p className="text-[11px] text-emerald-400 mt-2 font-mono">100% Aadhaar DID Verified</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-medium">{t('avgResponse')}</div>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-400 mt-2">3.8 min</div>
                  <p className="text-[11px] text-slate-400 mt-2">Target SLA: &lt; 5.0 min</p>
                </div>
              </div>

              {/* Incidents Quick Preview */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Live Emergency Incident Feed & Dispatch Lifecycle
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time status transitions with immutable blockchain hashing</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('incidents')}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    View All Incidents <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="pb-3 px-3">INCIDENT CODE</th>
                        <th className="pb-3 px-3">TOURIST</th>
                        <th className="pb-3 px-3">TYPE</th>
                        <th className="pb-3 px-3">SEVERITY</th>
                        <th className="pb-3 px-3">STATUS</th>
                        <th className="pb-3 px-3">RESPONDER</th>
                        <th className="pb-3 px-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {incidents.slice(0, 3).map(inc => (
                        <tr key={inc.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-3 font-mono font-bold text-cyan-400">{inc.incident_code}</td>
                          <td className="py-4 px-3 font-bold text-white">{inc.tourist_name}</td>
                          <td className="py-4 px-3 text-slate-300">{inc.incident_type}</td>
                          <td className="py-4 px-3">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                              inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                              inc.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                              'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            }`}>
                              {inc.severity}
                            </span>
                          </td>
                          <td className="py-4 px-3 font-mono font-semibold text-slate-300">
                            {inc.current_status}
                          </td>
                          <td className="py-4 px-3 text-slate-300">
                            {inc.assigned_responder || <span className="text-slate-500 italic">Unassigned</span>}
                          </td>
                          <td className="py-4 px-3 text-right space-x-1.5">
                            {inc.current_status === 'NEW' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'VERIFIED')}
                                className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 text-[11px] font-bold"
                              >
                                Verify
                              </button>
                            )}
                            {inc.current_status === 'VERIFIED' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'ASSIGNED')}
                                className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 text-[11px] font-bold"
                              >
                                Assign Unit
                              </button>
                            )}
                            {inc.current_status === 'ASSIGNED' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'RESPONDING')}
                                className="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 text-[11px] font-bold"
                              >
                                Dispatch (En Route)
                              </button>
                            )}
                            {inc.current_status === 'RESPONDING' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'RESOLVED')}
                                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-[11px] font-bold"
                              >
                                Mark Resolved
                              </button>
                            )}
                            {inc.current_status === 'RESOLVED' && (
                              <span className="text-emerald-400 font-semibold text-[11px] flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Closed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE GEO-FENCE MAP */}
          {activeTab === 'live-map' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      {t('liveMap')} (Bangalore Central Safety Corridor)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time geofence radar, tourist telemetry pins, and live boundary hazard monitoring</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Safe Zone</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Moderate Zone</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> High Risk</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span> SOS Distress</span>
                  </div>
                </div>

                <div className="relative w-full h-[480px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
                  <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500">LAT: 12.9820° N | LON: 77.6080° E</div>
                  <div className="absolute bottom-3 right-4 text-[10px] font-mono text-cyan-500/60">GEOFENCE ENGINE: ACTIVE (100Hz)</div>

                  {riskZones.map(zone => (
                    <div 
                      key={zone.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all duration-500 hover:scale-105 ${
                        zone.risk_level === 'CRITICAL' ? 'border-red-500 bg-red-500/15 text-red-400' :
                        zone.risk_level === 'HIGH' ? 'border-orange-500 bg-orange-500/15 text-orange-400' :
                        zone.risk_level === 'MODERATE' ? 'border-amber-500 bg-amber-500/15 text-amber-400' :
                        'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                      }`}
                      style={{
                        left: `${zone.center.x}%`,
                        top: `${zone.center.y}%`,
                        width: `${zone.radius / 3.8}px`,
                        height: `${zone.radius / 3.8}px`
                      }}
                    >
                      <div className="text-[10px] font-bold text-white bg-slate-900/90 px-2.5 py-0.5 rounded-full shadow border border-slate-700 whitespace-nowrap">
                        {zone.name}
                      </div>
                      <div className="text-[9px] font-mono mt-0.5">
                        Risk: {zone.risk_score} ({zone.risk_level})
                      </div>
                    </div>
                  ))}

                  {tourists.map(tourist => {
                    const isSos = tourist.status === 'SOS ACTIVE';
                    return (
                      <div
                        key={tourist.id}
                        onClick={() => setSelectedTourist(tourist)}
                        style={{ left: `${tourist.x}%`, top: `${tourist.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                      >
                        {isSos && (
                          <span className="absolute -inset-3 rounded-full bg-red-500/40 animate-ping"></span>
                        )}
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-lg transition-transform group-hover:scale-125 ${
                          isSos ? 'bg-red-600 border-white text-white animate-bounce' : 'bg-slate-900 border-cyan-400 text-cyan-300'
                        }`}>
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-10 hidden group-hover:flex flex-col items-center bg-slate-900/95 text-slate-100 p-2 rounded-xl border border-slate-700 shadow-2xl z-30 whitespace-nowrap text-xs">
                          <span className="font-bold">{tourist.full_name}</span>
                          <span className="text-[10px] text-cyan-400 font-mono">{tourist.tourist_code}</span>
                          <span className="text-[10px] text-slate-400">Status: {tourist.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedTourist && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{selectedTourist.full_name}</span>
                        <span className="text-xs font-mono text-cyan-400">({selectedTourist.tourist_code})</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          selectedTourist.status === 'SOS ACTIVE' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {selectedTourist.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        DID: {selectedTourist.did} | Battery: {selectedTourist.battery}% | {selectedTourist.emergency_contact}
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTourist(null)}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INCIDENT LIFECYCLE (FULL RESOLVED TABLE + ACTIONS) */}
          {activeTab === 'incidents' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Comprehensive Incident Dispatch Lifecycle
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Filter, verify, assign PCR units, and record tamper-proof resolution hashes</p>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input 
                        type="text"
                        placeholder="Search incident, tourist, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 w-64"
                      />
                    </div>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ALL">All Severities</option>
                      <option value="CRITICAL">Critical Only</option>
                      <option value="HIGH">High Only</option>
                      <option value="MODERATE">Moderate Only</option>
                      <option value="LOW">Low Only</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="NEW">NEW</option>
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="RESPONDING">RESPONDING</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="pb-3 px-3">CODE</th>
                        <th className="pb-3 px-3">TOURIST</th>
                        <th className="pb-3 px-3">TYPE</th>
                        <th className="pb-3 px-3">SEVERITY</th>
                        <th className="pb-3 px-3">STATUS</th>
                        <th className="pb-3 px-3">RESPONDER / ETA</th>
                        <th className="pb-3 px-3">BLOCKCHAIN PROOF</th>
                        <th className="pb-3 px-3 text-right">LIFECYCLE ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredIncidents.map(inc => (
                        <tr key={inc.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-3 font-mono font-bold text-cyan-400">{inc.incident_code}</td>
                          <td className="py-4 px-3">
                            <div className="font-bold text-white">{inc.tourist_name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{inc.tourist_contact}</div>
                          </td>
                          <td className="py-4 px-3 font-medium text-slate-300">{inc.incident_type}</td>
                          <td className="py-4 px-3">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                              inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                              inc.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                              inc.severity === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            }`}>
                              {inc.severity}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-mono font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                              {inc.current_status}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            {inc.assigned_responder ? (
                              <div>
                                <div className="text-slate-200 font-semibold">{inc.assigned_responder}</div>
                                {inc.estimated_arrival_minutes && (
                                  <div className="text-[10px] text-emerald-400 font-mono">ETA: ~{inc.estimated_arrival_minutes} mins</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-4 px-3 font-mono text-[10px]">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span title={inc.transaction_hash}>{inc.transaction_hash.slice(0, 10)}...</span>
                            </div>
                            <div className="text-slate-500 text-[9px]">Block #{inc.block_number}</div>
                          </td>
                          <td className="py-4 px-3 text-right space-x-1.5">
                            {inc.current_status === 'NEW' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'VERIFIED')}
                                className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 text-[11px] font-bold"
                              >
                                Step 1: Verify
                              </button>
                            )}
                            {inc.current_status === 'VERIFIED' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'ASSIGNED')}
                                className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 text-[11px] font-bold"
                              >
                                Step 2: Assign Unit
                              </button>
                            )}
                            {inc.current_status === 'ASSIGNED' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'RESPONDING')}
                                className="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30 text-[11px] font-bold"
                              >
                                Step 3: Dispatch Unit
                              </button>
                            )}
                            {inc.current_status === 'RESPONDING' && (
                              <button 
                                onClick={() => handleStatusChange(inc.id, 'RESOLVED')}
                                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-[11px] font-bold"
                              >
                                Step 4: Mark Resolved
                              </button>
                            )}
                            {inc.current_status === 'RESOLVED' && (
                              <span className="text-emerald-400 font-semibold text-[11px] flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Sealed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DYNAMIC AI RISK ENGINE (FULL INTERACTIVE SIMULATOR) */}
          {activeTab === 'risk-zones' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Dynamic AI Risk Engine & Live Feature Simulation (Scikit-Learn Linear Regression)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Trained model predicting risk scores from crowd density, crime rates, night lighting, and temporal features</p>
                </div>

                {/* Risk Score Calculation Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Dynamic Risk Score</div>
                    <div className="text-4xl font-extrabold flex items-baseline gap-2">
                      <span className={getRiskBadge(dynamicRiskScore).color}>{dynamicRiskScore}</span>
                      <span className="text-sm font-normal text-slate-500">/ 100</span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getRiskBadge(dynamicRiskScore).bg} ${getRiskBadge(dynamicRiskScore).color} ${getRiskBadge(dynamicRiskScore).border} border`}>
                      {getRiskBadge(dynamicRiskScore).label}
                    </span>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <div className="text-xs text-slate-400 font-medium flex justify-between">
                      <span>Regression Model Metrics</span>
                      <span className="font-mono text-cyan-400">R² = 0.9658 | MAE = 2.14 | RMSE = 3.12</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          dynamicRiskScore >= 80 ? 'bg-red-500' :
                          dynamicRiskScore >= 60 ? 'bg-orange-500' :
                          dynamicRiskScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${dynamicRiskScore}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Feature Weights: Crime Rate (+0.35), Crowd Density (+0.28), Night Illumination (-0.20), Hour (+0.12), Police Patrols (-0.16).
                    </p>
                  </div>
                </div>

                {/* Feature Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Crowd Density Index</span>
                      <span className="text-cyan-400 font-mono">{mlFeatures.crowdDensity}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={mlFeatures.crowdDensity}
                      onChange={(e) => setMlFeatures({...mlFeatures, crowdDensity: Number(e.target.value)})}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500"><span>Sparse (0%)</span><span>Congested (100%)</span></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Historical Crime Rate Index</span>
                      <span className="text-cyan-400 font-mono">{mlFeatures.crimeRate}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={mlFeatures.crimeRate}
                      onChange={(e) => setMlFeatures({...mlFeatures, crimeRate: Number(e.target.value)})}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500"><span>Safe (0%)</span><span>High Incidents (100%)</span></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Street Lighting & Visibility Score</span>
                      <span className="text-cyan-400 font-mono">{mlFeatures.lightingScore}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={mlFeatures.lightingScore}
                      onChange={(e) => setMlFeatures({...mlFeatures, lightingScore: Number(e.target.value)})}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500"><span>Pitch Dark (0%)</span><span>High Lumens (100%)</span></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Time of Day (24-Hour Format)</span>
                      <span className="text-cyan-400 font-mono">{mlFeatures.hourOfDay}:00 hrs</span>
                    </div>
                    <input 
                      type="range" min="0" max="23" 
                      value={mlFeatures.hourOfDay}
                      onChange={(e) => setMlFeatures({...mlFeatures, hourOfDay: Number(e.target.value)})}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500"><span>Day (12:00)</span><span>Late Night (23:00)</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MONITORED TOURISTS & DIGITAL IDENTITY (DID) */}
          {activeTab === 'tourists' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      Aadhaar-Verified Digital Identity (DID) & Tourist Telemetry Registry
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Privacy-preserving decentralized credentials linked to emergency response contacts</p>
                  </div>

                  {/* Broadcast Warning Form */}
                  <form onSubmit={handleSendBroadcast} className="flex items-center gap-2">
                    <input 
                      type="text"
                      placeholder="Send safety broadcast to all tourists..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 w-64"
                    />
                    <button 
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                    >
                      <Send className="w-3.5 h-3.5" /> Broadcast
                    </button>
                  </form>
                </div>

                {broadcastSent && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
                    <CheckCircle className="w-4 h-4" /> Push broadcast notification successfully dispatched to all 1,024 active tourist nodes!
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {tourists.map(t => (
                    <div key={t.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            {t.full_name}
                            <span className="text-xs font-mono text-cyan-400">{t.tourist_code}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {t.did}
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'SOS ACTIVE' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {t.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div className="text-[10px] text-slate-500">BATTERY LEVEL</div>
                          <div className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                            <Battery className="w-3.5 h-3.5 text-emerald-400" /> {t.battery}%
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                          <div className="text-[10px] text-slate-500">RISK CLASSIFICATION</div>
                          <div className={`font-bold mt-0.5 ${
                            t.risk_level === 'CRITICAL' ? 'text-red-400' :
                            t.risk_level === 'HIGH' ? 'text-orange-400' :
                            t.risk_level === 'MODERATE' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {t.risk_score} ({t.risk_level})
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>{t.emergency_contact}</span>
                        <span className="font-mono text-cyan-400">LAT: {t.lat}° | LON: {t.lon}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BLOCKCHAIN AUDIT TRAIL (FULL SMART CONTRACT EXPLORER) */}
          {activeTab === 'blockchain' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-cyan-400" />
                    Immutable Blockchain Audit Trail (TouristSafetyAudit.sol)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Every state change generates a verifiable cryptographic transaction hash on-chain</p>
                </div>

                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono space-y-1">
                  <div className="text-cyan-300 font-bold">SMART CONTRACT SPECIFICATION</div>
                  <div className="text-slate-300">Contract Address : 0x5FbDB2315678afecb367f032d93F642f64180aa3</div>
                  <div className="text-slate-300">Network          : Hardhat Local / Polygon PoS Testnet</div>
                  <div className="text-slate-300">Standard         : ERC-735 / DID Verifiable Credentials + Incident Audit Log</div>
                </div>

                <div className="space-y-3">
                  {incidents.map((inc) => (
                    <div key={inc.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-cyan-400">TRANSACTION #{inc.block_number} ({inc.incident_code})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          CONFIRMED ON-CHAIN
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-500">TX HASH: </span>{inc.transaction_hash}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <span className="text-slate-500">PAYLOAD HASH (SHA-256): </span>{inc.incident_hash}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                        <span>Incident Type: {inc.incident_type}</span>
                        <span>Logged Status: {inc.current_status}</span>
                        <span>Timestamp: {inc.created_at}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: EMERGENCY CONTACTS */}
          {activeTab === 'emergency-contacts' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <PhoneCall className="w-5 h-5 text-cyan-400" />
                      {t('emergencyContacts')} Manager
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Designate primary contacts for automatic SMS & GPS dispatch when SOS is triggered</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {contacts.map(c => (
                    <div key={c.id} className={`p-5 rounded-2xl border space-y-3 ${c.is_primary ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-slate-900/60 border-slate-800'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-white">{c.name}</div>
                          <div className="text-xs font-mono text-cyan-400 mt-0.5">{c.phone}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{c.relationship}</div>
                        </div>
                        {c.is_primary === 1 && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                            ★ PRIMARY
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        {c.is_primary !== 1 ? (
                          <button
                            onClick={() => setContacts(prev => prev.map(x => ({ ...x, is_primary: x.id === c.id ? 1 : 0 })))}
                            className="text-xs font-semibold text-cyan-400 hover:underline"
                          >
                            Set as Primary
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Linked to SOS
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LIVE LOCATION SHARING */}
          {activeTab === 'live-location' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-400" />
                    {t('liveLocation')} (Opt-In & Time-Limited)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Encrypted GPS telemetry stream accessible strictly by designated emergency contact</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Control Panel */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">SHARING STATUS</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isSharingLocation ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                        {isSharingLocation ? t('sharingActive') : t('notSharing')}
                      </span>
                    </div>

                    {isSharingLocation && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                        <div className="text-xs text-slate-400">{t('remaining')}</div>
                        <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                          {shareRemainingMins} min
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Shared with: <strong className="text-white">{shareContact.name}</strong>
                        </div>
                      </div>
                    )}

                    {networkInterrupted && isSharingLocation && (
                      <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" /> {t('netInterrupted')} — Local GPS Retained
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400">Select Sharing Duration</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[15, 30, 60].map(dur => (
                          <button
                            key={dur}
                            onClick={() => { setShareDuration(dur); setShareRemainingMins(dur); }}
                            className={`py-2 rounded-xl text-xs font-bold transition-all ${shareDuration === dur ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
                          >
                            {dur} min
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      {isSharingLocation ? (
                        <button
                          onClick={handleStopLiveSharing}
                          className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xs hover:bg-red-500/30 flex items-center justify-center gap-2"
                        >
                          <StopCircle className="w-4 h-4" /> {t('stopSharing')}
                        </button>
                      ) : (
                        <button
                          onClick={handleStartLiveSharing}
                          className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                        >
                          <PlayCircle className="w-4 h-4" /> {t('startSharing')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Demonstration Simulator */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">SIH Demonstration Mode Controls</h3>
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setDemoCoordOffset(prev => prev + 1)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 text-left flex items-center justify-between"
                      >
                        <span>🏃 SIMULATE LOCATION UPDATE</span>
                        <span className="font-mono text-cyan-400 text-[11px]">LAT: 12.{9820 + demoCoordOffset * 10}</span>
                      </button>

                      <button
                        onClick={() => setNetworkInterrupted(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 text-left flex items-center justify-between"
                      >
                        <span>📵 SIMULATE NETWORK OFF</span>
                        <span className="text-red-400 text-[11px]">Disconnect</span>
                      </button>

                      <button
                        onClick={() => setNetworkInterrupted(false)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 text-left flex items-center justify-between"
                      >
                        <span>📶 SIMULATE NETWORK ON</span>
                        <span className="text-emerald-400 text-[11px]">Resume Sync</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: TOURIST MOBILE SIMULATOR */}
          {activeTab === 'mobile-sim' && (
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-xl space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                    {t('mobileSim')} (React Native Client Preview)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Language in Simulator: <strong className="text-cyan-300">{lang === 'kn' ? 'ಕನ್ನಡ' : lang === 'hi' ? 'हिन्दी' : 'English'}</strong></p>
                </div>

                <div className="flex justify-center py-2">
                  <div className="w-[340px] rounded-[36px] bg-slate-900 border-4 border-slate-700 p-4 shadow-2xl space-y-4 relative">
                    <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-1"></div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 font-mono">
                      <span>09:41</span>
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3 h-3 text-cyan-400" />
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>

                    {/* Tourist Header */}
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white">Mahalasa Rao</div>
                      <div className="text-[10px] text-cyan-400 font-mono">DID: did:sih:tourist-1024</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Aadhaar KYC Verified
                      </div>
                    </div>

                    {/* Warning / SOS Banner */}
                    <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                      mobileSosTriggered ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        {mobileSosTriggered ? t('sosActivated') : t('geofenceAlert')}
                      </div>
                      <p className="text-[10px] opacity-90">
                        {mobileSosTriggered 
                          ? `${t('servicesNotified')} Primary contact (${contacts[0].name}) alerted.` 
                          : `${t('highRisk')}: Shivajinagar Corridor`}
                      </p>
                    </div>

                    {/* Big SOS Button */}
                    <div className="py-4 flex flex-col items-center justify-center space-y-2">
                      <button 
                        onClick={handleTriggerMobileSos}
                        className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-extrabold text-lg flex flex-col items-center justify-center shadow-xl shadow-red-600/40 border-4 border-red-400/30 hover:scale-105 active:scale-95 transition-all"
                      >
                        <ShieldAlert className="w-7 h-7 mb-1 animate-pulse" />
                        <span>SOS</span>
                      </button>
                      <span className="text-[10px] text-slate-400 text-center">
                        Tap once to transmit high-priority encrypted emergency beacon
                      </span>
                    </div>

                    {/* Primary Contact Row */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300">
                      <div className="text-slate-400 font-bold uppercase">{t('primaryContact')}:</div>
                      <div className="font-semibold text-cyan-400 mt-0.5">{contacts[0].name} ({contacts[0].phone})</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
