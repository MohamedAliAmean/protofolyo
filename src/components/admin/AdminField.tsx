export function AdminField({
  label,
  name,
  defaultValue = "",
  type = "text",
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  rows?: number;
}) {
  const className =
    "mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-ink outline-none focus:border-accent/50";

  return (
    <label className="block text-sm font-medium text-navy-deep">
      {label}
      {rows ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          className={className}
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          className={className}
        />
      )}
    </label>
  );
}
