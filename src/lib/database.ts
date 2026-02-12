import { supabase } from '$lib/supabase';

export interface Link {
    id: string;
    short_code: string;
    long_url: string;
    clicks: number;
    custom_slug: boolean;
    on_leaderboard: boolean;
    created_at: string;
}

export interface FetchLinksParams {
    userId: string;
    page?: number;
    limit?: number;
}

export interface FetchLinksResult {
    links: Link[];
    page: number;
    limit: number;
    total: number;
}

// Fetch user's links with pagination - optimized with column selection
export const fetchUserLinks = async ({
    userId,
    page = 1,
    limit = 20
}: FetchLinksParams): Promise<FetchLinksResult> => {
    const offset = (page - 1) * limit;

    const { data: links, count, error } = await supabase
        .from('links')
        .select('id,short_code,long_url,clicks,custom_slug,on_leaderboard,created_at', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Database error:', error);
        throw error;
    }

    return {
        links: (links as Link[]) || [],
        page,
        limit,
        total: count || 0
    };
};
