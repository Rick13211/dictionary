'use client'
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [data,setData]  = useState<string|null>(null)
  const handleSubmit = async()=>{
    console.log(input)
    const result  = await fetch(`api/search?word=${input}`, {method: "GET"})
    const data = await result.json()
    const definitions = data.data[0].meanings[0].definitions

    console.log(definitions)
    
  }
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div></div>
      <form action={handleSubmit} className="flex gap-2">
        <input value={input} onChange={(e)=>setInput(e.target.value)} type="text" placeholder="Search" className="border border-gray-300 rounded-md px-2 py-1" />
        <button type="submit" className="border border-gray-300 rounded-md px-2 py-1 bg-white text-black px-4">Search</button>
      </form>
    </div>
  );
}
