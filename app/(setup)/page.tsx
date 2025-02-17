import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>OAK Wallet</h1>

      <Link href="/dashboard">
        <Button>Connect Wallet</Button>
      </Link>
    </div>
  );
}
