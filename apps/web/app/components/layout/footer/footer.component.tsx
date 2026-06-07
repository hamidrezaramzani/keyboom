import { footerSections } from "./footer.constant";
import { Logo } from "../../ui";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo />
            <p className="text-gray-500 text-sm">
              مدیریت هوشمند اشتراک‌های شما
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-sm font-medium mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="hover:text-gray-300 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-600 text-xs pt-8 border-t border-gray-800">
          © {currentYear} KeyBoom. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
};
