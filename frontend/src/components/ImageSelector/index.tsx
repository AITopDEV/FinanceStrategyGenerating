import './styles.css';
import React, { useRef, useEffect, useMemo } from 'react';

interface ImageSelectorProps {
  onSelect: (imageIndex: number) => void;
  addressImages: {
    imagesData: string[];
    selectedImage: number;
  };
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  onSelect,
  addressImages,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageUrls = useMemo(() => {
    return addressImages.imagesData.map(
      (item) =>
        `${import.meta.env.VITE_SERVER_URL}/download?full_path=${item}&d=${new Date().toLocaleTimeString()}`,
    );
  }, [addressImages.imagesData]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      element.scrollLeft += e.deltaY;
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleImageToggle = (imageUrl: string) => {
    if (
      addressImages.selectedImage === addressImages.imagesData.indexOf(imageUrl)
    ) {
      onSelect(-1);
    } else {
      onSelect(addressImages.imagesData.indexOf(imageUrl));
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div
        ref={scrollContainerRef}
        className="custom-scrollbar overflow-x-auto pb-6"
      >
        <div className="mt-4 flex gap-2">
          {addressImages.imagesData.map((image, index) => (
            <div key={index} className="flex-none">
              <label
                className={`relative flex cursor-pointer flex-col items-center rounded-lg border-2 hover:border-[#109bff]
                  ${
                    addressImages.selectedImage === index
                      ? 'border-[#109bff] bg-white shadow-[0_0_0_1px_#109bff]'
                      : 'border-gray-200 bg-white'
                  }`}
              >
                <div className="absolute left-4 top-4 mb-2">
                  <input
                    type="checkbox"
                    name="imageSelect"
                    className="peer hidden"
                    checked={addressImages.selectedImage === index}
                    onChange={(e) => handleImageToggle(image)}
                  />
                  <div
                    className={`size-4 rounded-full border-2 border-[#109bff] bg-white
                    ${addressImages.selectedImage === index ? 'border-4' : ''}`}
                  />
                </div>
                <img
                  src={imageUrls[index]}
                  alt={`Image ${index}`}
                  className="mt-8 h-[150px] w-[200px] rounded-md object-cover p-4"
                />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
