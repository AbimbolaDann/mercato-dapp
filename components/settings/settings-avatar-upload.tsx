'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { UserAvatar } from '@/components/navigation/user-avatar'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { toast } from 'sonner'

type SettingsAvatarUploadProps = {
  userId: string
  displayName: string
  userType: string
  value: string | null
  onChange: (url: string | null) => void
}

export function SettingsAvatarUpload({
  userId,
  displayName,
  userType,
  value,
  onChange,
}: SettingsAvatarUploadProps) {
  const { t } = useI18n()
  const supabase = createClient()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error(t('settings.avatarInvalidFileType'))
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('settings.avatarTooLarge'))
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop() || 'png'
      const filePath = `${userId}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = urlData.publicUrl

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', userId)
      if (profileError) throw profileError

      onChange(publicUrl)
      window.dispatchEvent(new CustomEvent('mercato:profile-updated'))
      toast.success(t('settings.avatarUploaded'))
    } catch (error) {
      const err = error as { message?: string }
      console.error('Error uploading avatar:', err?.message ?? error)
      toast.error(t('settings.avatarUploadError'))
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemove = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('id', userId)
      if (error) throw error
      onChange(null)
      window.dispatchEvent(new CustomEvent('mercato:profile-updated'))
      toast.success(t('settings.avatarRemoved'))
    } catch (error) {
      const err = error as { message?: string }
      console.error('Error removing avatar:', err?.message ?? error)
      toast.error(t('settings.avatarUploadError'))
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <UserAvatar
          name={displayName}
          userType={userType}
          avatarUrl={value}
          size="md"
          className="h-20 w-20 text-lg"
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-full"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="mr-2 h-3.5 w-3.5" aria-hidden />
            {value ? t('settings.changeAvatar') : t('settings.uploadAvatar')}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isUploading}
              onClick={handleRemove}
            >
              <X className="mr-2 h-3.5 w-3.5" aria-hidden />
              {t('settings.removeAvatar')}
            </Button>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{t('settings.avatarHint')}</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleUpload}
      />
    </div>
  )
}
