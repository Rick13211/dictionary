'use client'
import { useState } from "react"
import { db } from "@/lib/offline-db"

export default function Home(){
  const [input,setInput] = useState<string>('')
  const [data,setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit  = async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!input.trim())return;
    const query = input.trim().toLowerCase();
    setLoading(true)
    setError(null)
    setData(null)

    try{
      const localWord = await db.words.get(query);
      if(localWord){
        console.log("loaded instantly from localDB")
        setData(localWord.data)
        setLoading(false)
        return;
      }
      console.log("Cache miss, searching in API...")
      const result = await fetch(`/api/search?word=${query}`)
      
      const text = await result.text();
      let response;
      try {
        response = JSON.parse(text);
      } catch (e) {
        throw new Error(`Invalid JSON response from server: ${text.slice(0, 50)}...`);
      }

      if(!result.ok){
        throw new Error(response.error || "Word not found");
      }
      const definitionData = response.data[0];
      await db.words.put({
        word:query,
        data:definitionData,
        timestamp:Date.now()
      })
      console.log("Word saved to localDB for future use")
      setData(definitionData)
    }catch(err: any){
    console.error("Search Error:", err)
    setError(err.message || "An unexpected error occurred")
  }finally{
    setLoading(false)
  }
  }
   return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-4">
      <h1 className="text-4xl font-bold mb-8 dark:text-white">Offline Dictionary</h1>
      
      <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          type="text" 
          placeholder="Search for a word..." 
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="border border-transparent rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && (
        <div className="mt-8 text-red-500 w-full max-w-md text-center">
          {error}
        </div>
      )}
      {data && (
        <div className="mt-8 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg w-full max-w-2xl">
          <div className="text-3xl font-bold dark:text-white mb-2">{data.word}</div>
          <div className="text-blue-500 italic mb-6">{data.phonetic}</div>
          
          {data.meanings.map((meaning: any, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold dark:text-gray-300 capitalize mb-2">{meaning.partOfSpeech}</h3>
              <ul className="list-disc pl-6 space-y-2 dark:text-gray-400">
                {meaning.definitions.slice(0, 3).map((def: any, defIndex: number) => (
                  <li key={defIndex}>{def.definition}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}