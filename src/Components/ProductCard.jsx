import React from "react";
import Ibuprofen from "../assets/Ibuprofen.png";
import NaproxenSodium from "../assets/NaproxenSodium.png";
import Aspirin from "../assets/Aspirin.png";
import Acetaminophen from "../assets/Acetaminophen.png";

function ProductCard() {
  const products = [
    {
      name: "Ibuprofen - Advil",
      size: "200 mg - 50 Tablets",
      price: "$9.99",
      image: Ibuprofen,
    },
    {
      name: "Acetaminophen - Tylenol",
      size: "500mg - 100 Capsules",
      price: "$12.49",
      image: Acetaminophen,
    },
    {
      name: "Aspirin - Bayer",
      size: "81mg - 120 Tablets",
      price: "$7.99",
      image: Aspirin,
    },
    {
      name: "Naproxen Sodium - Aleve",
      size: "220mg - 80 Caplets",
      price: "$14.29",
      image: NaproxenSodium,
    },
  ];

  return (
    <section className="py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">
        Our Products
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-2xl duration-300 hover:shadow-l flex flex-col"
          >
            {/* Image Container */}
            <div className="w-full h-52 flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-[#1e2939]">
                {product.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {product.size}
              </p>

              <p className="text-lg font-bold text-blue-600 mt-3 mb-4">
                {product.price}
              </p>

              {/* Button */}
              <button className="mt-auto bg-blue-600 text-white py-2 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:scale-105 cursor-pointer">
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductCard;
