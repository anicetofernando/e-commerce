"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/actions/reviews";
import { Input, Label, Textarea, FieldError, FormAlert } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils";

export function ReviewForm({ productId }: { productId: string }) {
  const [state, action] = useActionState(submitReview, undefined);
  const [rating, setRating] = useState(5);

  return (
    <form action={action} className="space-y-4 rounded-lg border border-ink-100 bg-white p-5">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <Label>A sua avaliação</Label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            return (
              <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} estrelas`}>
                <Star size={22} className={cn(value <= rating ? "fill-brand-500 text-brand-500" : "text-ink-200")} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" placeholder="Resuma a sua experiência" required />
        <FieldError messages={state?.errors?.title} />
      </div>

      <div>
        <Label htmlFor="comment">Comentário</Label>
        <Textarea id="comment" name="comment" placeholder="Conte-nos mais sobre a peça e a sua compatibilidade" required />
        <FieldError messages={state?.errors?.comment} />
      </div>

      {state?.message && <FormAlert message={state.message} tone="success" />}

      <SubmitButton>Publicar Avaliação</SubmitButton>
    </form>
  );
}
