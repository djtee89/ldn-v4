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
      area_metrics: {
        Row: {
          area_code: string
          area_name: string
          area_type: string
          bounds: Json
          center_lat: number
          center_lng: number
          created_at: string | null
          crime_category: string | null
          crime_per_1000: number | null
          data_sources: Json | null
          green_space_pct: number | null
          growth_12m_pct: number | null
          growth_rank: string | null
          id: string
          last_updated: string | null
          noise_air_badge: string | null
          parks_count: number | null
          price_per_sqft_1bed: number | null
          price_per_sqft_2bed: number | null
          price_per_sqft_3bed: number | null
          price_per_sqft_overall: number | null
          sample_size: number | null
          schools_outstanding_primary: number | null
          schools_outstanding_secondary: number | null
          schools_score: number | null
          updated_at: string | null
          yield_1bed: number | null
          yield_2bed: number | null
          yield_3bed: number | null
        }
        Insert: {
          area_code: string
          area_name: string
          area_type: string
          bounds: Json
          center_lat: number
          center_lng: number
          created_at?: string | null
          crime_category?: string | null
          crime_per_1000?: number | null
          data_sources?: Json | null
          green_space_pct?: number | null
          growth_12m_pct?: number | null
          growth_rank?: string | null
          id?: string
          last_updated?: string | null
          noise_air_badge?: string | null
          parks_count?: number | null
          price_per_sqft_1bed?: number | null
          price_per_sqft_2bed?: number | null
          price_per_sqft_3bed?: number | null
          price_per_sqft_overall?: number | null
          sample_size?: number | null
          schools_outstanding_primary?: number | null
          schools_outstanding_secondary?: number | null
          schools_score?: number | null
          updated_at?: string | null
          yield_1bed?: number | null
          yield_2bed?: number | null
          yield_3bed?: number | null
        }
        Update: {
          area_code?: string
          area_name?: string
          area_type?: string
          bounds?: Json
          center_lat?: number
          center_lng?: number
          created_at?: string | null
          crime_category?: string | null
          crime_per_1000?: number | null
          data_sources?: Json | null
          green_space_pct?: number | null
          growth_12m_pct?: number | null
          growth_rank?: string | null
          id?: string
          last_updated?: string | null
          noise_air_badge?: string | null
          parks_count?: number | null
          price_per_sqft_1bed?: number | null
          price_per_sqft_2bed?: number | null
          price_per_sqft_3bed?: number | null
          price_per_sqft_overall?: number | null
          sample_size?: number | null
          schools_outstanding_primary?: number | null
          schools_outstanding_secondary?: number | null
          schools_score?: number | null
          updated_at?: string | null
          yield_1bed?: number | null
          yield_2bed?: number | null
          yield_3bed?: number | null
        }
        Relationships: []
      }
      area_polygons: {
        Row: {
          area_code: string
          area_name: string
          area_type: string
          created_at: string | null
          geometry: Json
          id: string
          updated_at: string | null
        }
        Insert: {
          area_code: string
          area_name: string
          area_type: string
          created_at?: string | null
          geometry: Json
          id?: string
          updated_at?: string | null
        }
        Update: {
          area_code?: string
          area_name?: string
          area_type?: string
          created_at?: string | null
          geometry?: Json
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      best_deals: {
        Row: {
          active: boolean | null
          created_at: string | null
          deal_description: string | null
          dev_id: string
          display_order: number | null
          floorplan_url: string | null
          id: string
          images: string[] | null
          published_at: string | null
          published_by: string | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          deal_description?: string | null
          dev_id: string
          display_order?: number | null
          floorplan_url?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          published_by?: string | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          deal_description?: string | null
          dev_id?: string
          display_order?: number | null
          floorplan_url?: string | null
          id?: string
          images?: string[] | null
          published_at?: string | null
          published_by?: string | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "best_deals_dev_id_fkey"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "best_deals_dev_id_fkey"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "best_deals_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
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
      development_offers: {
        Row: {
          active: boolean | null
          created_at: string | null
          dev_id: string
          expiry_date: string | null
          id: string
          image_url: string | null
          offer_description: string | null
          offer_title: string
          savings_amount: string | null
          terms: Json | null
          updated_at: string | null
          voucher_code: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          dev_id: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          offer_description?: string | null
          offer_title: string
          savings_amount?: string | null
          terms?: Json | null
          updated_at?: string | null
          voucher_code: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          dev_id?: string
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          offer_description?: string | null
          offer_title?: string
          savings_amount?: string | null
          terms?: Json | null
          updated_at?: string | null
          voucher_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_development"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_development"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      developments: {
        Row: {
          amenities: string[] | null
          borough: string | null
          completion_date: string | null
          created_at: string | null
          developer: string | null
          id: string
          images: string[] | null
          images_count: number | null
          lat: number | null
          lng: number | null
          location: string | null
          name: string
          nearby_stations: Json | null
          postcode: string | null
          prices: Json | null
          schools: Json | null
          stations: Json | null
          status: string | null
          summary: string | null
          tenure: string | null
          units_count: number | null
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          amenities?: string[] | null
          borough?: string | null
          completion_date?: string | null
          created_at?: string | null
          developer?: string | null
          id: string
          images?: string[] | null
          images_count?: number | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name: string
          nearby_stations?: Json | null
          postcode?: string | null
          prices?: Json | null
          schools?: Json | null
          stations?: Json | null
          status?: string | null
          summary?: string | null
          tenure?: string | null
          units_count?: number | null
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          amenities?: string[] | null
          borough?: string | null
          completion_date?: string | null
          created_at?: string | null
          developer?: string | null
          id?: string
          images?: string[] | null
          images_count?: number | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name?: string
          nearby_stations?: Json | null
          postcode?: string | null
          prices?: Json | null
          schools?: Json | null
          stations?: Json | null
          status?: string | null
          summary?: string | null
          tenure?: string | null
          units_count?: number | null
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      epc_borough_area: {
        Row: {
          area_code: string
          created_at: string | null
          median_floor_m2: number
          sample_size: number | null
          updated_at: string | null
        }
        Insert: {
          area_code: string
          created_at?: string | null
          median_floor_m2: number
          sample_size?: number | null
          updated_at?: string | null
        }
        Update: {
          area_code?: string
          created_at?: string | null
          median_floor_m2?: number
          sample_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string | null
          email: string
          event_id: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string | null
          email: string
          event_id: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string | null
          email?: string
          event_id?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          dev_id: string | null
          display_order: number | null
          event_date: string
          event_time: string
          id: string
          image_url: string | null
          location: string | null
          registration_required: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dev_id?: string | null
          display_order?: number | null
          event_date: string
          event_time: string
          id?: string
          image_url?: string | null
          location?: string | null
          registration_required?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          dev_id?: string | null
          display_order?: number | null
          event_date?: string
          event_time?: string
          id?: string
          image_url?: string | null
          location?: string | null
          registration_required?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_dev_id_fkey"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_dev_id_fkey"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments_public"
            referencedColumns: ["id"]
          },
        ]
      }
      hottest_unit: {
        Row: {
          dev_id: string
          floorplan_url: string | null
          manual_override: boolean | null
          override_reason: string | null
          score: number | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          dev_id: string
          floorplan_url?: string | null
          manual_override?: boolean | null
          override_reason?: string | null
          score?: number | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          dev_id?: string
          floorplan_url?: string | null
          manual_override?: boolean | null
          override_reason?: string | null
          score?: number | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_hottest_unit_unit_id"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      nearby_cache: {
        Row: {
          category: string
          created_at: string | null
          dev_id: string
          fetched_at: string | null
          id: string
          results: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          dev_id: string
          fetched_at?: string | null
          id?: string
          results: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          dev_id?: string
          fetched_at?: string | null
          id?: string
          results?: Json
        }
        Relationships: []
      }
      nearby_categories: {
        Row: {
          created_at: string | null
          default_visible: boolean | null
          display_order: number | null
          icon: string | null
          id: string
          label: string
          name: string
          overpass_query: string | null
          radius_meters: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_visible?: boolean | null
          display_order?: number | null
          icon?: string | null
          id?: string
          label: string
          name: string
          overpass_query?: string | null
          radius_meters?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_visible?: boolean | null
          display_order?: number | null
          icon?: string | null
          id?: string
          label?: string
          name?: string
          overpass_query?: string | null
          radius_meters?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      neighbourhood_polygons: {
        Row: {
          area_type: string
          created_at: string | null
          id: string
          neighbourhood_id: string
          polygon_ids: Json
          price_per_sqft: number | null
          union_geometry: Json | null
          updated_at: string | null
        }
        Insert: {
          area_type?: string
          created_at?: string | null
          id?: string
          neighbourhood_id: string
          polygon_ids?: Json
          price_per_sqft?: number | null
          union_geometry?: Json | null
          updated_at?: string | null
        }
        Update: {
          area_type?: string
          created_at?: string | null
          id?: string
          neighbourhood_id?: string
          polygon_ids?: Json
          price_per_sqft?: number | null
          union_geometry?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "neighbourhood_polygons_neighbourhood_id_fkey"
            columns: ["neighbourhood_id"]
            isOneToOne: true
            referencedRelation: "neighbourhoods"
            referencedColumns: ["id"]
          },
        ]
      }
      neighbourhoods: {
        Row: {
          borough: string
          created_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          borough: string
          created_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          borough?: string
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ons_borough_price: {
        Row: {
          area_code: string
          created_at: string | null
          data_year: number | null
          median_price: number
          updated_at: string | null
        }
        Insert: {
          area_code: string
          created_at?: string | null
          data_year?: number | null
          median_price: number
          updated_at?: string | null
        }
        Update: {
          area_code?: string
          created_at?: string | null
          data_year?: number | null
          median_price?: number
          updated_at?: string | null
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
          service_charge: number | null
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
          service_charge?: number | null
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
          service_charge?: number | null
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
        Relationships: [
          {
            foreignKeyName: "price_lists_dev_id_fkey"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_lists_dev_id_fkey"
            columns: ["dev_id"]
            isOneToOne: false
            referencedRelation: "developments_public"
            referencedColumns: ["id"]
          },
        ]
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
          service_charge: number | null
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
          service_charge?: number | null
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
          service_charge?: number | null
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
      viewing_requests: {
        Row: {
          created_at: string | null
          development_id: string
          development_name: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string
          preferred_date: string
          preferred_time: string
          source: string | null
          status: string | null
          unit_id: string | null
          unit_number: string | null
          updated_at: string | null
          user_id: string | null
          voucher_code: string | null
        }
        Insert: {
          created_at?: string | null
          development_id: string
          development_name: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone: string
          preferred_date: string
          preferred_time: string
          source?: string | null
          status?: string | null
          unit_id?: string | null
          unit_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          voucher_code?: string | null
        }
        Update: {
          created_at?: string | null
          development_id?: string
          development_name?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string
          preferred_date?: string
          preferred_time?: string
          source?: string | null
          status?: string | null
          unit_id?: string | null
          unit_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          voucher_code?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      developments_public: {
        Row: {
          amenities: string[] | null
          borough: string | null
          completion_date: string | null
          created_at: string | null
          developer: string | null
          id: string | null
          images: string[] | null
          images_count: number | null
          lat: number | null
          lng: number | null
          location: string | null
          name: string | null
          nearby_stations: Json | null
          postcode: string | null
          prices: Json | null
          schools: Json | null
          stations: Json | null
          status: string | null
          summary: string | null
          tenure: string | null
          units_count: number | null
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          amenities?: string[] | null
          borough?: string | null
          completion_date?: string | null
          created_at?: string | null
          developer?: string | null
          id?: string | null
          images?: string[] | null
          images_count?: number | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name?: string | null
          nearby_stations?: Json | null
          postcode?: string | null
          prices?: Json | null
          schools?: Json | null
          stations?: Json | null
          status?: string | null
          summary?: string | null
          tenure?: string | null
          units_count?: number | null
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          amenities?: string[] | null
          borough?: string | null
          completion_date?: string | null
          created_at?: string | null
          developer?: string | null
          id?: string | null
          images?: string[] | null
          images_count?: number | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          name?: string | null
          nearby_stations?: Json | null
          postcode?: string | null
          prices?: Json | null
          schools?: Json | null
          stations?: Json | null
          status?: string | null
          summary?: string | null
          tenure?: string | null
          units_count?: number | null
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      compute_development_prices: {
        Args: { dev_id: string }
        Returns: Json
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
