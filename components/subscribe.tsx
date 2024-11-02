'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Site } from "@/lib/data";
import submitFormData from "@/lib/forms";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

type SubscribeProps = {
  site: Site;
  variant?: 'sidebar' | 'footer';
};

function SubmitButton({ color }: { color: string }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`text-white px-4 py-2 rounded-md bg-${color}-500 hover:bg-${color}-600 transition-all duration-300 disabled:opacity-50`}
    >
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}

export default function Subscribe({ site, variant = 'footer' }: SubscribeProps) {
  const initialState = { status: '', message: '' };
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    return await submitFormData(formData, site.id, 'subscribe');
  }, initialState);

  const containerClasses = variant === 'sidebar'
    ? "flex flex-col text-center items-center justify-between gap-4"
    : "flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-4";

  const contentClasses = variant === 'sidebar'
    ? "text-white w-full"
    : "text-white w-full md:w-1/2";

  const formClasses = variant === 'sidebar'
    ? "flex flex-col gap-2 w-full"
    : "flex flex-col md:flex-row gap-2 w-full md:w-1/2";

  return (
    <Card className={`flex flex-col w-full bg-${site.color}-800 p-6 mb-4 ${variant === 'footer' ? 'md:mb-0' : ''}`}>
      <CardContent className={containerClasses}>
        <div className={contentClasses}>
          <p className="text-lg font-bold leading-tight">
            {state.status === 'success' && state.message}
            {state.status === 'error' && (
              <span className="text-red-300">{state.message}</span>
            )}
            {!state.status && 'Get updates on new listings and articles'}
          </p>
        </div>
        <form className={formClasses} action={formAction}>
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="border-2 border-white rounded-md p-2 w-full"
          />
          <SubmitButton color={site.color} />
        </form>
      </CardContent>
    </Card>
  );
}