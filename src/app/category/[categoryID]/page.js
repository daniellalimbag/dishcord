"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function category({params}) {
    
    const[restaurants, setRestaurants] = useState([]);
    const tag = params.categoryID



    useEffect(() => {
        console.log("resto works")
        const fetchRestaurantData = async () => {
            try {
              const response = await fetch('/api/restaurants');
              const data = await response.json();
              const foundRestaurant = data.filter(
                (item) => item.tags.includes(tag)
              );
      
              setRestaurants(foundRestaurant);
              console.log(data)
            } catch (error) {
              console.error('Error fetching restaurant data:', error);
            }
          };
        fetchRestaurantData();
    }, []);
                        

    return (
        <>
            <div className="px-[3%] pt-[1%] bg-background">
                <div className="relative flex flex-col z-[1]">
                    <h1 className="relative flex text-[24px] mt-[90px] font-bold w-full justify-left mb-[10px]">
                    Category:<b className="text-highlight ml-2">{tag}</b>
                    </h1>
                    <hr className="border-solid border-[1px] border-accent w-[50%] mb-[20px]"/>
                    {restaurants?.length > 0 && restaurants.map(resto => (
                        <div className="relative bg-background border border-accent rounded-[30px] w-[40%] mx-[0.5%] mb-[15px] overflow-x-hidden z-[2] transition-shadow duration-200 ease-in-out hover:shadow-lg hover:scale-105">
                            <Link href={`/restaurants/${resto.name}`}>
                                <hr />
                                <div className="grid grid-cols-1 w-full">
                                        <div className="  flex w-full rounded-[30px] p-[2%] m-[10px]">
                                            <div className="flex align-top w-[70%] h-[150px]">
                                                <img className="w-full rounded-[30px] p-[1px]" src={resto.resto_image} alt="" />
                                            </div>
                                            <div className="flex flex-col align-top pl-[5%] w-full">
                                                <div className="font-bold text-[25px]">
                                                    {resto.name}
                                                </div>
                                                <h2 className="text-red-600">{resto.rating}</h2>
                                                <div className="resto-minor-deets">
                                                    <div className="pt-[6px] pb-[6px]">
                                                        {resto.tags?.length > 0 && resto.tags.map(tags => (
                                                            <Link href={`/category/${tags}`} className="inline-block pb-[2px] pt-[2px] pl-[10px] pr-[10px] rounded-[10px] h-[10%] bg-primary mr-[4px] text-foreground border-[1px] border-solid border-gray-400 hover:bg-background hover:text-foreground-400 font-bold text-sm">{tags}</Link>
                                                        ))}
                                                    </div>
                                                    <h2 className="font-bold w-[90%] text-sm">{resto.address}</h2>
                                                </div>
                                                <hr className="w-[90%] border-solid border-[1px] border-accent mt-[1%] mb-[1%]"/>
                                                <h3 className="font-bold text-text text-sm">{resto.price_range}</h3>
                                            </div>
                                        </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}