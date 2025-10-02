export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_token: string | null
          created_at: string
          development_name: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          source: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          booking_token?: string | null
          created_at?: string
          development_name?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          source?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          booking_token?: string | null
          created_at?: string
          development_name?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          source?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      change_log: {
        Row: {
          change_type: string
          changed_at: string | null
          changed_by: string | null
          details: Json | null
          dev_id: string
          id: string
          notes: string | null
          price_list_id: string | null
        }
        Insert: {
          change_type: string
          changed_at?: string | null
          changed_by?: string | null
          details?: Json | null
          dev_id: string
          id?: string
          notes?: string | null
          price_list_id?: string | null
        }
        Update: {
          change_type?: string
          changed_at?: string | null
          changed_by?: string | null
          details?: Json | null
          dev_id?: string
          id?: string
          notes?: string | null
          price_list_id?: string | null
        }
        Relationships: []
      }
      developer_registry: {
        Row: {
          active: boolean
          allow_domains: Json
          created_at: string
          id: string
          image_rules: Json
          index_urls: Json
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          allow_domains?: Json
          created_at?: string
          id: string
          image_rules?: Json
          index_urls?: Json
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          allow_domains?: Json
          created_at?: string
          id?: string
          image_rules?: Json
          index_urls?: Json
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      developments: {
        Row: {
          amenities: string[] | null
          area_overview: string | null
          bedrooms: string[] | null
          completion_date: string | null
          cover_image_index: number | null
          created_at: string | null
          developer: string | null
          distance_to_tube: string | null
          featured: boolean | null
          green_spaces: string | null
          hidden_images: number[] | null
          id: string
          images: string[] | null
          lat: number | null
          lng: number | null
          location: string | null
          name: string
          nearby_stations: Json | null
          nearest_tube: string | null
          nearest_tube_line: string | null
          postcode: string | null
          prices: Json | null
          raw_details: Json | null
          schools: Json | null
          stations: Json | null
          status: string | null
          tenure: string | null
          transport_score: string | null
          updated_at: string | null
          validation_status: Json | null
          zone: string | null
        }
        Insert: {
          amenities?: string[] | null
          area_overview?: string | null
          bedrooms?: string[] | null
          completion_date?: string | null
          cover_image_index?: number | null
          created_at?: string | null
          developer?: string | null
          distance_to_tube?: string | null
          featured?: boolean | null
          green_spaces?: string | null
          hidden_images?: number[] | null
          id: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name: string
          nearby_stations?: Json | null
          nearest_tube?: string | null
          nearest_tube_line?: string | null
          postcode?: string | null
          prices?: Json | null
          raw_details?: Json | null
          schools?: Json | null
          stations?: Json | null
          status?: string | null
          tenure?: string | null
          transport_score?: string | null
          updated_at?: string | null
          validation_status?: Json | null
          zone?: string | null
        }
        Update: {
          amenities?: string[] | null
          area_overview?: string | null
          bedrooms?: string[] | null
          completion_date?: string | null
          cover_image_index?: number | null
          created_at?: string | null
          developer?: string | null
          distance_to_tube?: string | null
          featured?: boolean | null
          green_spaces?: string | null
          hidden_images?: number[] | null
          id?: string
          images?: string[] | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name?: string
          nearby_stations?: Json | null
          nearest_tube?: string | null
          nearest_tube_line?: string | null
          postcode?: string | null
          prices?: Json | null
          raw_details?: Json | null
          schools?: Json | null
          stations?: Json | null
          status?: string | null
          tenure?: string | null
          transport_score?: string | null
          updated_at?: string | null
          validation_status?: Json | null
          zone?: string | null
        }
        Relationships: []
      }
      discovery_queue: {
        Row: {
          created_at: string
          developer_id: string
          id: string
          images: Json
          imported_at: string | null
          is_london: boolean
          location: string | null
          name: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          scraped_data: Json
          status: string
          url: string
        }
        Insert: {
          created_at?: string
          developer_id: string
          id?: string
          images?: Json
          imported_at?: string | null
          is_london?: boolean
          location?: string | null
          name: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scraped_data?: Json
          status?: string
          url: string
        }
        Update: {
          created_at?: string
          developer_id?: string
          id?: string
          images?: Json
          imported_at?: string | null
          is_london?: boolean
          location?: string | null
          name?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scraped_data?: Json
          status?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_queue_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developer_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      email_ingests: {
        Row: {
          dev_id: string
          file_path: string | null
          id: string
          processed: boolean | null
          received_at: string | null
          sender_email: string
          subject: string | null
        }
        Insert: {
          dev_id: string
          file_path?: string | null
          id?: string
          processed?: boolean | null
          received_at?: string | null
          sender_email: string
          subject?: string | null
        }
        Update: {
          dev_id?: string
          file_path?: string | null
          id?: string
          processed?: boolean | null
          received_at?: string | null
          sender_email?: string
          subject?: string | null
        }
        Relationships: []
      }
      error_log: {
        Row: {
          context: Json | null
          error_message: string
          error_type: string
          file_path: string | null
          id: string
          occurred_at: string | null
          resolved: boolean | null
        }
        Insert: {
          context?: Json | null
          error_message: string
          error_type: string
          file_path?: string | null
          id?: string
          occurred_at?: string | null
          resolved?: boolean | null
        }
        Update: {
          context?: Json | null
          error_message?: string
          error_type?: string
          file_path?: string | null
          id?: string
          occurred_at?: string | null
          resolved?: boolean | null
        }
        Relationships: []
      }
      header_mappings: {
        Row: {
          created_at: string | null
          developer: string
          id: string
          source_header: string
          target_field: string
        }
        Insert: {
          created_at?: string | null
          developer: string
          id?: string
          source_header: string
          target_field: string
        }
        Update: {
          created_at?: string | null
          developer?: string
          id?: string
          source_header?: string
          target_field?: string
        }
        Relationships: []
      }
      hottest_unit: {
        Row: {
          dev_id: string
          manual_override: boolean | null
          override_reason: string | null
          score: number | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          dev_id: string
          manual_override?: boolean | null
          override_reason?: string | null
          score?: number | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          dev_id?: string
          manual_override?: boolean | null
          override_reason?: string | null
          score?: number | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      image_validation: {
        Row: {
          dev_id: string
          file_size: number | null
          height: number | null
          id: string
          image_url: string
          issues: Json | null
          validated_at: string | null
          width: number | null
        }
        Insert: {
          dev_id: string
          file_size?: number | null
          height?: number | null
          id?: string
          image_url: string
          issues?: Json | null
          validated_at?: string | null
          width?: number | null
        }
        Update: {
          dev_id?: string
          file_size?: number | null
          height?: number | null
          id?: string
          image_url?: string
          issues?: Json | null
          validated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      price_list_rows: {
        Row: {
          beds: number | null
          created_at: string | null
          id: string
          price: number | null
          price_list_id: string
          size_sqft: number | null
          status: string | null
          unit_code: string
        }
        Insert: {
          beds?: number | null
          created_at?: string | null
          id?: string
          price?: number | null
          price_list_id: string
          size_sqft?: number | null
          status?: string | null
          unit_code: string
        }
        Update: {
          beds?: number | null
          created_at?: string | null
          id?: string
          price?: number | null
          price_list_id?: string
          size_sqft?: number | null
          status?: string | null
          unit_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_list_rows_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          dev_id: string
          file_path: string
          id: string
          is_active: boolean | null
          notes: string | null
          parsed_ok: boolean | null
          published_at: string | null
          published_by: string | null
          received_at: string | null
          source: string
          uploaded_at: string | null
        }
        Insert: {
          dev_id: string
          file_path: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          parsed_ok?: boolean | null
          published_at?: string | null
          published_by?: string | null
          received_at?: string | null
          source?: string
          uploaded_at?: string | null
        }
        Update: {
          dev_id?: string
          file_path?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          parsed_ok?: boolean | null
          published_at?: string | null
          published_by?: string | null
          received_at?: string | null
          source?: string
          uploaded_at?: string | null
        }
        Relationships: []
      }
      publishes: {
        Row: {
          dev_id: string
          id: string
          notes: string | null
          price_list_id: string
          published_at: string | null
          published_by: string | null
          units_added: number | null
          units_removed: number | null
          units_updated: number | null
        }
        Insert: {
          dev_id: string
          id?: string
          notes?: string | null
          price_list_id: string
          published_at?: string | null
          published_by?: string | null
          units_added?: number | null
          units_removed?: number | null
          units_updated?: number | null
        }
        Update: {
          dev_id?: string
          id?: string
          notes?: string | null
          price_list_id?: string
          published_at?: string | null
          published_by?: string | null
          units_added?: number | null
          units_removed?: number | null
          units_updated?: number | null
        }
        Relationships: []
      }
      rag_chunks: {
        Row: {
          content: string
          created_at: string | null
          dev_id: string
          embedding: string
          id: number
          source: string
        }
        Insert: {
          content: string
          created_at?: string | null
          dev_id: string
          embedding: string
          id?: number
          source: string
        }
        Update: {
          content?: string
          created_at?: string | null
          dev_id?: string
          embedding?: string
          id?: number
          source?: string
        }
        Relationships: []
      }
      scheduled_tasks: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          last_run: string | null
          next_run: string | null
          schedule: string
          task_name: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_run?: string | null
          next_run?: string | null
          schedule: string
          task_name: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          last_run?: string | null
          next_run?: string | null
          schedule?: string
          task_name?: string
        }
        Relationships: []
      }
      scrape_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          developer_id: string
          discovered_count: number | null
          error_message: string | null
          id: string
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          developer_id: string
          discovered_count?: number | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          developer_id?: string
          discovered_count?: number | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scrape_jobs_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developer_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_anomalies: {
        Row: {
          anomaly_type: string
          details: Json | null
          detected_at: string | null
          dev_id: string
          id: string
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          unit_id: string | null
        }
        Insert: {
          anomaly_type: string
          details?: Json | null
          detected_at?: string | null
          dev_id: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          unit_id?: string | null
        }
        Update: {
          anomaly_type?: string
          details?: Json | null
          detected_at?: string | null
          dev_id?: string
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_anomalies_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          aspect: string | null
          beds: number
          building: string | null
          completion_date: string | null
          created_at: string | null
          dev_id: string
          floor: number | null
          has_balcony: boolean | null
          id: string
          price: number
          size_sqft: number
          status: string
          unit_number: string
          updated_at: string | null
          view_park: boolean | null
          view_river: boolean | null
        }
        Insert: {
          aspect?: string | null
          beds: number
          building?: string | null
          completion_date?: string | null
          created_at?: string | null
          dev_id: string
          floor?: number | null
          has_balcony?: boolean | null
          id?: string
          price: number
          size_sqft: number
          status?: string
          unit_number: string
          updated_at?: string | null
          view_park?: boolean | null
          view_river?: boolean | null
        }
        Update: {
          aspect?: string | null
          beds?: number
          building?: string | null
          completion_date?: string | null
          created_at?: string | null
          dev_id?: string
          floor?: number | null
          has_balcony?: boolean | null
          id?: string
          price?: number
          size_sqft?: number
          status?: string
          unit_number?: string
          updated_at?: string | null
          view_park?: boolean | null
          view_river?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_rag_chunks: {
        Args: {
          filter_dev_id?: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          dev_id: string
          id: number
          similarity: number
          source: string
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user" | "booking_manager" | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user", "booking_manager", "manager"],
    },
  },
} as const
