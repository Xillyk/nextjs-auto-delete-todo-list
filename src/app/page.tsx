"use client";

import { useRef, useState } from "react";

interface ICard {
  type: "Fruit" | "Vegetable";
  name: string;
}
const todoList: ICard[] = [
  {
    type: "Fruit",
    name: "Apple",
  },
  {
    type: "Vegetable",
    name: "Broccoli",
  },
  {
    type: "Vegetable",
    name: "Mushroom",
  },
  {
    type: "Fruit",
    name: "Banana",
  },
  {
    type: "Vegetable",
    name: "Tomato",
  },
  {
    type: "Fruit",
    name: "Orange",
  },
  {
    type: "Fruit",
    name: "Mango",
  },
  {
    type: "Fruit",
    name: "Pineapple",
  },
  {
    type: "Vegetable",
    name: "Cucumber",
  },
  {
    type: "Fruit",
    name: "Watermelon",
  },
  {
    type: "Vegetable",
    name: "Carrot",
  },
];

export default function Home() {
  const [allList, setAllList] = useState<ICard[]>(todoList);
  const [fruitList, setFruitList] = useState<ICard[]>([]);
  const [vegetableList, setVegetableList] = useState<ICard[]>([]);
  const timeoutMapRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const handleClickCard = (card: ICard) => {
    switch (card.type) {
      case "Fruit":
        setAllList((prev) => prev.filter((item) => item.name !== card.name));
        setFruitList((prev) => [...prev, card]);
        break;
      case "Vegetable":
        setAllList((prev) => prev.filter((item) => item.name !== card.name));
        setVegetableList((prev) => [...prev, card]);
        break;
    }

    // set back to allList after timeout
    const timeoutId = setTimeout(() => {
      setAllList((prev) => [...prev, card]);

      switch (card.type) {
        case "Fruit":
          setFruitList((prev) =>
            prev.filter((item) => item.name !== card.name)
          );
          break;
        case "Vegetable":
          setVegetableList((prev) =>
            prev.filter((item) => item.name !== card.name)
          );
          break;
      }
      // auto delete timeout in map if countdown success
      timeoutMapRef.current.delete(card.name);
    }, 2000);
    // set timeout by card in map
    timeoutMapRef.current.set(card.name, timeoutId);
  };

  const handleClearTimeout = (card: ICard) => {
    const timeoutId = timeoutMapRef.current.get(card.name);
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear the timeout
      timeoutMapRef.current.delete(card.name); // Remove from map

      setAllList((prev) => [...prev, card]); // Return item to allList

      switch (card.type) {
        case "Fruit":
          setFruitList((prev) =>
            prev.filter((item) => item.name !== card.name)
          );
          break;
        case "Vegetable":
          setVegetableList((prev) =>
            prev.filter((item) => item.name !== card.name)
          );
          break;
      }
    }
  };

  const CategoryList = ({
    title,
    list,
    handleFunction,
  }: {
    title?: string;
    list: ICard[];
    handleFunction: (card: ICard) => void;
  }) => {
    return (
      <div className={`${title && "border-gray-200 border-1"}`}>
        <div className="flex flex-col gap-4">
          {title && (
            <div className="text-center bg-gray-100 py-2">
              <span className="font-semibold">{title}</span>
            </div>
          )}

          {list.map((card, index) => (
            <div
              key={index}
              className="min-w-[300px] w-fit px-4 py-2 text-center border-gray-300 border-1 mx-2 hover:bg-gray-100 cursor-pointer shadow-sm duration-100"
              onClick={() => handleFunction(card)}
            >
              {card.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-fit p-4">
      <div className="grid grid-cols-3 gap-4">
        {/* All list */}
        <CategoryList list={allList} handleFunction={handleClickCard} />

        {/* Fruits list */}
        <CategoryList
          title="Fruit"
          list={fruitList}
          handleFunction={handleClearTimeout}
        />

        {/* Vegetable list */}
        <CategoryList
          title="Vegetable"
          list={vegetableList}
          handleFunction={handleClearTimeout}
        />
      </div>
    </div>
  );
}
