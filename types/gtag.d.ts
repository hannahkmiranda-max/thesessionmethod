interface Window {
  gtag: (
    command: 'event' | 'config' | 'js',
    targetId: string | Date,
    config?: Record<string, unknown>
  ) => void
  gtag_report_conversion: (url?: string) => boolean
  dataLayer: unknown[]
}
