import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Zap, 
  Layout, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  MousePointer2,
  Rocket
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function Home() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activePlan, setActivePlan] = useState("pro");
  
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig);
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -500]), springConfig);
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 15]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.1]), springConfig);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Instant Generation",
      description: "Get professional-grade thumbnails in seconds, not hours. Save your creative energy."
    },
    {
      icon: <Layout className="w-6 h-6 text-blue-400" />,
      title: "Smart Layouts",
      description: "AI-driven compositions that follow high-performing YouTube design patterns."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      title: "AI Enhancement",
      description: "Auto-correction for lighting, contrast, and focal points to maximize CTR."
    },
    {
      icon: <Users className="w-6 h-6 text-pink-400" />,
      title: "Community Driven",
      description: "Share your designs and get inspired by what others are creating in real-time."
    }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Tech YouTuber",
      content: "Thumblify has doubled my CTR. The AI understands exactly what draws people in.",
      avatar: "https://i.pravatar.cc/150?u=alex",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "Lifestyle Blogger",
      content: "I used to spend 2 hours on one thumbnail. Now it's done before my coffee is ready.",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      rating: 5
    },
    {
      name: "Marcus Thorne",
      role: "Gaming Creator",
      content: "The templates are modern and the customization is endless. Highly recommended!",
      avatar: "https://i.pravatar.cc/150?u=marcus",
      rating: 4
    }
  ];

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "$0",
      credits: "5 credits/mo",
      features: ["Basic Generation", "Standard Quality", "Community Access"],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      credits: "50 credits/mo",
      features: ["High-Res Export", "AI Enhancement", "Priority Support", "No Watermark"],
      popular: true
    },
    {
      id: "enterprise",
      name: "Expert",
      price: "$49",
      credits: "Unlimited",
      features: ["Custom Templates", "Team Collab", "API Access", "Dedicated Manager"],
      popular: false
    }
  ];

  return (
    <div ref={targetRef} className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[10%] left-[5%] w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"
        />
        
        {/* Floating 3D Shapes (SVG or CSS) */}
        <motion.div 
          animate={{ rotate: 360, y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ y: y1 }}
          className="absolute top-1/4 right-[15%] w-20 h-20 border border-white/5 bg-white/5 backdrop-blur-3xl rounded-2xl rotate-12 hidden lg:block"
        />
        <motion.div 
          animate={{ rotate: -360, x: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ y: y2 }}
          className="absolute bottom-1/3 left-[10%] w-16 h-16 border border-white/5 bg-white/5 backdrop-blur-3xl rounded-full hidden lg:block"
        />
      </div>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 sm:px-8 lg:px-16 overflow-hidden flex items-center mt-8">
        <div className="relative mx-auto max-w-7xl w-full">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            
            <motion.div 
              style={{ opacity }}
              className="space-y-10 z-10"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-purple-400 backdrop-blur-xl"
              >
                <Rocket className="w-4 h-4" />
                <span>The Future of Content Creation</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tighter"
              >
                AI Magic for <br />
                <span className="gradient-text drop-shadow-[0_0_30px_rgba(167,139,250,0.3)]">Viral Growth</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium"
              >
                Don't just make thumbnails. Engineer clicks. Our neural networks analyze top-performing trends to generate visuals that demand attention.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <button 
                  onClick={() => navigate("/generate")}
                  className="group relative px-10 py-5 rounded-2xl bg-white text-black font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Try Thumblify Now
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button 
                  onClick={() => navigate("/community")}
                  className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 font-black text-lg hover:bg-white/10 transition-colors backdrop-blur-xl"
                >
                  See the Magic
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-8 pt-8 border-t border-white/10"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" className="w-12 h-12 rounded-full border-4 border-[#020617] ring-1 ring-white/10" />
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-500 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-sm font-bold tracking-tight">Trusted by 50,000+ creators worldwide</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              style={{ y: y1, rotate, scale }}
              className="relative z-10"
            >
              <div className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                
                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#020617] shadow-2xl">
                  <img 
                    src="/hero-showcase.png" 
                    alt="AI Thumbnail Showcase" 
                    className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#020617]/80 via-transparent to-transparent" />
                  
                  {/* Floating UI Element */}
                  <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl glass-card border border-white/20 backdrop-blur-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
                          <MousePointer2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Analysis</p>
                          <p className="text-lg font-black">CTR Prediction: 94%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-black">+42.5%</div>
                        <div className="text-[10px] text-slate-500 uppercase">vs average</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative particles */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-12 -left-12 p-6 rounded-3xl glass-card border border-white/10 backdrop-blur-md hidden xl:block"
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Main Content (rest of the sections) */}
      <div className="relative z-10 bg-[#020617]">
        
        {/* Features Section */}
        <section className="px-6 py-20 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <motion.div 
              {...fadeIn}
              className="text-center max-w-3xl mx-auto mb-12 space-y-4"
            >
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight">The Edge You Need</h2>
              <p className="text-xl text-slate-400 font-medium">Our advanced AI model is specifically trained on millions of high-performing YouTube thumbnails to understand visual psychology.</p>
            </motion.div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  onHoverStart={() => setHoveredCard(idx)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`group relative p-10 rounded-[2.5rem] transition-all duration-500 border ${
                    hoveredCard === idx 
                      ? "bg-white/10 border-white/20 -translate-y-2" 
                      : "bg-white/5 border-white/5"
                  }`}
                >
                  <div className="mb-8 p-5 inline-block rounded-2xl bg-white/5 group-hover:bg-purple-500/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-6 py-20 sm:px-8 lg:px-16 bg-slate-950/30">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <motion.div {...fadeIn} className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tight">The Wall of Growth</h2>
                <p className="text-xl text-slate-400 max-w-xl font-medium">Join thousands of successful YouTubers who have automated their thumbnail workflow.</p>
              </motion.div>
              <motion.div {...fadeIn} className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-lg font-black tracking-tight">4.9/5 Rating</span>
              </motion.div>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {testimonials.map((testi, idx) => (
                <motion.div 
                  key={idx} 
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  className="p-10 rounded-[2.5rem] glass-card space-y-8 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-9xl">"</div>
                  <div className="flex text-yellow-500 gap-1 relative">
                    {[...Array(testi.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xl text-slate-200 font-medium leading-relaxed relative italic">"{testi.content}"</p>
                  <div className="flex items-center gap-5 pt-8 border-t border-white/5 relative">
                    <img src={testi.avatar} alt={testi.name} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div>
                      <p className="font-black text-lg">{testi.name}</p>
                      <p className="text-sm text-purple-400 font-bold uppercase tracking-widest">{testi.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-20 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight">Growth Plans</h2>
              <p className="text-xl text-slate-400 font-medium">Scale your channel with predictable pricing. No hidden fees, just pure value.</p>
            </motion.div>

            <div className="grid gap-10 md:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
              {plans.map((plan, idx) => (
                <motion.div 
                  key={plan.id}
                  {...fadeIn}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActivePlan(plan.id)}
                  className={`relative p-12 rounded-[3rem] cursor-pointer transition-all duration-500 border overflow-hidden ${
                    activePlan === plan.id 
                      ? "bg-white/10 border-purple-500/50 scale-105 z-10 shadow-[0_0_80px_rgba(167,139,250,0.1)]" 
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -right-12 top-8 rotate-45 px-12 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                      Popular
                    </div>
                  )}
                  
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-2xl font-black mb-4 uppercase tracking-widest">{plan.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black">{plan.price}</span>
                        <span className="text-slate-500 text-lg font-bold">/mo</span>
                      </div>
                    </div>

                    <div className="py-4 px-6 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-center">
                      <p className="text-lg font-black text-purple-400">{plan.credits}</p>
                    </div>

                    <ul className="space-y-6">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-4 text-lg text-slate-300 font-medium">
                          <CheckCircle2 className="w-6 h-6 text-purple-500 shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all ${
                      activePlan === plan.id 
                        ? "bg-white text-black shadow-2xl" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}>
                      Get Started
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 sm:px-8 lg:px-16 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full bg-purple-600/10 blur-[180px] rounded-full" />
          </div>
          
          <motion.div 
            {...fadeIn}
            className="mx-auto max-w-6xl relative p-12 lg:p-24 rounded-[4rem] bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-[#020617] border border-white/10 text-center space-y-8"
          >
            <h2 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[1] text-white">
              Stop Guessing. <br />
              <span className="gradient-text">Start Growing.</span>
            </h2>
            <p className="text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
              The algorithm waits for no one. Join the elite creators who are using AI to dominate their niche.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button 
                onClick={() => navigate("/generate")}
                className="px-12 py-6 rounded-2xl bg-white text-black font-black text-xl hover:scale-105 transition-transform shadow-2xl"
              >
                Claim Your Free Credits
              </button>
              <button className="px-12 py-6 rounded-2xl bg-white/5 border border-white/10 font-black text-xl hover:bg-white/10 transition-colors backdrop-blur-xl">
                View Enterprise
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-500 font-bold uppercase tracking-widest text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Payment • Cancel Anytime • No Cards Required</span>
            </div>
          </motion.div>
        </section>

      </div>

      {/* Footer is already in MainLayout */}
    </div>
  );
}