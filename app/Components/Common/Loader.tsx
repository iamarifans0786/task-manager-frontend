"use client";
import { LoaderIcon } from "@/app/Helper/SvgProvider";
import React from "react";

function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-lg">
            <LoaderIcon />
        </div>
    );
}

export default FullScreenLoader;
