import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AlertState } from '@/types/data'

interface AlertNotificationProps {
  alert: AlertState | null
}

export function AlertNotification({ alert }: AlertNotificationProps) {
  if (!alert) return null

  return (
    <Alert
      className={`${
        alert.type === 'error'
          ? 'border-red-300 bg-red-50'
          : 'border-green-300 bg-green-50'
      } transition-all duration-300`}
    >
      {alert.type === 'error' ? (
        <AlertCircle className="h-4 w-4 text-red-700" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-green-700" />
      )}
      <AlertDescription
        className={alert.type === 'error' ? 'text-red-800' : 'text-green-800'}
      >
        {alert.message}
      </AlertDescription>
    </Alert>
  )
}
