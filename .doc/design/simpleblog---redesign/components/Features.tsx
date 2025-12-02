import React from 'react';
import { PenLine, Zap, Lock, MoveRight } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "Markdown Editor",
    description: "A clean, intuitive writing environment that gets out of your way. No distractions, just you and your words.",
    icon: PenLine,
    tag: "The Craft"
  },
  {
    title: "Instant Publish",
    description: "Go from draft to live in seconds. Share your ideas with the world without any friction or complex pipelines.",
    icon: Zap,
    tag: "Velocity"
  },
  {
    title: "Own Your Content",
    description: "You have full control over your data. Export your content anytime, no questions asked. No lock-in.",
    icon: Lock,
    tag: "Sovereignty"
  }
];

const Features: React.FC = () => {
  return (
    <section className="relative py-32 bg-white border-t border-stone-100" id="features">
       {/* Background vertical lines */}
       <div className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(to right, #f5f5f4 1px, transparent 1px)',
              backgroundSize: '80px 100%'
            }}>
       </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="text-burnt font-semibold tracking-widest text-xs uppercase mb-4 block">The Toolkit</span>
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
            Everything you need to <br/>write deeper.
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`
                group relative bg-white p-8 pt-12 min-h-[320px] 
                border border-stone-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]
                hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300
                flex flex-col justify-between
                ${index === 1 ? 'md:-translate-y-8' : ''} 
              `}
            >
              {/* Colored Top Border accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-100 via-orange-300 to-orange-100 opacity-50"></div>
              
              {/* Tag style */}
              <div className="absolute top-0 left-6 -translate-y-1/2 bg-paper border border-stone-200 px-3 py-1 shadow-sm text-[10px] uppercase font-bold tracking-widest text-stone-500">
                {feature.tag}
              </div>

              <div>
                <div className="w-12 h-12 mb-6 text-burnt bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-burnt group-hover:text-white transition-colors duration-300">
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif text-charcoal mb-4 group-hover:text-burnt transition-colors">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed font-light text-sm">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100 flex items-center text-burnt text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
                Learn more <MoveRight size={14} className="ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;