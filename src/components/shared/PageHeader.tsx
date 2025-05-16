interface PageHeaderProps {
  primaryText: string;
  secondaryText?: string;
}

export function PageHeader({ primaryText, secondaryText }: PageHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mt-5">
        <strong>{primaryText}</strong>
      </h1>
      <p className="text-md p-5">{secondaryText}</p>
    </div>
  );
}
