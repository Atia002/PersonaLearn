import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { LearnerProvider } from './contexts/LearnerContext';

export default function App() {
  return (
    <LearnerProvider>
      <RouterProvider router={router} />
      <Toaster />
    </LearnerProvider>
  );
}