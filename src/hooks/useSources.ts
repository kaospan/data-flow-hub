import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Source {
  id: string;
  name: string;
  type: 'spreadsheet' | 'api' | 'database' | 'file';
  status: 'active' | 'processing' | 'error' | 'pending';
  recordCount: number;
  lastSyncAt: string | null;
  createdAt: string;
}

export interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  ocrConfidence: number | null;
  textDirection: 'ltr' | 'rtl' | 'auto' | 'mixed';
  sourceId: string | null;
  createdAt: string;
}

export function useSources() {
  const { organization, user } = useAuth();
  const { toast } = useToast();
  const [sources, setSources] = useState<Source[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = useCallback(async () => {
    if (!organization?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSources(
        (data || []).map(s => ({
          id: s.id,
          name: s.name,
          type: s.type as Source['type'],
          status: s.status as Source['status'],
          recordCount: s.record_count || 0,
          lastSyncAt: s.last_sync_at,
          createdAt: s.created_at,
        }))
      );
    } catch (err) {
      console.error('Error fetching sources:', err);
      setError('Failed to load sources');
    }
  }, [organization?.id]);

  const fetchFiles = useCallback(async () => {
    if (!organization?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setFiles(
        (data || []).map(f => ({
          id: f.id,
          name: f.name,
          originalName: f.original_name,
          mimeType: f.mime_type,
          sizeBytes: f.size_bytes,
          storagePath: f.storage_path,
          status: f.status as FileRecord['status'],
          ocrConfidence: f.ocr_confidence ? Number(f.ocr_confidence) : null,
          textDirection: (f.text_direction || 'auto') as FileRecord['textDirection'],
          sourceId: f.source_id,
          createdAt: f.created_at,
        }))
      );
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  }, [organization?.id]);

  useEffect(() => {
    if (!organization?.id) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSources(), fetchFiles()]);
      setIsLoading(false);
    };

    loadData();

    // Realtime subscriptions
    const channel = supabase
      .channel('sources-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sources' }, () => {
        fetchSources();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, () => {
        fetchFiles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization?.id, fetchSources, fetchFiles]);

  const createSource = async (name: string, type: Source['type']) => {
    if (!organization?.id || !user?.id) {
      toast({
        title: 'Error',
        description: 'Not authenticated',
        variant: 'destructive',
      });
      return null;
    }

    // Check limits
    const { data: limitError } = await supabase.rpc('check_usage_limit', {
      _organization_id: organization.id,
      _limit_type: 'sources',
    });

    if (limitError) {
      toast({
        title: 'Limit Reached',
        description: limitError,
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('sources')
        .insert({
          organization_id: organization.id,
          created_by: user.id,
          name,
          type,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Increment usage counter
      await supabase.rpc('increment_usage', {
        _organization_id: organization.id,
        _counter_type: 'sources',
        _amount: 1,
      });

      toast({
        title: 'Success',
        description: 'Source created successfully',
      });

      return data;
    } catch (err) {
      console.error('Error creating source:', err);
      toast({
        title: 'Error',
        description: 'Failed to create source',
        variant: 'destructive',
      });
      return null;
    }
  };

  const uploadFile = async (file: File, sourceId?: string) => {
    if (!organization?.id || !user?.id) {
      toast({
        title: 'Error',
        description: 'Not authenticated',
        variant: 'destructive',
      });
      return null;
    }

    // Check limits
    const { data: limitError } = await supabase.rpc('check_usage_limit', {
      _organization_id: organization.id,
      _limit_type: 'files',
    });

    if (limitError) {
      toast({
        title: 'Limit Reached',
        description: limitError,
        variant: 'destructive',
      });
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const storagePath = `${organization.id}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Create file record
      const { data, error: insertError } = await supabase
        .from('files')
        .insert({
          organization_id: organization.id,
          uploaded_by: user.id,
          source_id: sourceId || null,
          name: fileName,
          original_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          storage_path: storagePath,
          status: 'uploaded',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Increment usage counter
      await supabase.rpc('increment_usage', {
        _organization_id: organization.id,
        _counter_type: 'files',
        _amount: 1,
      });

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      return data;
    } catch (err) {
      console.error('Error uploading file:', err);
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteSource = async (sourceId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('sources')
        .delete()
        .eq('id', sourceId);

      if (deleteError) throw deleteError;

      // Decrement usage counter
      if (organization?.id) {
        await supabase.rpc('increment_usage', {
          _organization_id: organization.id,
          _counter_type: 'sources',
          _amount: -1,
        });
      }

      toast({
        title: 'Success',
        description: 'Source deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting source:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete source',
        variant: 'destructive',
      });
    }
  };

  const getFileUrl = async (storagePath: string) => {
    const { data } = await supabase.storage
      .from('files')
      .createSignedUrl(storagePath, 3600);
    return data?.signedUrl || null;
  };

  return {
    sources,
    files,
    isLoading,
    error,
    createSource,
    uploadFile,
    deleteSource,
    getFileUrl,
    refetch: () => {
      fetchSources();
      fetchFiles();
    },
  };
}
