import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { items } from "@/src/schema";

export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { db } = await import("@/src/db");
  const [item] = await db.select().from(items).where(eq(items.id, Number(id)));
  if (!item) notFound();

  async function updateItem(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const description = formData.get("description");
    const defaultLoanDays = Number(formData.get("defaultLoanDays"));

    if (typeof name !== "string" || name.trim() === "") return;

    const { db } = await import("@/src/db");
    await db
      .update(items)
      .set({
        name: name.trim(),
        description:
          typeof description === "string" && description.trim() !== ""
            ? description.trim()
            : null,
        defaultLoanDays: defaultLoanDays > 0 ? defaultLoanDays : 7,
      })
      .where(eq(items.id, Number(id)));
    redirect("/items");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>備品 編集</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateItem} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">備品名 *</Label>
              <Input id="name" name="name" required defaultValue={item.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">説明</Label>
              <Input
                id="description"
                name="description"
                defaultValue={item.description ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="defaultLoanDays">標準返却日数</Label>
              <Input
                id="defaultLoanDays"
                name="defaultLoanDays"
                type="number"
                min="1"
                defaultValue={item.defaultLoanDays}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">更新</Button>
              <a href="/items" className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}>
                キャンセル
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
