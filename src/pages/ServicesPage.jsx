import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight, 
  Layers, 
  Compass, 
  Code, 
  Cpu, 
  Workflow, 
  Users, 
  Check, 
  MessageSquare, 
  Quote
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const containerRef = useRef(null);
  
  // Refs to animate elements on scroll
  const animateRefs = useRef([]);
  animateRefs.current = [];

  const addToAnimateRefs = (el) => {
    if (el && !animateRefs.current.includes(el)) {
      animateRefs.current.push(el);
    }
  };

  useEffect(() => {
    const activeTriggers = [];

    // Apply scroll triggers to registered elements
    animateRefs.current.forEach((el) => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom-=60',
        end: 'bottom top+=60',
        onEnter: () => {
          gsap.fromTo(el, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
          );
        },
        onLeave: () => {
          gsap.to(el, 
            { y: -50, opacity: 0, duration: 0.5, ease: 'power2.in', overwrite: 'auto' }
          );
        },
        onEnterBack: () => {
          // Replace pan down with float in (slide up from 50)
          gsap.fromTo(el, 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
          );
        },
        onLeaveBack: () => {
          gsap.to(el, 
            { y: 50, opacity: 0, duration: 0.5, ease: 'power2.in', overwrite: 'auto' }
          );
        }
      });

      activeTriggers.push(trigger);
    });

    return () => {
      activeTriggers.forEach(t => t.kill());
    };
  }, []);

  const businessValues = [
    {
      num: '01',
      title: 'Brand Presence',
      value: 'Strengthening brand perception through high-end digital presence.',
      advantage: 'We translate brand positioning into world-class digital experiences. Through immersive storytelling and cinematic motion, websites become powerful brand assets.',
      tools: ['Immersive 3D', 'Custom Showreels', 'Purposeful Interaction Design']
    },
    {
      num: '02',
      title: 'Operations & Scaling',
      value: 'Building resilient digital products that support demanding operations.',
      advantage: 'Technology choices that follow your business goals. Whether launching a fast MVP with scalable component libraries or building complex custom systems, we balance speed, performance, and long-term flexibility.',
      tools: ['Shadcn/ui for rapid scaling', 'Custom Astro/Svelte frameworks', 'High-concurrency backends']
    },
    {
      num: '03',
      title: 'Digital Commerce',
      value: 'Increasing perceived product value through premium digital presentation.',
      advantage: 'We turn standard storefronts into narrative-driven shopping experiences. Using advanced 3D ecosystems, we produce high-end product visuals, immersive interiors, and lifestyle imagery cost-efficiently.',
      tools: ['Headless Commerce', '3D Product Configuration', 'Narrative UX']
    },
    {
      num: '04',
      title: 'Decentralized Tech',
      value: 'Delivering decentralized products with a seamless user experience to drive mainstream adoption.',
      advantage: 'We make blockchain complexity understandable for everyday users while maintaining strong security and engineering standards.',
      tools: ['Multi-chain Smart Contracts (ETH, Sol)', 'Secure Wallet Integration', 'High-end dApp frontends']
    }
  ];

  const capabilities = [
    {
      title: 'Product Strategy',
      desc: 'Aligning product vision with technical reality to remove uncertainty and ensure every development hour moves the product forward.',
      items: [
        'Product Discovery',
        'Market & User Research',
        'Competitor Analysis',
        'Technical Feasibility Analysis',
        'Product Roadmapping',
        'MVP Scoping & Definition'
      ],
      stack: ['Figma', 'Notion', 'Miro', 'Jira', 'Linear'],
      icon: Compass
    },
    {
      title: 'UX/UI Design',
      desc: 'Designing intuitive interfaces where refined aesthetics meet effortless usability — supporting products that look exceptional and feel natural to use.',
      items: [
        'UX/UI Audits',
        'High-End UI Design',
        'User Experience (UX)',
        'Design Systems',
        'Rapid Prototyping',
        'Interaction Design'
      ],
      stack: ['Figma', 'Adobe CC', 'Principle', 'Rive', 'Lottie'],
      icon: Layers
    },
    {
      title: '3D, Motion & Immersive Design',
      desc: 'Turning static interfaces into cinematic digital experiences through motion and 3D systems that deepen engagement and strengthen brand storytelling.',
      items: [
        'Art Direction & Concepting',
        'Digital Branding',
        '3D Visualization',
        'Interactive Motion Design',
        'Purposeful Immersion',
        'Brand Showreels & Cinematics'
      ],
      stack: ['Blender', 'Cinema 4D', 'After Effects', 'WebGL', 'Three.js', 'GSAP'],
      icon: Workflow
    },
    {
      title: 'Creative Frontend & App Engineering',
      desc: 'Connecting design and performance through clean code and modern tools that bring complex interfaces and interactions to life.',
      items: [
        'Frontend Development',
        'Web Application Systems',
        'Mobile Development',
        '3D, Motion & Immersive Development',
        'Performance & Accessibility Engineering',
        'Low-code / No-code Development'
      ],
      stack: ['React', 'Next.js', 'Vue', 'Nuxt', 'Astro', 'Svelte', 'Tailwind CSS', 'GSAP', 'Three.js'],
      icon: Code
    },
    {
      title: 'Backend, CMS & System Engineering',
      desc: 'Building scalable architectures and reliable systems that power complex data flows and flexible content management.',
      items: [
        'Headless CMS Integration',
        'Hosting & Deployment',
        'Monitoring & Error Tracking',
        'API Development (REST/GraphQL)',
        'SQL/No-SQL databases',
        'Authentication & Security'
      ],
      stack: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Vercel', 'AWS', 'Strapi', 'Sanity'],
      icon: Cpu
    },
    {
      title: 'Web3 & On-chain Engineering',
      desc: 'Developing secure decentralized products with intuitive interfaces that make on-chain technologies accessible to real users.',
      items: [
        'Smart Contract Development',
        'Multi-chain Wallet Integration',
        'dApp Architecture',
        'On-chain Data Indexing',
        'Tokenomics Implementation',
        'Web3 UX & Bridge Design'
      ],
      stack: ['Solidity', 'Rust', 'Hardhat', 'Foundry', 'Viem', 'Wagmi', 'Ethers.js', 'The Graph'],
      icon: Users
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Exploration & Alignment',
      desc: 'We explore your product vision, goals and constraints to define scope and priorities. Before starting, you receive an indicative budget and timeline to ensure full alignment.'
    },
    {
      step: '02',
      title: 'Planning & Roadmapping',
      desc: 'We turn your vision into a clear roadmap with defined tasks and milestones. Success criteria are set for each phase, keeping the team focused on what’s being built and why.'
    },
    {
      step: '03',
      title: 'Delivery & Project Management',
      desc: 'We follow a flexible process, from agile sprints to milestone-based delivery, to ensure steady progress. Regular reviews keep priorities clear and everyone aware of what’s happening next.'
    },
    {
      step: '04',
      title: 'Communication & Reporting',
      desc: 'Daily updates and demos keep you informed. We use your preferred tools, like Slack or Teams, to share progress and risks, so the project stays on track.'
    }
  ];

  const engagementModels = [
    {
      num: '01',
      title: 'End-to-End Product Delivery',
      desc: 'We take full ownership of the product lifecycle – from discovery to a scalable digital product.',
      features: [
        'Senior cross-functional team',
        'Discovery to delivery ownership',
        'Autonomous process management',
        'Defined product strategy and roadmap'
      ]
    },
    {
      num: '02',
      title: 'Embedded Expertise',
      desc: 'Our senior specialists integrate directly into your team to fill expertise gaps or accelerate delivery.',
      features: [
        'Direct integration of senior experts',
        'Matches your internal workflow',
        'Fills specific expertise gaps',
        'Flexible and scalable team growth'
      ]
    }
  ];

  const testimonials = [
    {
      quote: "The Wonder Makers team was a one stop shop for all the elements required to increase sales and better support current customers.",
      author: "Spencer Juarrero",
      role: "IT & Digital Manager",
      company: "Sebo.us"
    },
    {
      quote: "From management to design and development, every contributor is a top talent who delivers measurable results.",
      author: "Simon Jones",
      role: "Creative Director",
      company: "Ava Labs"
    },
    {
      quote: "Wonder Makers delivered the project on time, were responsive to our needs, and demonstrated strong expertise when handling complex challenges.",
      author: "David Zábrž",
      role: "Product Owner",
      company: "ApS Brno"
    },
    {
      quote: "Wonder Makers delivered high-quality websites that aligned perfectly with each project’s style and exceeded our expectations in both design and functionality.",
      author: "West Paglia",
      role: "Creative Director",
      company: "AMGI Studios"
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen pt-32 pb-24 text-black dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-24 md:gap-36">
        
        {/* HERO SECTION */}
        <section 
          ref={addToAnimateRefs} 
          className="flex flex-col gap-6 max-w-4xl"
        >
          <span className="text-xs font-semibold tracking-[0.25em] text-red-600 dark:text-neon uppercase select-none">
            SERVICES & DELIVERABLES
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-bold leading-none tracking-tight uppercase select-none">
            From discovery <br />to engineering.
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-sans text-base md:text-xl max-w-2xl leading-relaxed">
            Through full product delivery or team augmentation, we ensure thoughtful design and reliable engineering drive real business value.
          </p>
        </section>

        {/* BUSINESS VALUE GRID */}
        <section className="flex flex-col gap-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessValues.map((val, idx) => (
              <div 
                key={idx}
                ref={addToAnimateRefs}
                className="flex flex-col justify-between p-8 rounded-2xl border border-black/8 dark:border-white/8 bg-neutral-100/40 dark:bg-neutral-900/10 backdrop-blur-sm hover:border-red-500/35 dark:hover:border-neon/35 transition-all duration-500 group"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-display font-light text-neutral-400 dark:text-neutral-500">
                      {val.num}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase font-semibold text-red-700 dark:text-neon/80 bg-red-100/70 dark:bg-neon/5 px-2 py-0.5 rounded-sm">
                      {val.title}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold mb-4 text-black dark:text-white group-hover:text-red-600 dark:group-hover:text-neon transition-colors duration-300">
                    {val.value}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400 mb-6">
                    {val.advantage}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 dark:text-neutral-500 mb-3">
                    Key Focus
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {val.tools.map((t, i) => (
                      <li key={i} className="text-[9px] px-2 py-1 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-neutral-600 dark:text-neutral-400">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CORE CAPABILITIES */}
        <section className="flex flex-col gap-16">
          <div ref={addToAnimateRefs} className="max-w-2xl flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-red-600 dark:text-neon uppercase select-none">
              OUR CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase select-none">
              Where we create value
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
              Our services highlight where we create the most value across a product’s lifecycle. They can be engaged individually or combined to fit your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div 
                  key={idx}
                  ref={addToAnimateRefs}
                  className="flex flex-col p-8 rounded-2xl border border-black/8 dark:border-white/8 bg-neutral-100/40 dark:bg-neutral-900/10 backdrop-blur-sm hover:border-red-500/35 dark:hover:border-neon/35 transition-all duration-500 group/cap"
                >
                  <div className="flex gap-4 items-center mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-neon/10 border border-red-200 dark:border-neon/20 flex items-center justify-center text-red-600 dark:text-neon">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-black dark:text-white">
                      {cap.title}
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 mb-6">
                    {cap.desc}
                  </p>

                  <div className="mb-6 flex-grow">
                    <h4 className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 dark:text-neutral-500 mb-3">
                      Expertise Areas
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                      {cap.items.map((item, i) => (
                        <li key={i} className="flex gap-2 items-center">
                          <Check className="w-3.5 h-3.5 text-red-600 dark:text-neon flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 dark:text-neutral-500 mb-3">
                      Technologies & Stack
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.stack.map((s, i) => (
                        <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-neutral-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="flex flex-col gap-16">
          <div ref={addToAnimateRefs} className="max-w-2xl flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-red-600 dark:text-neon uppercase select-none">
              OUR PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase select-none">
              How we work together
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
              Choosing a product partner is an important decision. Here is what working with us typically looks like.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <div 
                key={idx}
                ref={addToAnimateRefs}
                className="flex flex-col p-8 rounded-2xl border border-black/8 dark:border-white/8 bg-neutral-100/40 dark:bg-neutral-900/10 backdrop-blur-sm hover:border-red-500/35 dark:hover:border-neon/35 transition-all duration-500"
              >
                <span className="text-3xl font-display font-extrabold text-neutral-200 dark:text-neutral-800 mb-6">
                  {step.step}
                </span>
                <h3 className="text-lg font-display font-bold mb-3 text-black dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ENGAGEMENT MODELS */}
        <section className="flex flex-col gap-16">
          <div ref={addToAnimateRefs} className="max-w-2xl flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-red-600 dark:text-neon uppercase select-none">
              PARTNERSHIP
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase select-none">
              Flexible Engagement Models
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
              Our engagement models are designed for flexibility, allowing us to adapt each partnership to your product and team structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {engagementModels.map((model, idx) => (
              <div 
                key={idx}
                ref={addToAnimateRefs}
                className="flex flex-col p-8 rounded-2xl border border-black/8 dark:border-white/8 bg-neutral-100/40 dark:bg-neutral-900/10 backdrop-blur-sm hover:border-red-500/35 dark:hover:border-neon/35 transition-all duration-500"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-display font-bold text-black dark:text-white">
                    {model.title}
                  </span>
                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                    {model.num}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                  {model.desc}
                </p>
                <ul className="flex flex-col gap-3">
                  {model.features.map((feat, i) => (
                    <li key={i} className="flex gap-2.5 items-center text-xs text-neutral-600 dark:text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-neon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CLIENT TESTIMONIALS */}
        <section className="flex flex-col gap-16">
          <div ref={addToAnimateRefs} className="max-w-2xl flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-red-600 dark:text-neon uppercase select-none">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase select-none">
              What our clients say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <div 
                key={idx}
                ref={addToAnimateRefs}
                className="flex flex-col p-8 rounded-2xl border border-black/8 dark:border-white/8 bg-neutral-100/40 dark:bg-neutral-900/10 backdrop-blur-sm relative overflow-hidden"
              >
                <Quote className="w-16 h-16 text-black/5 dark:text-white/5 absolute -top-2 -left-2" />
                <p className="text-sm md:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 italic mb-8 relative z-10">
                  "{test.quote}"
                </p>
                <div className="mt-auto flex flex-col">
                  <span className="font-display font-bold text-sm text-black dark:text-white">
                    {test.author}
                  </span>
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                    {test.role} at {test.company}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
