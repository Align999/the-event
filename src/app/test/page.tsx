import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Event Feature Testing</h1>
      <div className="space-y-4">
        <Link 
          href="/events/new" 
          className="block p-4 bg-blue-100 rounded hover:bg-blue-200"
        >
          Test Create Event
        </Link>
        <Link 
          href="/events" 
          className="block p-4 bg-green-100 rounded hover:bg-green-200"
        >
          Test Event List
        </Link>
        <Link 
          href="/events/view" 
          className="block p-4 bg-purple-100 rounded hover:bg-purple-200"
        >
          Test Event Details
        </Link>
        <Link 
          href="/events/guests" 
          className="block p-4 bg-yellow-100 rounded hover:bg-yellow-200"
        >
          Test Guest Management
        </Link>
      </div>
    </div>
  );
}