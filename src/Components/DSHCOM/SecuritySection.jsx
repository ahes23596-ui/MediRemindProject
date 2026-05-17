import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

export default function SecuritySection() {
  const items = [
    {
      icon: <ShieldCheck size={22} />,
      title: "HIPAA Compliant",
      desc: "We strictly adhere to healthcare privacy standards and regulations.",
    },
    {
      icon: <Lock size={22} />,
      title: "Bank-Level Encryption",
      desc: "Your data is protected with advanced encryption at all times.",
    },
  ];

  return (
    <section className="bg-gray-100 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Your Health Data is Secure
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 max-w-2xl mx-auto mb-12">
          We prioritize your privacy with industry-standard security measures,
          ensuring your medical information stays private.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300 text-left"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-6">
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>

              <p className="text-gray-500 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
