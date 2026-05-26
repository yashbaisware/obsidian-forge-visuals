import { Navbar } from "@/components/Navbar";
import { MyWork } from "@/components/MyWork";
import { Footer } from "@/components/Footer";

export default function MyWorkPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">
        <MyWork />
      </div>
      <Footer />
    </main>
  );
}
