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
  const [showDescription, setShowDescription] = useState<boolean>(false);
 

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

 

  const totalThumbnails = 3;
  const visibleThumbnails: any[] = [];
  const numberOfImages = product.images.length;

  if (numberOfImages <= totalThumbnails) {
    for (let i = 0; i < numberOfImages; i++) {
      visibleThumbnails.push(product.images[i]);
    }
  } else {
    for (let i = 0; i < totalThumbnails; i++) {
      const index = (selectedImage - 1 + i + numberOfImages) % numberOfImages;
      visibleThumbnails.push(product.images[index]);
    }
  }


  

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
            <div
              className="flex sm:flex-col gap-2"
          
            >
              {visibleThumbnails.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[90px] h-[105px] cursor-pointer border  ${
                    selectedImage ===
                    (selectedImage - 1 + index + product.images.length) %
                      product.images.length
                      ? "border-2 border-black"
                      : ""
                  }`}
                  onClick={() =>
                    handleImageClick(
                      (selectedImage - 1 + index + product.images.length) %
                        product.images.length
                    )
                  }
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
              className="relative h-[330px] w-full mb-4 flex justify-center border border-black"
           
            >
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
