'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createCompletion } from '@/lib/actions';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Form() {
    async function action(formData: FormData) {
        const prompt = formData.get('prompt') as string;
        const response = await createCompletion(prompt);
        if (response?.error) {
            toast.error(response?.error);
        }
    };
    return (
        <section className='mx-auto max-w-lg'>
            <Card className='border-0 shadow-none'>
                <CardHeader className='text-center'>
                    <CardTitle>Next AI Blogger</CardTitle>
                    <CardDescription>Generate a blog post about anything</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className='mt-3'>
                        <Input
                            name='prompt'
                            placeholder='What should I write about?'
                            className='rounded-lg'
                        />
                        <SubmitButton></SubmitButton>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <>
            <SignedIn>
                <Button
                    size='sm'
                    type='submit'
                    className={cn('mt-3 w-full rounded-lg', pending && 'animate-pulse')}
                >
                    {pending ? 'Working on it...' : 'Submit'}
                </Button>
            </SignedIn>
            <SignedOut>
                <SignInButton mode='modal'>
                    <Button
                        size={"sm"}
                        type='button'
                        variant={"secondary"}
                        className='mt-3 w-full rounded-lg'
                    >Sign in to start!</Button>
                </SignInButton>
            </SignedOut>
        </>
    );
};
