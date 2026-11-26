const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
      HelpDesk Pro &bull; Support Ticket Management System &bull; {CURRENT_YEAR}
    </footer>
  );
};

export default Footer;
