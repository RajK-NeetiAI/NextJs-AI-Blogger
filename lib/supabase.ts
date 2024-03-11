import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_SECRET_ROLE_KEY = process.env.SUPABASE_SECRET_ROLE_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_ROLE_KEY);

export const getBlogById = async (id: string) => {
    const { data, error } = await supabase
        .from('blogs')
        .select()
        .eq('id', id)
        .single();
    return data;
};

export const getAllBlogs = async () => {
    const { data, error } = await supabase
        .from('blogs')
        .select()
        .order('createdAt', { ascending: false });
    return data;
};
