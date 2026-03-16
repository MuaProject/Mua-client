import {
  BottomSheetContext,
  useBottomSheetContext,
} from '@shared/hooks/use-bottom-sheet-context';
import { useEffect, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@shared/utils/cn';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Overlay() {
  const { onClose } = useBottomSheetContext();

  return <div onClick={onClose} className="fixed inset-0 bg-black/30" />;
}

function BodyScrollLock() {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
 
  return null;
}

function Root({ isOpen, onClose, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <BottomSheetContext.Provider value={{ onClose }}>
      <BodyScrollLock />
      <div className="fixed inset-0 z-40">{children}</div>
    </BottomSheetContext.Provider>
  );
}

const containerVariants = cva(
  'fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-50',
  {
    variants: {
      size: {
        sm: 'h-[19.8rem]',
        md: 'h-[40rem]',
      },
    },
  },
);

function Container({
  size,
  children,
}: {
  size?: 'sm' | 'md';
  children: ReactNode;
}) {
  return <div className={cn(containerVariants({ size }))}>{children}</div>;
}

function Header({
  title,
  rightAction,
}: {
  title: string;
  rightAction?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center h-[2.4rem] justify-center">
        <div className="w-[4rem] h-[0.4rem] rounded-full bg-gray-200" />
      </div>
      <div className="flex h-[3rem] items-center justify-center px-[1rem] py-[0.4rem] relative">
        <p className="typo-h3">{title}</p>

        {rightAction && (
          <button className="absolute typo-body3 text-gray-400 right-[2.4rem] w-[2.4rem] h-[2.1rem]">
            {rightAction}
          </button>
        )}
      </div>
    </div>
  );
}
function Content({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
const BottomSheet = {
  Root,
  Overlay,
  Container,
  Header,
  Content,
};

export default BottomSheet;
