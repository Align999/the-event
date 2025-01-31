import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Auth System Test</h1>
        
        <div className="flex flex-col space-y-2">
          <Link 
            href="/auth/signup" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Sign Up
          </Link>
          
          <Link 
            href="/auth/signin" 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Sign In
          </Link>
          
          <Link 
            href="/auth/profile" 
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Protected Profile Page
          </Link>
        </div>
      </div>
    </main>
  )
}