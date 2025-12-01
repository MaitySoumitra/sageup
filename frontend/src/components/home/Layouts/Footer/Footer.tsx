import React, { useEffect, useState } from "react";
import {
  FacebookLogo,
  TwitterLogo,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Phone,
  EnvelopeSimple,
} from "@phosphor-icons/react";

const Footer: React.FC = () => {
  const [showUnderline, setShowUnderline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUnderline(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const underlineClasses = `text-lg font-semibold mb-4 relative pb-2 inline-block
    ${showUnderline ? "after:animate-growThenShrink" : ""}
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#00b894]`;

  return (
    <footer className="bg-[#1c1c1c] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className={underlineClasses}>SageUp</h3>
            <p className="text-gray-400 text-sm">
              Your trusted platform to discover and connect with the best
              coaching institutes worldwide.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00b894] hover:-translate-y-1"
              >
                <FacebookLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00b894] hover:-translate-y-1"
              >
                <TwitterLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00b894] hover:-translate-y-1"
              >
                <InstagramLogo size={20} weight="fill" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00b894] hover:-translate-y-1"
              >
                <LinkedinLogo size={20} weight="fill" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className={underlineClasses}>Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Library
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className={underlineClasses}>Top Categories</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Engineering Entrance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Medical Entrance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Government Exams
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Study Abroad
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className={underlineClasses}>Contact Us</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} weight="fill" /> 123 Education Street, NY
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} weight="fill" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeSimple size={16} weight="fill" /> info@sageup.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-gray-400 text-xs">
          © 2025 SageUp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
