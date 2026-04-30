import { FooterSection } from "./footer.type";

export const footerSections: FooterSection[] = [
  {
    title: "محصول",
    links: [
      { name: "قابلیت‌ها", href: "#features" },
      { name: "تعرفه‌ها", href: "#pricing" },
      { name: "سوالات متداول", href: "#" },
    ],
  },
  {
    title: "شرکت",
    links: [
      { name: "درباره ما", href: "/about" },
      { name: "بلاگ", href: "#" },
      { name: "تماس با ما", href: "/contact" },
    ],
  },
  {
    title: "قوانین",
    links: [
      { name: "حریم خصوصی", href: "#" },
      { name: "شرایط استفاده", href: "#" },
    ],
  },
];
