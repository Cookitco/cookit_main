export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          followers_count: number | null;
          following_count: number | null;
          posts_count: number | null;
          is_verified: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          followers_count?: number | null;
          following_count?: number | null;
          posts_count?: number | null;
          is_verified?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          followers_count?: number | null;
          following_count?: number | null;
          posts_count?: number | null;
          is_verified?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          image_url: string;
          ingredients: string[];
          directions: string[];
          prep_time: string;
          calories: number | null;
          is_veg: boolean | null;
          category: string;
          is_private: boolean | null;
          likes_count: number | null;
          saves_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          image_url: string;
          ingredients: string[];
          directions: string[];
          prep_time: string;
          calories?: number | null;
          is_veg?: boolean | null;
          category: string;
          is_private?: boolean | null;
          likes_count?: number | null;
          saves_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          ingredients?: string[];
          directions?: string[];
          prep_time?: string;
          calories?: number | null;
          is_veg?: boolean | null;
          category?: string;
          is_private?: boolean | null;
          likes_count?: number | null;
          saves_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          media_url: string;
          caption: string | null;
          recipe_id: string | null;
          likes_count: number | null;
          comments_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          media_url: string;
          caption?: string | null;
          recipe_id?: string | null;
          likes_count?: number | null;
          comments_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          media_url?: string;
          caption?: string | null;
          recipe_id?: string | null;
          likes_count?: number | null;
          comments_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string | null;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          recipe_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id?: string | null;
          recipe_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string | null;
          recipe_id?: string | null;
          created_at?: string | null;
        };
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipe_id?: string;
          created_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          content: string;
          likes_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          content: string;
          likes_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          content?: string;
          likes_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          is_read?: boolean | null;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}