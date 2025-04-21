import Link from "next/link";
import React from "react"

export default function Category(props) {
    return (
        <Link href={`/category/${props.category_name}`}>
            <div className="group flex flex-col bg-background rounded-lg p-3 items-center justify-center h-56 cursor-pointer border-2 border-solid border-highlight hover:bg-highlight hover:text-foreground hover:shadow-md transition-transform duration-200 ease-in-out hover:scale-105">
                <img className="h-[55%] mb-1 transition-transform duration-200 ease-in-out" src={props.category_pic}  />
                <h4 className="w-full text-highlight italic text-lg font-bold tracking-wide text-text text-center whitespace-normal">{props.category_name}</h4>
            </div>
        </Link>
    );
}
