import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import { FaBoxesPacking, FaFlaskVial } from "react-icons/fa6";
import { IoPricetagSharp } from "react-icons/io5";
import { formattedCurrency } from "@/util/currencyFormat";

function ItemView() {
    const { item } = usePage().props;
    console.log(item);

    return (
        <AuthenticatedLayout>
            <Head title="Item" />
            <div className="p-12 z-0">
                <Carousel>
                    <CarouselContent>
                        {item.images.map((itemImage, index) => (
                            <CarouselItem key={index}>
                                <img
                                    src={route("image.link", itemImage.id)}
                                    loading="lazy"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
            <div>
                <Card>
                    <CardContent>
                        <h2 className="text-xl">{item.brand_name}</h2>
                        <h4 className="font-normal text-gray-600">
                            {item.generic_name}
                        </h4>
                        <div className="flex gap-6 mt-4">
                            <span className="flex  items-center gap-2 text-cyan-700">
                                <FaFlaskVial className="text-cyan-700" />{" "}
                                {item.milligrams}
                            </span>
                            <span className="flex  items-center  gap-2 text-orange-700">
                                <FaBoxesPacking className="" /> {item.supply}
                            </span>
                            <span className="flex  items-center  gap-2 text-green-700">
                                <IoPricetagSharp className="" />{" "}
                                {formattedCurrency(item.catalog_price)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

export default ItemView;
