"use client"; 

import { useState } from "react";
import { motion } from "framer-motion"; 

// List of items the user can place in the garden
const items = [
  { type: "rock", icon: "🪨" },
  { type: "flower", icon: "🌸" },
  { type: "tree", icon: "🌲" },
  { type: "bamboo", icon: "🎋" },
];

export function ZenGarden() {
  // State: list of all placed items on the canvas
  const [placedItems, setPlacedItems] = useState<
    Array<{
      type: string; // Type of item (rock, flower, etc.)
      icon: string; // Emoji/icon representing the item
      x: number;    // X position on the canvas
      y: number;    // Y position on the canvas
    }>
  >([]);

  // State: currently selected item to place
  const [selectedItem, setSelectedItem] = useState(items[0]);

  // Handles clicking on the canvas to place the selected item
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get the bounding rectangle of the canvas
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate click coordinates relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add the new item to placedItems
    setPlacedItems([...placedItems, { ...selectedItem, x, y }]);
  };

  return (
    <div className="space-y-4">
      
      {/* ------------------- 1. Item Selection Buttons ------------------- */}
      <div className="flex justify-center gap-4">
        {items.map((item) => (
          <motion.button
            key={item.type}
            whileHover={{ scale: 1.1 }}  // Slightly grow on hover
            whileTap={{ scale: 0.95 }}   // Slightly shrink on click
            onClick={() => setSelectedItem(item)} // Select this item
            className={`p-3 rounded-lg ${
              selectedItem.type === item.type ? "bg-primary/20" : "bg-primary/5"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
          </motion.button>
        ))}
      </div>

      {/* ------------------- 2. Interactive Canvas ------------------- */}
      <div
        onClick={handleCanvasClick} // Clicking will place the selected item
        className="relative w-full h-[400px] bg-primary/5 rounded-lg cursor-pointer overflow-hidden"
      >
        {/* Render all placed items on the canvas */}
        {placedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}   // Start invisible (small)
            animate={{ scale: 1 }}   // Animate to normal size
            style={{
              position: "absolute",  // Absolute position based on click
              left: item.x - 12,     // Offset to center the emoji
              top: item.y - 12,
            }}
            className="text-2xl"
          >
            {item.icon}  {/* Show the emoji */}
          </motion.div>
        ))}
      </div>

    </div>
  );
}
