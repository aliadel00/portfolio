import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { lazyNamedExport } from '@/shared/lib/lazyNamedExport'

describe('lazyNamedExport', () => {
  it('fetches the module once and reuses it for render', async () => {
    const factory = vi.fn(async () => ({
      Widget: () => <p>ready</p>,
    }))
    const Widget = lazyNamedExport(factory, 'Widget')

    Widget.preload()
    Widget.preload()
    expect(factory).toHaveBeenCalledTimes(1)

    render(
      <Suspense fallback={null}>
        <Widget />
      </Suspense>,
    )

    expect(await screen.findByText('ready')).toBeInTheDocument()
    expect(factory).toHaveBeenCalledTimes(1)
  })
})
