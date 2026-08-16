import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("id", id)
    .maybeSingle();

  return {
    title: data?.full_name,
    description: data?.bio?.slice(0, 160),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
