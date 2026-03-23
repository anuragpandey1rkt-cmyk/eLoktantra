import Link from 'next/link';

const stats = [
  { value: '1.4B+', label: 'Citizens', icon: '👥' },
  { value: '543', label: 'Constituencies', icon: '🗺️' },
  { value: '8,500+', label: 'Candidates', icon: '🏛️' },
  { value: '100%', label: 'Transparency', icon: '🔍' },
];

const features = [
  {
    title: 'Transparent Candidates',
    description: 'Deep dive into candidate backgrounds, criminal records, and financial asset disclosures — all in one place.',
    href: '/candidates',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    color: 'from-blue-500/10 to-blue-600/5',
    border: 'hover:border-blue-500/25',
    iconColor: 'text-blue-400 bg-blue-500/10',
  },
  {
    title: 'Live Elections',
    description: 'Track ongoing elections in real-time. Follow results, turnout, and declarations as they happen.',
    href: '/elections',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    color: 'from-orange-500/10 to-orange-600/5',
    border: 'hover:border-orange-500/25',
    iconColor: 'text-orange-400 bg-orange-500/10',
  },
  {
    title: 'Civic Issue Reporting',
    description: 'Report local problems directly to representatives and track resolution progress with full accountability.',
    href: '/issues',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: 'from-yellow-500/10 to-yellow-600/5',
    border: 'hover:border-yellow-500/25',
    iconColor: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    title: 'Promise Tracker',
    description: 'Hold leaders accountable by tracking manifesto commitments against real-world delivery and progress.',
    href: '/promises',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-green-500/10 to-green-600/5',
    border: 'hover:border-green-500/25',
    iconColor: 'text-green-400 bg-green-500/10',
  },
  {
    title: 'AI Manifesto Compare',
    description: 'Use advanced AI to compare policy platforms across parties and understand key differences at a glance.',
    href: '/manifestos/compare',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.711-1.422 2.568l-1.372-.137m0 0L12 19.2m4.408-2.33l-4.408.53m0 0L7.592 19.87m0 0L6.22 20.008c-1.452.143-2.422-1.568-1.422-2.568L6.2 16.038" />
      </svg>
    ),
    color: 'from-purple-500/10 to-purple-600/5',
    border: 'hover:border-purple-500/25',
    iconColor: 'text-purple-400 bg-purple-500/10',
  },
  {
    title: 'Secure Digital Voting',
    description: 'Blockchain-backed, DigiLocker-verified, AI liveness-checked — the most secure digital ballot in India.',
    href: '/vote',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: 'from-primary/10 to-primary/5',
    border: 'hover:border-primary/25',
    iconColor: 'text-primary bg-primary/10',
  },
];



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative flex flex-col items-center justify-center pt-20 pb-28 px-4 overflow-hidden">

        {/* Background Orbs */}
        <div className="orb orb-primary w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 opacity-60" />
        <div className="orb orb-accent w-[400px] h-[400px] bottom-0 right-10 opacity-40" style={{ animationDelay: '2s' }} />
        <div className="orb orb-blue w-[300px] h-[300px] top-20 left-10 opacity-50" style={{ animationDelay: '4s' }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

         

          {/* Headline */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 animate-slide-up"
            style={{ animationDelay: '80ms' }}
          >
            <span className="hero-text-gradient">eLok</span>
            <span className="orange-text-gradient">tantra</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-muted-light max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up"
            style={{ animationDelay: '160ms' }}
          >
            Empowering India&apos;s democracy through radical transparency, verifiable elections, and direct civic participation — powered by AI &amp; Blockchain.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-slide-up"
            style={{ animationDelay: '240ms' }}
          >
            <Link href="/elections" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Explore Elections
            </Link>
            <Link href="/vote" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cast Your Vote
            </Link>
          </div>

          {/* Trust Badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 animate-slide-up"
            style={{ animationDelay: '320ms' }}
          >
            
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-card"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-black orange-text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="badge badge-primary mx-auto mb-5">Platform Features</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Everything Democracy <span className="orange-text-gradient">Needs</span>
            </h2>
            <p className="text-muted-light max-w-xl mx-auto leading-relaxed">
              A comprehensive civic-tech platform that brings transparency, accountability, and participation to every corner of India.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className={`feature-card border border-border ${feature.border} bg-gradient-to-br ${feature.color} group`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${feature.iconColor} transition-all group-hover:scale-110`}>
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold mb-2.5 group-hover:text-foreground transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed group-hover:text-muted-light transition-colors">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-muted group-hover:text-primary transition-colors">
                  Explore
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA BANNER ══════════════ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-10 md:p-16 text-center relative overflow-hidden">
            {/* Decorative orbs inside card */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/6 blur-3xl" />

            <div className="relative z-10">
              <div className="badge badge-primary mx-auto mb-6 w-fit">
                🇮🇳 Make Your Voice Count
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-5">
                Ready to <span className="orange-text-gradient">Vote?</span>
              </h2>
              <p className="text-muted-light max-w-lg mx-auto mb-10 leading-relaxed">
                Verify your identity with DigiLocker, pass the AI liveness check, and cast your vote securely — all in under 3 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/vote" className="btn-primary text-base px-10 py-4 w-full sm:w-auto">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Voting Now
                </Link>
                <Link href="/dashboard" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="nav-logo orange-text-gradient text-lg">eLoktantra</span>
            </div>

            <p className="text-xs text-muted text-center">
              Built for India&apos;s democratic future · AES-256 Encrypted · AI-Powered · Blockchain Secured
            </p>

            <div className="flex items-center gap-6">
              <Link href="/elections" className="text-xs text-muted hover:text-foreground transition-colors">Elections</Link>
              <Link href="/candidates" className="text-xs text-muted hover:text-foreground transition-colors">Candidates</Link>
              <Link href="/vote" className="text-xs text-muted hover:text-foreground transition-colors">Vote</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
