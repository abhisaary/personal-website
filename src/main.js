const yearEl = document.querySelector('[data-year]')
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear())
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const saveData = Boolean(navigator.connection?.saveData)

function activateVideo(mediaRoot) {
  const video = mediaRoot.querySelector('.project-video')
  const fallback = mediaRoot.querySelector('.media-fallback')
  if (!video) return

  const mp4 = video.dataset.src
  const webm = video.dataset.srcWebm

  if (!mp4 && !webm) {
    mediaRoot.classList.add('is-fallback')
    return
  }

  const probe = async (url) => {
    if (!url) return false
    try {
      const response = await fetch(url, { method: 'HEAD' })
      if (!response.ok) return false
      const type = (response.headers.get('content-type') || '').toLowerCase()
      // Vite preview can SPA-fallback missing files as text/html with 200.
      return type.startsWith('video/')
    } catch {
      return false
    }
  }

  const showFallback = () => {
    mediaRoot.classList.remove('is-video')
    mediaRoot.classList.add('is-fallback')
  }

  Promise.all([probe(webm), probe(mp4)]).then(([hasWebm, hasMp4]) => {
    if (!hasWebm && !hasMp4) {
      showFallback()
      return
    }

    if (prefersReducedMotion || saveData) {
      showFallback()
      if (video.getAttribute('poster')) {
        mediaRoot.classList.add('is-poster')
      }
      return
    }

    video.replaceChildren()
    if (hasWebm) {
      const source = document.createElement('source')
      source.src = webm
      source.type = 'video/webm'
      video.appendChild(source)
    }
    if (hasMp4) {
      const source = document.createElement('source')
      source.src = mp4
      source.type = 'video/mp4'
      video.appendChild(source)
    }

    const onReady = () => {
      mediaRoot.classList.add('is-video')
      mediaRoot.classList.remove('is-fallback')
      video.play().catch(showFallback)
    }

    video.addEventListener('loadeddata', onReady, { once: true })
    video.addEventListener('error', showFallback, { once: true })
    video.load()
  })
}

document.querySelectorAll('.project-media').forEach(activateVideo)

function initPhoneSlideshow(root) {
  const slides = [...root.querySelectorAll('.phone-slideshow-viewport > img, .diet-history-pan')]
  const dots = [...root.querySelectorAll('.phone-slideshow-dots button')]
  const prevBtn = root.querySelector('[data-phone-prev]')
  const nextBtn = root.querySelector('[data-phone-next]')
  if (!slides.length) return

  const STILL_MS = 4000
  const HISTORY_MS = 7000
  let index = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains('is-active')),
  )
  let timer = null
  let paused = prefersReducedMotion

  const durationFor = (i) => (slides[i]?.classList.contains('diet-history-pan') ? HISTORY_MS : STILL_MS)

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length
    slides.forEach((slide, i) => {
      const active = i === index
      slide.classList.toggle('is-active', active)
      if (active && slide.classList.contains('diet-history-pan')) {
        const img = slide.querySelector('img')
        if (img) {
          img.style.animation = 'none'
          void img.offsetWidth
          img.style.animation = ''
        }
      }
    })
    dots.forEach((dot, i) => {
      const active = i === index
      dot.classList.toggle('is-active', active)
      dot.setAttribute('aria-selected', active ? 'true' : 'false')
    })
    schedule()
  }

  const schedule = () => {
    clearTimeout(timer)
    if (paused) return
    timer = window.setTimeout(() => show(index + 1), durationFor(index))
  }

  const setPaused = (nextPaused) => {
    paused = nextPaused || prefersReducedMotion
    root.classList.toggle('is-paused', paused)
    if (paused) clearTimeout(timer)
    else schedule()
  }

  prevBtn?.addEventListener('click', () => show(index - 1))
  nextBtn?.addEventListener('click', () => show(index + 1))
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => show(i))
  })

  root.addEventListener('pointerenter', () => setPaused(true))
  root.addEventListener('pointerleave', () => {
    if (!root.matches(':focus-within')) setPaused(false)
  })
  root.addEventListener('focusin', () => setPaused(true))
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) setPaused(false)
  })

  show(index)
}

document.querySelectorAll('[data-phone-slideshow]').forEach(initPhoneSlideshow)

const revealItems = document.querySelectorAll('.project')
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.16 },
  )
  revealItems.forEach((item) => {
    item.classList.add('will-reveal')
    observer.observe(item)
  })
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'))
}
