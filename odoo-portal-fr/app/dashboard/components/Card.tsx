"use client";

interface CardProps {
  title: string;
  description: string;
  value?: string;
  gradient: string;
  onClick?: () => void;
}

export default function Card({
  title,
  description,
  value,
  gradient,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-2xl p-6 shadow-2xl cursor-pointer
                 bg-white/20 backdrop-blur-xl
                 hover:shadow-3xl transform transition-all
                 hover:-translate-y-1"
    >
      {/* Gradient background */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-80 bg-gradient-to-br ${gradient}`}
      />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-white">{title}</h2>

        <p className="text-white/80 mt-2">{description}</p>

        {value && (
          <p className="text-3xl font-extrabold text-white mt-4">
            {value}
          </p>
        )}

        <div className="mt-4 text-white font-semibold text-sm">
          View details →
        </div>
      </div>
    </div>
  );
}
