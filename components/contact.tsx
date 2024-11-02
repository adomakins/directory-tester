'use client'

import { Site } from "@/lib/data";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import submitFormData from "@/lib/forms";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

export default function Contact({ site, isOpen, setIsOpen }: { site: Site, isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
    const initialState = { status: '', message: '' };
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        return await submitFormData(formData, site.id, 'contact');
    }, initialState);

    function SubmitButton() {
        const { pending } = useFormStatus();
        
        return (
            <button
                type="submit"
                disabled={pending}
                className={`text-white px-4 py-2 rounded-md bg-${site.color}-500 hover:bg-${site.color}-600 transition-all duration-300 disabled:opacity-50`}
            >
                {pending ? 'Sending...' : 'Send Message'}
            </button>
        );
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <Card className="w-full md:w-[500px] max-h-[90vh] overflow-y-auto">
                <CardContent className="p-6">
                    {state.status !== 'success' && (
                        <div className="flex flex-col gap-2 mb-4">
                            <h2 className="text-2xl font-bold">Get in Touch</h2>
                            <p className="text-neutral-400">{site["cta full"]}</p>
                        </div>
                    )}
                    {state.status === 'success' ? (
                        <div className="text-center py-8">
                            <p className="text-lg font-bold text-green-600">{state.message}</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`mt-4 text-white px-4 py-2 rounded-md bg-${site.color}-500 hover:bg-${site.color}-600 transition-all duration-300`}
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form className="flex flex-col gap-4" action={formAction}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    placeholder="your@email.com"
                                />
                            </div>
                            {site.info && (
                                <div>
                                    <label htmlFor="info" className="block text-sm font-medium text-gray-700">
                                        {site.info}
                                    </label>
                                    <input
                                        type="text"
                                        id="info"
                                        name="info"
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder={`Enter your ${site.info.toLowerCase()}`}
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                                    placeholder="Your message here..."
                                />
                            </div>
                            {state.status === 'error' && (
                                <p className="text-red-500">{state.message}</p>
                            )}
                            <SubmitButton />
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}