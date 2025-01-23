import MainLayout from '@/components/Layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to The Event</h2>
        <p className="text-gray-600">
          Your all-in-one solution for event planning and management.
        </p>
      </div>
    </MainLayout>
  );
}