import { useState } from 'react';
import { useApp } from '../context/useApp';
import { Check, Sparkles, CreditCard, Shield, Database, X, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';

const Pricing = () => {
  const { playSfx, buyCredits, user } = useApp();
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paying, setPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Starter Explorer',
      price: '0',
      credits: 5,
      features: [
        '5 high-fidelity images',
        'Standard generation speed (10-15s)',
        'Standard model architecture',
        'PictoAI logo watermark',
        'Personal use license'
      ],
      recommended: false,
      cta: 'Current Starter Plan'
    },
    {
      id: 'pro',
      name: 'Creative Pro',
      price: '19',
      credits: 150,
      features: [
        '150 credits per month',
        'Ultra-fast generation speed (1.4s)',
        'HD & Creative model selection',
        'Watermark-free high-res downloads',
        'Commercial use license',
        'Prioritized GPU cluster queue'
      ],
      recommended: true,
      cta: 'Upgrade to Pro'
    },
    {
      id: 'premium',
      name: 'Enterprise VIP',
      price: '49',
      credits: 500,
      features: [
        '500 credits per month',
        'Ultra-fast generation speed (1.4s)',
        'All AI models (HD, Fast, Creative, Custom)',
        'Upscale up to 4K resolution',
        'Commercial use + Full IP ownership',
        'Dedicated API access gateway',
        '24/7 VIP artist priority support'
      ],
      recommended: false,
      cta: 'Go Premium'
    }
  ];

  const handleCtaClick = (plan) => {
    playSfx('click');
    if (plan.id === 'free') return;
    setCheckoutPlan(plan);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    playSfx('click');
    setPaying(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Call Context to update credits
    const success = await buyCredits(checkoutPlan.id, checkoutPlan.credits);

    if (success) {
      setPaying(false);
      setCheckoutPlan(null);
      setCardNumber('');
      setExpiry('');
      setCvv('');
      
      // Fire confetti celebration!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#facc15', '#fbbf24', '#ffffff', '#eab308']
      });
    }
  };

  return (
    <section id="pricing" className="relative py-20 bg-cyber-black overflow-hidden border-b border-cyber-border">
      
      {/* Background grids */}
      <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Flexible Monetization</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Upgrade Your Creative Flow
          </h2>
          <p className="text-zinc-400">
            Pick a credit package that matches your design rhythm. All paid plans trigger immediate high-priority GPU access.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onMouseEnter={() => playSfx('hover')}
              className={`glass-panel rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                plan.recommended 
                  ? 'border-primary/40 shadow-glow-lg md:-translate-y-4 hover:border-primary/70' 
                  : 'hover:border-primary/30 hover:shadow-glow'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-black text-cyber-black uppercase tracking-wider flex items-center space-x-1 shadow-glow-yellow">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Most Popular</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1 text-white">
                    <span className="text-3xl font-display font-medium">$</span>
                    <span className="text-5xl font-display font-black tracking-tight">{plan.price}</span>
                    <span className="text-zinc-500 text-sm">/month</span>
                  </div>
                  <div className="mt-3 flex items-center space-x-2 text-primary font-bold text-xs">
                    <Database className="h-4 w-4" />
                    <span>Includes {plan.credits} GPU Credits</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800/60 pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-sm text-zinc-300">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleCtaClick(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                    plan.id === 'free'
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-default'
                      : plan.recommended
                        ? 'bg-primary hover:bg-primary-hover text-cyber-black shadow-glow'
                        : 'bg-transparent border border-zinc-700 text-white hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Futuristic Simulated Checkout Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyber-border-glow bg-cyber-dark p-8 shadow-glow-lg">
            
            {/* Close */}
            <button
              onClick={() => { playSfx('click'); setCheckoutPlan(null); }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <span className="inline-flex rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary mb-3">
                SECURE CHECKOUT
              </span>
              <h3 className="text-2xl font-display font-extrabold text-white">
                Purchase {checkoutPlan.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Amount to charge: <span className="text-primary font-bold">${checkoutPlan.price}.00</span>
              </p>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 flex items-center space-x-3 mb-4">
                <Database className="h-5 w-5 text-primary shrink-0 animate-bounce" />
                <div className="text-xs text-zinc-300">
                  You are buying <span className="text-primary font-extrabold">{checkoutPlan.credits} credits</span>. These will be added instantly to your balance.
                </div>
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder={user?.name || "John Doe"}
                  className="w-full bg-cyber-black border border-zinc-800 focus:border-primary focus:shadow-glow rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xxs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Card Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => {
                      // Formatting CC number (add spaces)
                      const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setCardNumber(val);
                    }}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-cyber-black border border-zinc-800 focus:border-primary focus:shadow-glow rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength="5"
                    value={expiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim();
                      // Remove trailing slash if length is smaller than 3
                      setExpiry(val.endsWith('/') && val.length < 4 ? val.slice(0, -1) : val.substring(0, 5));
                    }}
                    placeholder="MM/YY"
                    className="w-full bg-cyber-black border border-zinc-800 focus:border-primary focus:shadow-glow rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xxs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">CVV Code</label>
                  <input
                    type="password"
                    required
                    maxLength="3"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full bg-cyber-black border border-zinc-800 focus:border-primary focus:shadow-glow rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-700 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-zinc-500 py-2">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <span>Simulated SSL Encrypted sandbox payment. Click to complete instant transaction.</span>
              </div>

              <button
                type="submit"
                disabled={paying}
                onMouseEnter={() => playSfx('hover')}
                className="w-full flex justify-center items-center py-3.5 bg-primary hover:bg-primary-hover text-cyber-black font-extrabold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50"
              >
                {paying ? (
                  <Loader className="h-5 w-5 animate-spin text-cyber-black" />
                ) : (
                  `Pay $${checkoutPlan.price}.00 Now`
                )}
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

export default Pricing;
