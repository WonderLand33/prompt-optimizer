import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

const Turnstile = forwardRef(({ siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA", onVerify }, ref) => {
  const containerRef = useRef(null)
  const widgetId = useRef(null)

  useImperativeHandle(ref, () => ({
    getResponse: () => {
      if (window.turnstile && widgetId.current !== null) {
        return window.turnstile.getResponse(widgetId.current)
      }
      return null
    },
    reset: () => {
      if (window.turnstile && widgetId.current !== null) {
        window.turnstile.reset(widgetId.current)
      }
    }
  }))

  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && containerRef.current) {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            if (onVerify) {
              onVerify(token)
            }
          },
          'error-callback': () => {
            console.error('Turnstile error')
          },
          'expired-callback': () => {
            console.log('Turnstile expired')
          }
        })
      }
    }

    if (window.turnstile) {
      renderTurnstile()
    } else {
      // Wait for Turnstile to load
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile)
          renderTurnstile()
        }
      }, 100)

      return () => clearInterval(checkTurnstile)
    }

    return () => {
      if (window.turnstile && widgetId.current !== null) {
        window.turnstile.remove(widgetId.current)
      }
    }
  }, [siteKey, onVerify])

  return <div ref={containerRef}></div>
})

Turnstile.displayName = 'Turnstile'

export default Turnstile