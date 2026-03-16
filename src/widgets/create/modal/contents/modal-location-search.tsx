import { LocationPicker } from '@features/location-picker/ui/location-picker';
import type { LocationSelection } from '@features/location-picker/types';

interface ModalLocationSearchProps {
  value: LocationSelection | null;
  onChange: (value: LocationSelection) => void;
}

export function ModalLocationSearch({
  value,
  onChange,
}: ModalLocationSearchProps) {
  return (
    <LocationPicker
      value={value}
      onChange={onChange}
      inputSize="ssm"
      inputPlaceholder="예) 역삼동"
      containerClassName="flex flex-col gap-[1.2rem] px-[2.4rem] pb-[1.6rem]"
      searchRowClassName="flex items-center gap-[0.8rem]"
      mapClassName="relative h-[16rem] w-full overflow-hidden rounded-[16px] border border-gray-200"
    />
  );
}
