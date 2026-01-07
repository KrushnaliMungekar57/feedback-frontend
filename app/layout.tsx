import './globals.css'

export const metadata = {
  title: 'Feedback System',
  description: 'AI-powered feedback collection system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}