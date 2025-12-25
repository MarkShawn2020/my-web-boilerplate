import Image from 'next/image';

type LovwebIconProps = {
  className?: string;
};

const LovwebIcon: React.FC<LovwebIconProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <Image
      src="/logo.svg"
      alt="Lovweb"
      width={32}
      height={32}
      className={className}
    />
  );
};

export { LovwebIcon };
