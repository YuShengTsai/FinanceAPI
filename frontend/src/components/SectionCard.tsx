import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <section className="card border-0 shadow-sm h-100 section-card">
      <div className="card-body p-4">
        <div className="mb-3">
          <h2 className="h4 mb-2">{title}</h2>
          {description ? <p className="text-secondary mb-0">{description}</p> : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  )
}
