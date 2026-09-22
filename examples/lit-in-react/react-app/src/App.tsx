// Registering the custom element is a SIDE EFFECT of importing the module:
// Lit's @customElement decorator calls customElements.define() at module
// evaluation time. If this import is ever dropped (or tree-shaken away because
// nothing else references it), <demo-greetingcard> renders as an inert,
// un-upgraded inline element with NO console error — see the "Known failure
// mode" section in ../../README.md.
import 'lit-component/src/components/greetingcard'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from 'react'
import './App.css'

type GreetingcardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  name?: string
  items?: string[]
}

// JSX typing for the custom element.
//
// This MUST be `declare module 'react'`, NOT the widely-cited
// `declare global { namespace JSX { ... } }`. Under @types/react@19+ there is
// no global JSX namespace left to merge into — JSX now lives nested inside
// `declare namespace React` — so the `declare global` form is silently
// ignored and tsc still reports:
//   TS2339: Property 'demo-greetingcard' does not exist on type
//           'JSX.IntrinsicElements'
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'demo-greetingcard': GreetingcardProps
    }
  }
}

const ITEMS = ['tea', 'coffee']

function App() {
  const cardRef = useRef<HTMLElement>(null)
  const [lastGreeted, setLastGreeted] = useState<string | null>(null)

  // Memoised on purpose. removeEventListener() only detaches a listener if it
  // is handed the SAME function reference that addEventListener() received.
  // An inline arrow would be a fresh reference on every render: the add would
  // work, the remove would silently no-op, and every remount — including React
  // Strict Mode's deliberate double-invoke in dev — would leak a listener.
  const handleGreetingClicked = useCallback((event: Event) => {
    const { name } = (event as CustomEvent<{ name: string }>).detail
    setLastGreeted(name)
  }, [])

  // Custom events are not in React's event map: there is no `onGreetingClicked`.
  // Listening to Lit's CustomEvent is imperative, via a ref, with cleanup.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    el.addEventListener('greeting-clicked', handleGreetingClicked)
    return () => {
      el.removeEventListener('greeting-clicked', handleGreetingClicked)
    }
  }, [handleGreetingClicked])

  return (
    <section id="center">
      <h1>A Lit component in a React app</h1>

      {/*
        `items={ITEMS}` passes a real JS array. On React 19 a non-string JSX
        value on a custom element is set as a DOM *property*, so it arrives at
        the Lit @property({ type: Array }) intact — no JSON string, no
        "tea,coffee" stringification. Pre-React-19 this needed an imperative
        `ref.current.items = ITEMS` in a useEffect; see ../../README.md.
      */}
      <demo-greetingcard ref={cardRef} name="World" items={ITEMS} />

      {lastGreeted !== null && <p>Last greeted: {lastGreeted}</p>}

      {/*
        Shadow DOM isolation, visible on the page: this <ul>/<li> lives in the
        host document and DOES pick up the bare `ul`/`li` element rules from
        src/index.css. The identical <ul>/<li> that <demo-greetingcard> renders
        inside its shadow root above does NOT. Same markup, different styling.
      */}
      <p>The same list, rendered by the host React app instead:</p>
      <ul>
        {ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default App
