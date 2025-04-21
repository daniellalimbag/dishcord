import Category from "./Category";

export default function Main_Categories() {
    return (
        <div className="bg-background pt-[2%] pb-[5%]">
            <h1 className="text-primary text-center text-[30px] font-bold tracking-wide my-6">Categories</h1>
            <div className="grid grid-cols-4 p-[1%_5%] gap-x-[3%] gap-y-[5%]">
                <Category category_name={"Beverage"} category_pic={"/assets/categories/beverage.svg"} />
                <Category category_name={"Burger"} category_pic={"/assets/categories/burger.svg"} />
                <Category category_name={"Chicken"} category_pic={"/assets/categories/chicken.svg"} />
                <Category category_name={"Dessert"} category_pic={"/assets/categories/dessert.svg"} />
                <Category category_name={"Fastfood"} category_pic={"/assets/categories/fastfood.svg"} />
                <Category category_name={"Healthy"} category_pic={"/assets/categories/healthy.svg"} />
                <Category category_name={"Seafood"} category_pic={"/assets/categories/seafood.svg"} />
                <Category category_name={"Spicy"} category_pic={"/assets/categories/spicy.svg"} />
            </div>
        </div>
    );
}
