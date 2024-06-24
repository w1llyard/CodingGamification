/** @format */

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export type CardProps = {
  label: string;
  icon: LucideIcon;
  amount: string;
  discription: string;
};

export default function Card(props: CardProps) {
  return (
    <CardContent>
      <div className="flex justify-between gap-2">
        <props.icon className="hidden md:block items-center h-20 w-20 text-customblue" />
        <div className="flex flex-col justify-between">
          <section className="flex justify-between gap-2">
            <p className="text-sm font-semi-bold text-customgrey">{props.label}</p>
          </section>
          <section className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">{props.amount}</h2>
            <p className="text-xs text-gray-500">{props.discription}</p>
          </section>
        </div>
      </div>
    </CardContent>
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl  p-5 shadow bg-navbarColors border border-gray-600",
        props.className
      )}
    />
  );
}