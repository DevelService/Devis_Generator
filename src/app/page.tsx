"use client";

import { useState } from "react";
import Form from "@/components/Form";
import Preview from "@/components/Preview";

export default function home() {

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to the home page</h1>
      <p className="text-lg text-gray-600">This is the home page content</p>
    </div>
  );
}