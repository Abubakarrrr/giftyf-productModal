import React, { useState, useEffect } from "react";
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
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth <= 640);
  const [scrollProgress, setScrollProgress] = useState<number>(
    ((selectedImage + 1) / product.images.length) * 100
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setScrollProgress(((selectedImage + 1) / product.images.length) * 100);
  }, [selectedImage, product.images.length]);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSmallScreen) {
      if (e.deltaY < 0) {
        setSelectedImage((prevIndex) =>
          prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
      } else {
        setSelectedImage((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }
    } else {
      if (e.deltaX > 0) {
        setSelectedImage((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      } else if (e.deltaX < 0) {
        setSelectedImage((prevIndex) =>
          prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white px-10 py-14 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative overflow-y-auto">
        <button
          className="absolute sm:top-8 sm:right-8 top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <div className="flex flex-col md:flex-row max-md:gap-4">
          <div className="md:w-1/2 flex max-sm:flex-col-reverse gap-4 relative">
            <div className="flex sm:flex-col gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[90px] h-[105px] cursor-pointer border ${
                    selectedImage === index ? "border-2 border-black" : ""
                  }`}
                  onClick={() => handleImageClick(index)}
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
            </div>

            <div
              className="relative w-full h-full mb-4 flex justify-center border border-black"
              onWheel={handleScroll}
            >
              {product.images[selectedImage].type === "video" ? (
                <video
                  src={product.images[selectedImage].src}
                  controls
                  className="w-full h-full aspect-video object-cover"
                />
              ) : (
                <img
                  src={product.images[selectedImage].src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}

              {!isSmallScreen && (
                <div className="absolute -right-2 top-0 h-[100%] w-[3px] bg-gray-200">
                  <div
                    className="bg-gray-400 rounded"
                    style={{
                      height: `${scrollProgress}%`,
                      transition: "height 0.3s ease",
                    }}
                  />
                </div>
              )}

              {isSmallScreen && (
                <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-gray-200">
                  <div
                    className="bg-red-400 rounded absolute"
                    style={{
                      width: `${scrollProgress}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
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