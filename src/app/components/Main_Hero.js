"use client";
import { useState, useEffect } from "react";

const images = [
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
];

export default function MainHero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`carousel image ${i}`}
          className={`absolute inset-0 w-full h-full object-cover filter brightness-75 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
          Your New <span className="text-glow">Foodie</span> Hub
        </h1>
        <p className="text-lg md:text-2xl text-white drop-shadow-md text-center">
          Discover, Review, and Share the Best Bites!
        </p>
      </div>
    </div>
  );
}