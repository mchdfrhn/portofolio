// Page motion, in the spirit of a plotter drawing a sheet: rules draw, words
// set in, blocks settle. Everything is opt-in through data attributes, runs
// only when the visitor has not asked for reduced motion, and leaves content
// fully visible if this script never loads (see the head script in Layout).
//
//   data-m-intro           container whose [data-m-step] children play in order on load
//   data-m-split           heading whose words rise out of a mask
//   data-m-rule            hairline that draws from left to right
//   data-m-sheet           section header: its rule draws, its label sets in
//   data-m-reveal          block that settles in when scrolled into view
//   data-m-img             image frame that wipes open
//   data-m-progress        scroll progress hairline in the header
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const root = document.documentElement
const ready = () => root.classList.remove('motion-pending')
const EASE = 'power3.out'
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  [...scope.querySelectorAll<T>(sel)]

/** Split each language span of a Bi heading into masked words. */
function splitWords(el: HTMLElement): Element[] {
  const parts = $$('[data-lang]', el)
  return (parts.length ? parts : [el]).flatMap(
    (p) => SplitText.create(p, { type: 'words', mask: 'words', wordsClass: 'm-word' }).words,
  )
}

function intro(container: HTMLElement) {
  const tl = gsap.timeline({ defaults: { ease: EASE } })
  for (const step of $$('[data-m-step]', container)) {
    if (step.hasAttribute('data-m-split')) {
      tl.from(splitWords(step), { yPercent: 110, duration: 0.9, stagger: 0.045, ease: 'power4.out' }, '<0.15')
    } else if (step.hasAttribute('data-m-rule')) {
      tl.from(step, { scaleX: 0, duration: 0.9, ease: 'power2.inOut' }, '<0.25')
    } else if (step.tagName === 'DL') {
      tl.from(step.children, { opacity: 0, x: -10, duration: 0.5, stagger: 0.04 }, '<0.2')
    } else {
      tl.from(step, { opacity: 0, y: 14, duration: 0.6 }, '<0.12')
    }
  }
}

function sheets() {
  for (const sheet of $$('[data-m-sheet]')) {
    const tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: sheet, start: 'top 88%', once: true },
    })
    const rule = sheet.querySelector('[data-m-rule]')
    if (rule) tl.from(rule, { scaleX: 0, duration: 1.1, ease: 'power2.inOut' })
    tl.from(sheet.querySelectorAll('[data-m-label]'), { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, '<0.2')
  }
}

function splitHeadings() {
  for (const el of $$('[data-m-split]:not([data-m-step])')) {
    gsap.from(splitWords(el), {
      yPercent: 110,
      duration: 0.9,
      stagger: 0.035,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  }
}

/** Elements scrolled past (e.g. after a jump to #work) show at once; only on-screen ones animate. */
function onScreen(els: Element[], vars: gsap.TweenVars) {
  const passed = els.filter((e) => e.getBoundingClientRect().bottom <= 0)
  if (passed.length) {
    const { duration: _d, stagger: _s, ease: _e, ...end } = vars
    gsap.set(passed, end)
  }
  const visible = els.filter((e) => !passed.includes(e))
  if (visible.length) gsap.to(visible, vars)
}

function reveals() {
  gsap.set('[data-m-reveal]', { opacity: 0, y: 24 })
  ScrollTrigger.batch('[data-m-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) =>
      onScreen(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE, overwrite: true }),
  })

  gsap.set('[data-m-img]', { clipPath: 'inset(0 0 100% 0)' })
  ScrollTrigger.batch('[data-m-img]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) =>
      onScreen(els, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        stagger: 0.1,
        ease: 'power3.inOut',
        clearProps: 'clipPath',
      }),
  })
}

function progress() {
  const bar = document.querySelector('[data-m-progress]')
  if (!bar) return
  gsap.fromTo(
    bar,
    { scaleX: 0 },
    { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } },
  )
}

gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const introEl = document.querySelector<HTMLElement>('[data-m-intro]')
  if (introEl) intro(introEl)
  sheets()
  splitHeadings()
  reveals()
  progress()
  ready()
  // Images and web fonts change layout after load; re-measure trigger points.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
})

ready()
