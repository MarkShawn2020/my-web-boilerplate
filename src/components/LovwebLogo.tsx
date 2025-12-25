import Image from 'next/image';

type LovwebLogoProps = {
  className?: string;
};

const LovwebLogo: React.FC<LovwebLogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Lovweb"
        width={32}
        height={32}
        className="h-full w-auto"
      />
      <span className="font-bold text-xl tracking-tight">LOVWEB</span>
    </div>
  );
};

export { LovwebLogo };
