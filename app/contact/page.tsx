"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  MessagesSquare,
} from "lucide-react";
import { Input, Button, Footer, Navbar } from "@/app/components";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    setTimeout(() => {
      console.log("فرم تماس:", formData);
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSubmitStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950">
      <Navbar />
      <div className="relative pt-24 pb-12 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-indigo-400">با ما در ارتباط باش</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              تماس با ما
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            سوال، پیشنهاد یا انتقادی داری؟ خوشحال می‌شیم بشنویم.
          </p>
        </div>
      </div>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-6">ارسال پیام</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  label="نام و نام خانوادگی"
                  placeholder="علی حسینی"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="email"
                  type="email"
                  label="ایمیل"
                  placeholder="ali@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  name="subject"
                  label="موضوع"
                  placeholder="سوال درباره اشتراک‌ها"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    پیام شما
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="پیام خود را بنویسید..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  icon
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      ارسال پیام
                    </>
                  )}
                </Button>

                {submitStatus === "success" && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    پیام شما با موفقیت ارسال شد. به زودی باهات تماس می‌گیریم.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    مشکلی پیش اومد. لطفاً دوباره تلاش کن.
                  </div>
                )}
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold text-white mb-6">
                  اطلاعات تماس
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Mail className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">ایمیل</p>
                      <a
                        href="mailto:hello@keyboom.app"
                        className="text-white hover:text-indigo-400 transition-colors"
                      >
                        hello@keyboom.app
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Phone className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">تلفن</p>
                      <a
                        href="tel:+000000000"
                        className="text-white hover:text-indigo-400 transition-colors"
                      >
                        000000000
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <MessagesSquare className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">تلگرام</p>
                      <p className="text-white">hamidrezaramzani</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-3">
                  ساعات پاسخگویی
                </h3>
                <div className="space-y-2 text-gray-400 text-sm">
                  <p>شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر</p>
                  <p>پنجشنبه: ۹ صبح تا ۱۲ ظهر</p>
                  <p>جمعه‌ها: تعطیل</p>
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-3">
                  ما را دنبال کنید
                </h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-500/20 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-500/20 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-500/20 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
