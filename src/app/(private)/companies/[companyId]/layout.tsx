

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Renderizar a Sidebar com botões personalizados, se necessário */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
