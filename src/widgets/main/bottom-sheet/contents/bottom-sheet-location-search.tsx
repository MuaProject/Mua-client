import { LocationPicker } from '@features/location-picker/ui/location-picker';
import type { LocationSelection } from '@features/location-picker/types';

interface BottomSheetLocationSearchProps {
  value: LocationSelection | null;
  onChange: (value: LocationSelection) => void;
}

export function BottomSheetLocationSearch({
  value,
  onChange,
}: BottomSheetLocationSearchProps) {
  return <LocationPicker value={value} onChange={onChange} />;
}
