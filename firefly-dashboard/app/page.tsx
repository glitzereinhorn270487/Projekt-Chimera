// firefly-dashboard/app/page.tsx
import dynamic from "next/dynamic";

const DashboardPage = dynamic(() => import("@/components/DashboardPage"), {
  ssr: false, // vermeidet Serialisierung von Funktions-Props während SSG
});

export default function Page() {
  return <DashboardPage />;
}
