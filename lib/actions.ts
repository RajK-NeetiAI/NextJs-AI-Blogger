"use server";

import OpenAI from "openai";
import { randomUUID } from "crypto";
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createCompletion = async (prompt: string) => {
    if (!prompt) {
        return { error: 'Prompt is required.' };
    }
    const { userId } = auth();
    if (!userId) {
        return { error: 'User is not logged in.' }
    }
    // Generate blog post using Openai
    const completion = await openai.chat.completions.create({
        model: 'gpt-4-0125-preview',
        messages: [
            {
                role: 'user',
                content: `Write a blog post around 200 words about the following topic: "${prompt}" in markdown format.`
            }
        ]
    });
    const content = completion?.choices?.[0]?.message?.content;
    if (!content) {
        return { error: 'Unable to generate the blog content.' };
    }
    // Generate an image using Openai
    const image = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Generate an image for a blog post about "${prompt}"`,
        n: 1,
        size: '1792x1024',
        response_format: 'b64_json'
    });
    const imageName = `${randomUUID()}`;
    const imageData = image?.data?.[0]?.b64_json as string;
    if (!imageData) {
        return { error: 'Unable to generate the blog image.' };
    }
    // Upload the image to Supabase storage
    const { data, error } = await supabase.storage
        .from('nextjs-ai-blogger-images')
        .upload(imageName, decode(imageData), {
            contentType: 'image/png'
        });
    if (error) {
        return { error: 'Unable to upload the blog image to Storage.' }
    }
    const path = data?.path;
    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/nextjs-ai-blogger-images/${path}`;
    // Create a new blog post in Supabase
    const { data: blog, error: blogError } = await supabase
        .from('blogs')
        .insert([{ title: prompt, content, imageUrl, userId: '123456789' }])
        .select();
    if (blogError) {
        return { error: 'Unable to insert the blog into the database.' };
    }
    const blogId = blog?.[0]?.id;
    revalidatePath('/');
    redirect(`/blog/${blogId}`);
};
