import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

const Turnstile = forwardRef(({ 
  siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA", 
  onVerify,
  theme = 'light',
  language = 'en'
}, ref) => {
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
    const cleanup = () => {
      if (window.turnstile && widgetId.current !== null) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }

    const renderTurnstile = () => {
      if (window.turnstile && containerRef.current) {
        // Map language codes to Turnstile supported languages
        const turnstileLanguage = language === 'zh' ? 'zh-CN' : 'en'
        
        console.log('Rendering Turnstile with theme:', theme, 'language:', turnstileLanguage)
        
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme,
          language: turnstileLanguage,
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

    // Clean up previous widget before rendering new one
    cleanup()

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

      return () => {
        clearInterval(checkTurnstile)
        cleanup()
      }
    }

    return cleanup
  }, [siteKey, onVerify, theme, language])

  return <div ref={containerRef}></div>
})

Turnstile.displayName = 'Turnstile'

export default Turnstile