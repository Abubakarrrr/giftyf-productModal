import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface Product {
  name: string;
  brand: string;
  price: number;
  description: string;
  images: MediaItem[];
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState<number>(0);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  // Ref to accumulate the scroll delta
  const scrollDeltaRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const isSmallScreen = window.innerWidth < 640; // Determine if the screen is small (sm)

  const totalThumbnails = 3; // Maximum number of thumbnails to show at a time
  const numberOfImages = product.images.length;

  const handleImageClick = (index: number) => {
    setSelectedImage(index); // Set the selected image directly
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // Handle mouse wheel scrolling
  const handleWheelScroll = (event: WheelEvent) => {
    event.preventDefault(); // Prevent default scrolling behavior

    scrollDeltaRef.current += event.deltaY;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a timeout to check the accumulated scroll delta
    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollDeltaRef.current <= -100) {
        setThumbnailStartIndex((prev) => Math.max(0, prev - 1)); // Scroll up
      } else if (scrollDeltaRef.current >= 100) {
        setThumbnailStartIndex((prev) => Math.min(prev + 1, numberOfImages - totalThumbnails)); // Scroll down
      }

      scrollDeltaRef.current = 0; // Reset scroll delta after handling
    }, 150); // Adjust this value for debounce timing
  };

  // Handle touch move for swiping on small screens
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current !== null) {
      const touchEndX = event.touches[0].clientX;
      const deltaX = touchEndX - touchStartXRef.current;

      if (Math.abs(deltaX) > 30) { // Threshold for swipe
        setThumbnailStartIndex((prev) =>
          deltaX > 0
            ? Math.max(0, prev - 1) // Swipe right (scroll up)
            : Math.min(prev + 1, numberOfImages - totalThumbnails) // Swipe left (scroll down)
        );
        touchStartXRef.current = null; // Reset touch start position
      }
    }
  };

  // Add and clean up event listener for mouse wheel scrolling
  useEffect(() => {
    window.addEventListener("wheel", handleWheelScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheelScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current); // Clear timeout on unmount
      }
    };
  }, []);

  // Determine the visible thumbnails based on the current thumbnail start index
  const visibleThumbnails = product.images.slice(
    thumbnailStartIndex,
    Math.min(thumbnailStartIndex + totalThumbnails, numberOfImages)
  );

  // Calculate the progress percentage for the vertical bar
  const progressPercentage = ((thumbnailStartIndex / Math.max(1, numberOfImages - totalThumbnails)) * 100).toFixed(2);

  // Calculate the horizontal progress percentage
  const horizontalProgressPercentage = ((thumbnailStartIndex / Math.max(1, numberOfImages - totalThumbnails)) * 100).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white sm:px-10 px-6 py-12 rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden relative max-sm:overflow-y-auto">
        <button
          className="absolute sm:top-8 sm:right-8 top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <div className="flex flex-col md:flex-row max-md:gap-4">
          <div className="md:w-1/2 flex max-sm:flex-col-reverse gap-4 relative">
            {/* Thumbnail Grid with Progress Bar */}
            <div className="flex sm:flex-col gap-2 relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
              {/* Vertical Progress Bar for larger screens */}
              {!isSmallScreen && (
                <div className="absolute right-[-10px] top-0 h-[330px] w-[3px] bg-gray-300 rounded">
                  <div
                    className="bg-gray-500 rounded"
                    style={{ height: `${progressPercentage}%` }}
                  />
                </div>
              )}

              {visibleThumbnails.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[90px] h-[105px] cursor-pointer border ${
                    selectedImage === index + thumbnailStartIndex
                      ? "border-2 border-black"
                      : ""
                  }`}
                  onClick={() => handleImageClick(index + thumbnailStartIndex)}
                >
                  {image.type === "video" ? (
                    <video
                      src={image.src}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={image.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}

              {/* Horizontal Progress Bar for smaller screens */}
              {isSmallScreen && (
                <div className="absolute top-[-15px] right-0 w-full h-1 bg-gray-300 rounded">
                  <div
                    className="bg-gray-500 rounded"
                    style={{ width: `${horizontalProgressPercentage}%` }}
                  />
                </div>
              )}
            </div>

            {/* Main Image/Video Viewer */}
            <div className="relative h-[330px] w-full mb-4 flex justify-center border border-black">
              {product.images[selectedImage].type === "video" ? (
                <video
                  src={product.images[selectedImage].src}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={product.images[selectedImage].src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="md:w-1/2 md:px-6">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.brand}</p>
            <p className="text-xl font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>
            <button className="bg-black text-white py-3 px-4 text-bold mb-4 w-[70%]">
              ADD TO CART
            </button>
            <div className="border-t border-b border-gray-400 pt-3 pb-3">
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={toggleDescription}
              >
                <span className="font-semibold">Description</span>
                {showDescription ? (
                  <FaChevronUp size={20} />
                ) : (
                  <FaChevronDown size={20} />
                )}
              </button>
              {showDescription && (
                <div className="mt-2 pb-4 border-gray-200">
                  <p className="text-gray-600 text-justify">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
