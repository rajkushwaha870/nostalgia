import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto p-6 sm:p-10 bg-[#F3E5CA] text-[#24150F] rounded-xs shadow-2xl border-2 border-[#C88A3D]/40 paper-texture">
      {/* Decorative Stamp and Letter Corner Detail */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div className="border-2 border-[#B9472F] px-3 py-1 bg-[#E8D4B4] rounded-xs text-[10px] font-mono tracking-widest text-[#B9472F] font-bold uppercase rotate-3 shadow-xs">
          AIR MAIL • PAR AVION
        </div>
      </div>

      {/* Vintage Stamp Accent */}
      <div className="absolute -top-3 left-8 w-16 h-5 bg-[#E0CFB3] border-l border-r border-[#C88A3D]/40 rotate-[-2deg] opacity-80 pointer-events-none" />

      {/* Inner Decorative Dashed Border */}
      <div className="border border-dashed border-[#B9472F]/35 p-6 sm:p-8 rounded-xs">
        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#B9472F]/15 border border-[#B9472F]/40 text-[#B9472F] mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#3A2116] tracking-wide">
              Message received.
            </h3>
            <p className="font-serif italic text-lg text-[#3A2116]/85 max-w-md mx-auto leading-relaxed">
              We'll keep it safe in the archive.
            </p>
            <div className="pt-6">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#B9472F] hover:bg-[#C94B32] text-[#F1D7A3] font-mono text-xs tracking-widest uppercase rounded-xs transition-colors shadow-md cursor-pointer border border-[#F1D7A3]/30"
              >
                SEND ANOTHER MEMORY
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="name"
                className="block text-xs font-mono font-bold tracking-widest text-[#3A2116] uppercase"
              >
                Name <span className="text-[#B9472F]">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className={`w-full px-4 py-2.5 bg-[#FAF2E4] text-[#24150F] placeholder-[#3A2116]/40 font-serif text-base border ${
                  errors.name
                    ? 'border-[#B9472F] ring-1 ring-[#B9472F]'
                    : 'border-[#C88A3D]/50 focus:border-[#B9472F] focus:ring-1 focus:ring-[#B9472F]'
                } rounded-xs outline-none transition-all shadow-inner`}
              />
              {errors.name && (
                <p className="text-xs font-mono text-[#B9472F] mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email"
                className="block text-xs font-mono font-bold tracking-widest text-[#3A2116] uppercase"
              >
                Email <span className="text-[#B9472F]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. ramesh@radio.in"
                className={`w-full px-4 py-2.5 bg-[#FAF2E4] text-[#24150F] placeholder-[#3A2116]/40 font-serif text-base border ${
                  errors.email
                    ? 'border-[#B9472F] ring-1 ring-[#B9472F]'
                    : 'border-[#C88A3D]/50 focus:border-[#B9472F] focus:ring-1 focus:ring-[#B9472F]'
                } rounded-xs outline-none transition-all shadow-inner`}
              />
              {errors.email && (
                <p className="text-xs font-mono text-[#B9472F] mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="message"
                className="block text-xs font-mono font-bold tracking-widest text-[#3A2116] uppercase"
              >
                Message <span className="text-[#B9472F]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Share a song, memory or idea..."
                className={`w-full px-4 py-2.5 bg-[#FAF2E4] text-[#24150F] placeholder-[#3A2116]/40 font-serif text-base border ${
                  errors.message
                    ? 'border-[#B9472F] ring-1 ring-[#B9472F]'
                    : 'border-[#C88A3D]/50 focus:border-[#B9472F] focus:ring-1 focus:ring-[#B9472F]'
                } rounded-xs outline-none transition-all shadow-inner resize-y min-h-[110px]`}
              />
              {errors.message && (
                <p className="text-xs font-mono text-[#B9472F] mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#B9472F] hover:bg-[#C94B32] active:bg-[#8F3025] text-[#F1D7A3] font-mono text-xs tracking-widest uppercase font-bold rounded-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 border border-[#F1D7A3]/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>SEND MESSAGE</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
