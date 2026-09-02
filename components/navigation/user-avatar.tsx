import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getRoleTheme } from '@/lib/dashboard/role-theme'
import { cn } from '@/lib/utils'

export function localizedUserType(userType: string, t: (key: string) => string) {
  const label = t(`dashboard.roles.${userType}`)
  return label === `dashboard.roles.${userType}` ? userType : label
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
}

type UserAvatarProps = {
  name: string
  userType?: string
  avatarUrl?: string | null
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
}

export function UserAvatar({ name, userType, avatarUrl, size = 'md', className }: UserAvatarProps) {
  const theme = userType ? getRoleTheme(userType) : null

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
      ) : null}
      <AvatarFallback
        className={cn(
          'font-semibold',
          theme?.badge ?? 'bg-muted text-muted-foreground',
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
