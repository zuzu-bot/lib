import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT US', href: '#about' },
    { label: 'RESOURCES', href: '#resources' },
    { label: 'REMOTE ACCESS', href: '#contact' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="font-sans bg-slate-50 text-slate-900">
      <header id="home" className="z-40 bg-slate-950 text-white shadow-md shadow-black/30 border-b border-slate-900">
        <div className="px-4 sm:px-8 lg:px-14 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/SATI_Vidisha.jpg" alt="logo" className="w-12 h-12 sm:w-14 sm:h-14 mr-3 rounded-md object-cover" />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-wide">SATI Library</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-slate-700 text-slate-100 hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <ul className="list-none flex flex-wrap justify-center gap-5 text-sm m-0 p-0">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-amber-300 no-underline text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              to="/login"
              className="bg-amber-400 text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-amber-300 transition-colors no-underline"
            >
              LOGIN
            </Link>
          </nav>
        </div>

        {menuOpen && (
          <nav className="md:hidden px-4 pb-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <ul className="list-none m-0 p-0 space-y-1 text-sm">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="block px-3 py-2 rounded-md text-slate-100 hover:bg-slate-800 hover:text-amber-300 no-underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                onClick={closeMenu}
                className="mt-3 block text-center bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-amber-300 transition-colors no-underline"
              >
                LOGIN
              </Link>
            </div>
          </nav>
        )}
      </header>

      <section className="relative min-h-[68vh] sm:min-h-[78vh] lg:min-h-[84vh] overflow-hidden">
        <img
          src="/Grand library with wooden bookshelves.png"
          alt="library"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_38%] scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-slate-800/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/20" />
        <div className="relative z-10 min-h-[68vh] sm:min-h-[78vh] lg:min-h-[84vh] px-4 sm:px-8 lg:px-16 flex items-center">
          <div className="max-w-2xl text-white">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs sm:text-sm font-semibold border border-amber-300/30">
              Smart Digital Library
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-sm">Library Portal for Students and Admin</h1>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-200 max-w-xl">
              Access catalog, issue tracking, reports, and account management from one clean interface.
            </p>
            <div className="mt-6">
              <Link to="/login" className="inline-flex items-center bg-amber-400 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-300 shadow-lg shadow-slate-900/30 no-underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-4 sm:px-8 lg:px-16 py-14 bg-slate-100 scroll-mt-28">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <h2 className="mb-5 text-3xl sm:text-5xl font-extrabold text-center text-slate-950 opacity-100">About us</h2>
          <p className="mb-5 leading-relaxed text-base sm:text-lg text-slate-700">
            The Samrat Ashok Technological Institute (SATI) Library is a central academic facility that supports the learning and research needs of students and faculty. It houses a vast collection of textbooks, reference materials, journals, and competitive exam books across various engineering and science disciplines. In addition to its physical resources, the library provides access to digital content such as e-books and online journals, enabling users to explore knowledge beyond traditional boundaries. The library also features a शांत and well-equipped reading hall that offers a comfortable environment for focused study. With facilities like computer access, internet connectivity, and an organized catalog system, users can easily search and utilize resources. Overall, the SATI Library plays a vital role in promoting academic excellence, encouraging research, and creating a productive learning atmosphere within the institute.
          </p>
          <p className="leading-relaxed text-base sm:text-lg text-slate-700">
            The origin of the National Library of India is traced to the former
            Calcutta Public Library.
          </p>
        </div>
      </section>

      <section id="resources" className="px-4 sm:px-8 lg:px-16 py-16 bg-slate-200 scroll-mt-28">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl mb-8 text-slate-800 text-center font-bold">Our Facilities</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
            <p className="text-base sm:text-lg leading-relaxed text-slate-700 mb-6">
              The Samrat Ashok Technological Institute (SATI) Library provides a well-maintained and peaceful reading environment where students can focus on their studies without distractions. It houses a wide collection of textbooks, reference books, and journals across various disciplines.
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-slate-700">
              In addition to physical resources, the library offers modern digital facilities such as computer systems with internet access, enabling students to explore e-books and online journals. The organized system ensures easy access to resources along with smooth book issue and return.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-amber-500/90 py-5 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-6">
          <img src="/Screenshot 2026-04-10 021117.png" alt="partner" className="h-10 sm:h-12 object-contain" />
          <img src="/Screenshot 2026-04-10 021124.png" alt="partner" className="h-10 sm:h-12 object-contain" />
          <img src="/Screenshot 2026-04-10 021129.png" alt="partner" className="h-10 sm:h-12 object-contain" />
          <img src="/Screenshot 2026-04-10 021138.png" alt="partner" className="h-10 sm:h-12 object-contain" />
          <img src="/download.png" alt="partner" className="h-10 sm:h-12 object-contain" />
        </div>
      </section>

      <footer id="contact" className="bg-slate-950 text-slate-100 px-4 sm:px-8 lg:px-16 py-14 scroll-mt-28 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          <div>
            <h3 className="text-lg font-bold tracking-wide text-amber-300 mb-4">Quick Links</h3>
            <ul className="list-none m-0 p-0 space-y-2 text-sm">
              <li><a href="#home" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Home</a></li>
              <li><a href="#about" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">About Us</a></li>
              <li><a href="#resources" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Library Catalogue</a></li>
              <li><a href="#resources" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Digitized Books</a></li>
              <li><a href="#contact" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">RTI</a></li>
              <li><a href="#contact" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Recruitment Rules & Vacancy Position</a></li>
              <li><a href="#contact" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Order / Circular</a></li>
              <li><a href="#contact" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Annual Report</a></li>
            </ul>
          </div>

          <div className="lg:px-8 lg:border-x border-slate-800">
            <h3 className="text-lg font-bold tracking-wide text-amber-300 mb-4">Portal Access</h3>
            <ul className="list-none m-0 p-0 space-y-2 text-sm">
              <li><a href="#resources" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Tenders</a></li>
              <li><a href="#resources" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">For Publishers</a></li>
              <li><a href="#about" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">National Library Blog</a></li>
              <li><a href="#contact" className="text-slate-200 no-underline hover:text-amber-300 transition-colors">Contact Us</a></li>
              <li><Link to="/login?role=admin" className="no-underline text-slate-200 hover:text-amber-300 transition-colors">Admin Login</Link></li>
              <li><Link to="/login?role=student" className="no-underline text-slate-200 hover:text-amber-300 transition-colors">Student Login</Link></li>
            </ul>
            <img src="/SATI_Vidisha.jpg" alt="sati" className="mt-6 w-20 h-20 rounded-lg object-cover ring-2 ring-amber-300/40" />
          </div>

          <div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <h3 className="text-xl font-bold tracking-wide text-amber-300">Feedback</h3>
              <p className="mt-2 text-sm text-slate-300">Share your experience with the library portal. Your feedback helps us improve.</p>

              <form className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="feedback-name" className="block text-xs font-semibold uppercase tracking-wide text-slate-300 mb-1">Name</label>
                    <input
                      id="feedback-name"
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-500 px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-email" className="block text-xs font-semibold uppercase tracking-wide text-slate-300 mb-1">Email</label>
                    <input
                      id="feedback-email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-500 px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="feedback-message" className="block text-xs font-semibold uppercase tracking-wide text-slate-300 mb-1">Message</label>
                  <textarea
                    id="feedback-message"
                    placeholder="Write your feedback here..."
                    className="w-full min-h-28 resize-y bg-slate-100 text-slate-900 placeholder:text-slate-500 px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="w-full sm:w-auto bg-amber-400 text-slate-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-300 transition-colors"
                >
                  Send Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-black text-slate-300 text-center p-4 text-sm border-t border-slate-900">
        <p>
          © {new Date().getFullYear()} SATI Library Management System. All rights reserved. Content is provided for academic and informational purposes only.
        </p>
      </div>
    </div>
  );
};

export default Home;
