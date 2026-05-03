type Props = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export function AdminHeader({ title, subtitle, action }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#0A1628]">{title}</h1>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
