import Image from "next/image";
import ReceiptTable, { ReceiptItem } from "@/components/ReceiptTable";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans">
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-800/50 shadow-sm">
            <span>✨</span> Receipt Scanner
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Split the Bill, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Fairly.</span>
          </h1>
          <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Review your receipt items and assign who is paying for what. It's never been easier to split the bill with your friends.
          </p>
        </div>

        {/* Receipt Table */}
        <ReceiptTable items={[]} />
        
      </main>
    </div>
  );
}
