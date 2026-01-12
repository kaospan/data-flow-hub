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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assistant_notes: {
        Row: {
          citations_json: Json | null
          content: string
          created_at: string
          id: string
          note_type: Database["public"]["Enums"]["note_type"]
          organization_id: string
          patient_id: string | null
        }
        Insert: {
          citations_json?: Json | null
          content: string
          created_at?: string
          id?: string
          note_type: Database["public"]["Enums"]["note_type"]
          organization_id: string
          patient_id?: string | null
        }
        Update: {
          citations_json?: Json | null
          content?: string
          created_at?: string
          id?: string
          note_type?: Database["public"]["Enums"]["note_type"]
          organization_id?: string
          patient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assistant_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assistant_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          after_state: Json | null
          before_state: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          organization_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          organization_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          automation_id: string
          completed_at: string | null
          error_message: string | null
          id: string
          organization_id: string
          result: Json | null
          rows_processed: number | null
          started_at: string
          status: string
        }
        Insert: {
          automation_id: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          organization_id: string
          result?: Json | null
          rows_processed?: number | null
          started_at?: string
          status?: string
        }
        Update: {
          automation_id?: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          organization_id?: string
          result?: Json | null
          rows_processed?: number | null
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_runs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_runs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          action_config: Json | null
          action_type: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          source_id: string | null
          trigger_config: Json | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          action_config?: Json | null
          action_type: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          source_id?: string | null
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          action_config?: Json | null
          action_type?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          source_id?: string | null
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      escalations: {
        Row: {
          created_at: string
          followup_item_id: string
          id: string
          level: Database["public"]["Enums"]["escalation_level"]
          organization_id: string
          resolved_at: string | null
          status: string
          target_role: Database["public"]["Enums"]["owner_role"]
          trigger_at: string
          triggered_at: string | null
        }
        Insert: {
          created_at?: string
          followup_item_id: string
          id?: string
          level?: Database["public"]["Enums"]["escalation_level"]
          organization_id: string
          resolved_at?: string | null
          status?: string
          target_role?: Database["public"]["Enums"]["owner_role"]
          trigger_at: string
          triggered_at?: string | null
        }
        Update: {
          created_at?: string
          followup_item_id?: string
          id?: string
          level?: Database["public"]["Enums"]["escalation_level"]
          organization_id?: string
          resolved_at?: string | null
          status?: string
          target_role?: Database["public"]["Enums"]["owner_role"]
          trigger_at?: string
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escalations_followup_item_id_fkey"
            columns: ["followup_item_id"]
            isOneToOne: false
            referencedRelation: "followup_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          id: string
          occurred_at: string
          organization_id: string
          patient_id: string
          payload_json: Json | null
          processed: boolean
          source: string
          type: Database["public"]["Enums"]["event_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          occurred_at?: string
          organization_id: string
          patient_id: string
          payload_json?: Json | null
          processed?: boolean
          source?: string
          type: Database["public"]["Enums"]["event_type"]
        }
        Update: {
          created_at?: string
          id?: string
          occurred_at?: string
          organization_id?: string
          patient_id?: string
          payload_json?: Json | null
          processed?: boolean
          source?: string
          type?: Database["public"]["Enums"]["event_type"]
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          mime_type: string
          name: string
          ocr_confidence: number | null
          organization_id: string
          original_name: string
          size_bytes: number
          source_id: string | null
          status: string
          storage_path: string
          text_direction: string | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          mime_type: string
          name: string
          ocr_confidence?: number | null
          organization_id: string
          original_name: string
          size_bytes: number
          source_id?: string | null
          status?: string
          storage_path: string
          text_direction?: string | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          mime_type?: string
          name?: string
          ocr_confidence?: number | null
          organization_id?: string
          original_name?: string
          size_bytes?: number
          source_id?: string | null
          status?: string
          storage_path?: string
          text_direction?: string | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      followup_items: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["followup_category"]
          closure_reason: string | null
          created_at: string
          created_by: string
          description: string
          due_at: string
          event_id: string | null
          id: string
          metadata: Json | null
          organization_id: string
          owner_role: Database["public"]["Enums"]["owner_role"]
          patient_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["followup_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["followup_category"]
          closure_reason?: string | null
          created_at?: string
          created_by?: string
          description: string
          due_at: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          owner_role?: Database["public"]["Enums"]["owner_role"]
          patient_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["followup_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["followup_category"]
          closure_reason?: string | null
          created_at?: string
          created_by?: string
          description?: string
          due_at?: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          owner_role?: Database["public"]["Enums"]["owner_role"]
          patient_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["followup_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "followup_items_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followup_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followup_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followup_items_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          consent_flags: Json | null
          contact_preferences: Json | null
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          name: string
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          consent_flags?: Json | null
          contact_preferences?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          consent_flags?: Json | null
          contact_preferences?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          channel: Database["public"]["Enums"]["reminder_channel"]
          created_at: string
          error_message: string | null
          followup_item_id: string
          id: string
          message_content: string | null
          organization_id: string
          recipient_email: string | null
          recipient_phone: string | null
          scheduled_at: string
          sent_at: string | null
          status: Database["public"]["Enums"]["reminder_status"]
        }
        Insert: {
          channel?: Database["public"]["Enums"]["reminder_channel"]
          created_at?: string
          error_message?: string | null
          followup_item_id: string
          id?: string
          message_content?: string | null
          organization_id: string
          recipient_email?: string | null
          recipient_phone?: string | null
          scheduled_at: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["reminder_status"]
        }
        Update: {
          channel?: Database["public"]["Enums"]["reminder_channel"]
          created_at?: string
          error_message?: string | null
          followup_item_id?: string
          id?: string
          message_content?: string | null
          organization_id?: string
          recipient_email?: string | null
          recipient_phone?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["reminder_status"]
        }
        Relationships: [
          {
            foreignKeyName: "reminders_followup_item_id_fkey"
            columns: ["followup_item_id"]
            isOneToOne: false
            referencedRelation: "followup_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sla_policies: {
        Row: {
          condition_json: Json | null
          created_at: string
          due_in_days: number
          escalation_schedule_json: Json | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_active: boolean
          organization_id: string
          reminder_schedule_json: Json | null
          updated_at: string
        }
        Insert: {
          condition_json?: Json | null
          created_at?: string
          due_in_days?: number
          escalation_schedule_json?: Json | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          is_active?: boolean
          organization_id: string
          reminder_schedule_json?: Json | null
          updated_at?: string
        }
        Update: {
          condition_json?: Json | null
          created_at?: string
          due_in_days?: number
          escalation_schedule_json?: Json | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_active?: boolean
          organization_id?: string
          reminder_schedule_json?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sla_policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          config: Json | null
          created_at: string
          created_by: string
          id: string
          last_sync_at: string | null
          name: string
          organization_id: string
          record_count: number | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          created_by: string
          id?: string
          last_sync_at?: string | null
          name: string
          organization_id: string
          record_count?: number | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          created_by?: string
          id?: string
          last_sync_at?: string | null
          name?: string
          organization_id?: string
          record_count?: number | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sources_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_stats: {
        Row: {
          automation_runs_month: number | null
          billing_cycle_start: string | null
          created_at: string
          files_uploaded_month: number | null
          grace_period_ends_at: string | null
          id: string
          is_view_only: boolean | null
          limits_exceeded_at: string | null
          max_automation_runs_month: number | null
          max_files_month: number | null
          max_rows_month: number | null
          max_sources: number | null
          organization_id: string
          plan_type: string
          rows_processed_month: number | null
          sources_count: number | null
          updated_at: string
        }
        Insert: {
          automation_runs_month?: number | null
          billing_cycle_start?: string | null
          created_at?: string
          files_uploaded_month?: number | null
          grace_period_ends_at?: string | null
          id?: string
          is_view_only?: boolean | null
          limits_exceeded_at?: string | null
          max_automation_runs_month?: number | null
          max_files_month?: number | null
          max_rows_month?: number | null
          max_sources?: number | null
          organization_id: string
          plan_type?: string
          rows_processed_month?: number | null
          sources_count?: number | null
          updated_at?: string
        }
        Update: {
          automation_runs_month?: number | null
          billing_cycle_start?: string | null
          created_at?: string
          files_uploaded_month?: number | null
          grace_period_ends_at?: string | null
          id?: string
          is_view_only?: boolean | null
          limits_exceeded_at?: string | null
          max_automation_runs_month?: number | null
          max_files_month?: number | null
          max_rows_month?: number | null
          max_sources?: number | null
          organization_id?: string
          plan_type?: string
          rows_processed_month?: number | null
          sources_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_stats_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      check_usage_limit: {
        Args: { _limit_type: string; _organization_id: string }
        Returns: string
      }
      get_slip_check_summary: {
        Args: { org_id: string }
        Returns: {
          high_priority_overdue: number
          open_count: number
          overdue_count: number
          referrals_without_appointments: number
          unassigned_count: number
        }[]
      }
      get_user_organization_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_usage: {
        Args: {
          _amount?: number
          _counter_type: string
          _organization_id: string
        }
        Returns: undefined
      }
      same_organization: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
      escalation_level: "1" | "2" | "3"
      event_type:
        | "referral"
        | "lab_result"
        | "discharge"
        | "visit_note"
        | "message"
        | "appointment"
      followup_category:
        | "schedule_appointment"
        | "repeat_test"
        | "review_result"
        | "medication_check"
        | "admin_other"
      followup_status: "open" | "in_progress" | "done" | "dismissed"
      note_type: "slip_check" | "weekly_summary" | "intake_summary"
      owner_role: "patient" | "staff" | "clinician"
      priority_level: "low" | "medium" | "high"
      reminder_channel: "email" | "sms" | "whatsapp" | "push" | "in_app"
      reminder_status: "queued" | "sent" | "delivered" | "failed" | "canceled"
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
      app_role: ["admin", "editor", "viewer"],
      escalation_level: ["1", "2", "3"],
      event_type: [
        "referral",
        "lab_result",
        "discharge",
        "visit_note",
        "message",
        "appointment",
      ],
      followup_category: [
        "schedule_appointment",
        "repeat_test",
        "review_result",
        "medication_check",
        "admin_other",
      ],
      followup_status: ["open", "in_progress", "done", "dismissed"],
      note_type: ["slip_check", "weekly_summary", "intake_summary"],
      owner_role: ["patient", "staff", "clinician"],
      priority_level: ["low", "medium", "high"],
      reminder_channel: ["email", "sms", "whatsapp", "push", "in_app"],
      reminder_status: ["queued", "sent", "delivered", "failed", "canceled"],
    },
  },
} as const
