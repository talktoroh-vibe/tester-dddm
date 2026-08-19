import React from 'react';

export const Footer: React.FC = () => {
  const footerLinks = [
    'About',
    'Features',
    'Pricing',
    'Social Network',
    'Terms of use',
    'Privacy policy',
    'Cookie policy',
  ];

  return (
    <footer className="bg-[#0f131e] dark:bg-[#131722] border-t border-[#363A45] mt-auto">
      <div className="w-full py-12 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <span className="font-headline text-lg font-bold text-[#dfe2f2]">TradingView</span>
          <span className="font-body text-xs text-[#8d90a2]">
            © 2024 TradingView, Inc. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-center">
          {footerLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="font-body text-[11px] font-bold uppercase tracking-wider text-[#8d90a2] hover:text-[#dfe2f2] hover:underline decoration-[#2962FF] opacity-90 hover:opacity-100 transition-opacity"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};
