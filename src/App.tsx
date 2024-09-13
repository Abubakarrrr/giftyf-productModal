  import React, { useState } from "react";
  import ProductModal from "./Modal"; 

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
  const exampleProduct:Product = {
    name: "Floral Flower Dress",
    brand: "Antisia",
    price: 9.0,
    description:
      "A beautiful floral dress perfect for summer days. Made with lightweight, breathable fabric, this dress features a delicate floral pattern that's perfect for any occasion. The flattering cut and comfortable fit make it a versatile addition to your wardrobe.",
    images: [
      {
        type: "image",
        src: "https://via.placeholder.com/400x400.png?text=Floral+Dress+1",
      },
      {
        type: "image",
        src: "https://via.placeholder.com/400x400.png?text=Floral+Dress+2",
      },
      {
        type: "image",
        src: "https://via.placeholder.com/400x400.png?text=Floral+Dress+3",
      },
      { type: "video", src: "https://example.com/video.mp4" },
      {
        type: "image",
        src: "https://via.placeholder.com/400x400.png?text=Floral+Dress+4",
      },
    
    ],
  };

  const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
      <div className="p-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Open Product Modal
        </button>
        {isModalOpen && (
          <ProductModal
            product={exampleProduct}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    );
  };

  export default App;
