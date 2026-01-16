import { Suspense } from 'react';
import { Outlet } from 'react-router';

export default function GlobalLayout() {
  return (
    <main>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </main>
  );
}
