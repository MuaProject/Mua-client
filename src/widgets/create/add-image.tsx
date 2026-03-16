import { useState } from 'react';
import CameraIcon from '@shared/assets/icon/camera.svg?react';
import XIcon from '@shared/assets/icon/x.svg?react';

interface AddImageProps {
  max?: number; // 최대 업로드 개수 (기본 5)
  disabled?: boolean;
  onChange?: (file: File) => void;
}

export function AddImage({ max = 5, disabled, onChange }: AddImageProps) {
  const [images, setImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (images.length >= max) return;

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    setImages((prev) => [...prev, url]);

    onChange?.(file); // 🔥 부모로 file 전달

    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="flex flex-col gap-[0.8rem] px-[2.4rem]">
      <span className="typo-body1">사진 추가</span>

      <div className="flex gap-[1.2rem] flex-wrap">
        {/* 업로드 버튼 */}
        {images.length < max && (
          <label
            className={`
              flex flex-col items-center justify-center
              w-[6rem] h-[6rem] gap-[0.4rem]
              border rounded-[12px] cursor-pointer
              ${disabled ? 'border-gray-100 text-gray-300' : 'border-gray-200'}
            `}
          >
            <CameraIcon width="2.4rem" height="2.4rem" />
            <span className="typo-caption">
              사진 {images.length}/{max}
            </span>

            <input
              type="file"
              accept="image/*"
              hidden
              disabled={disabled}
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* 미리보기 이미지들 */}
        {images.map((src, index) => (
          <div key={src} className="relative w-[6rem] h-[6rem]">
            <img
              src={src}
              alt="uploaded"
              className="w-full h-full object-cover rounded-[12px]"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="
                absolute top-[-0.4rem] right-[-0.4rem]
                w-[1.6rem] h-[1.6rem]
                flex items-center justify-center
                bg-black/60 rounded-full
              "
            >
              <XIcon width="1rem" height="1rem" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
