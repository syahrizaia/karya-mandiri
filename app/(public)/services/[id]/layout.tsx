import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("title, description")
    .eq("id", id)
    .maybeSingle();

  return {
    title: data?.title,
    description: data?.description?.slice(0, 160),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
