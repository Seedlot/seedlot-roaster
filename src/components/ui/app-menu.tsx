"use client"

import { useState } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

export default function AppMenu({ onHome }: { onHome?: () => void }) {
  const [open, setOpen] = useState(false)
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()

  if (!isSignedIn) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 right-3 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-grey-20 shadow-sm hover:bg-grey-5 transition-colors"
        type="button"
        aria-label="Menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="relative ml-auto w-72 h-full bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-grey-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-charcoal text-sm">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-grey-50">
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-grey-5 transition-colors"
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Links */}
            <nav className="flex-1 p-3">
              {onHome && (
                <button
                  onClick={() => { setOpen(false); onHome() }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-charcoal hover:bg-grey-5 transition-colors"
                >
                  Home
                </button>
              )}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-grey-10">
              <button
                onClick={() => signOut({ redirectUrl: '/' })}
                className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
