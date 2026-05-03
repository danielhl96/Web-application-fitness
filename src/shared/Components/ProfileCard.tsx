interface ProfileCardProps {
  children: React.ReactNode;
}

export default function ProfileCard({ children }: ProfileCardProps) {
  return (
    <div
      className="card w-full items-center justify-center text-xs lg:w-40 h-[5dvh] rounded-xl backdrop-blur-md"
      style={{
        background: 'rgba(15, 23, 42, 0.55)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
        border: '1px solid rgba(99, 179, 237, 0.2)',
      }}
    >
      {children}
    </div>
  );
}
