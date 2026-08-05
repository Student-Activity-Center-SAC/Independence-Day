// Admin pages get their own layout — no Navbar, no SmoothScroll
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
