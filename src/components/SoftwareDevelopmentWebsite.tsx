import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Menu, X, Medal, Sparkles, Shield, Clock, Star } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

function AnimatedGroup({
  children,
  className,
  variants,
}: {
  children: React.ReactNode
  className?: string
  variants?: {
    container?: Variants
    item?: Variants
  }
}) {
  const containerVariants = variants?.container || defaultContainerVariants
  const itemVariants = variants?.item || defaultItemVariants

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const menuItems = [
  { name: "Услуги", href: "#services" },
  { name: "Галерея", href: "#gallery" },
  { name: "О нас", href: "#about" },
  { name: "Контакты", href: "#contact" },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav data-state={menuState && "active"} className="fixed z-20 w-full group">
        <div className={cn(
          "mx-auto max-w-7xl px-6 transition-all duration-300",
          isScrolled && "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
        )}>
          <div className="relative flex items-center justify-between gap-6 py-4">
            <a href="/" aria-label="home">
              <Logo />
            </a>

            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm font-medium">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a href={item.href} className="text-foreground/70 hover:text-foreground transition-colors duration-150">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:block">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-5"
                onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}
              >
                Оставить заявку
              </Button>
            </div>

            <button
              onClick={() => setMenuState(!menuState)}
              aria-label="Меню"
              className="relative z-20 block cursor-pointer p-2 lg:hidden"
            >
              <Menu className="group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 size-6 duration-200 text-foreground" />
              <X className="group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 scale-0 opacity-0 duration-200 text-foreground" />
            </button>
          </div>

          {/* Mobile menu */}
          <div className="group-data-[state=active]:block hidden pb-6 lg:hidden">
            <ul className="space-y-4 text-base font-medium border-t border-border pt-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a href={item.href} onClick={() => setMenuState(false)} className="text-foreground/70 hover:text-foreground block transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg"
              onClick={() => { setMenuState(false); document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}) }}
            >
              Оставить заявку
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="https://cdn.poehali.dev/projects/70dfa8fa-e1a8-4f30-9eb8-02de021f36df/bucket/b1e605a7-bd13-4ea6-8220-8dd5971e9880.png"
        alt="RCMetal"
        className="h-10 w-auto"
      />
    </div>
  )
}

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="bg-white absolute inset-0 m-auto flex size-12 items-center justify-center border border-amber-200 rounded-sm shadow-sm">
      {children}
    </div>
  </div>
)

function InfiniteRow({ photos, direction, onSelect }: { photos: string[], direction: 'left' | 'right', onSelect: (url: string) => void }) {
  const doubled = [...photos, ...photos]
  const animClass = direction === 'left' ? 'strip-left' : 'strip-right'
  return (
    <div className="w-full overflow-hidden">
      <div className={`flex ${animClass} gap-3 w-max`}>
        {doubled.map((url, i) => (
          <div
            key={i}
            onClick={() => onSelect(url)}
            className="aspect-square w-40 md:w-48 flex-shrink-0 overflow-hidden rounded-xl border border-orange-900/30 cursor-zoom-in group"
          >
            <img
              src={url}
              alt={`Работа ${(i % photos.length) + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function PhotoStrip({ photos }: { photos: string[] }) {
  const [selected, setSelected] = React.useState<string | null>(null)

  const row1 = photos.slice(0, Math.ceil(photos.length / 2))
  const row2 = photos.slice(Math.ceil(photos.length / 2))
  const row3 = [...photos].reverse().slice(0, Math.ceil(photos.length / 2))

  return (
    <>
      <style>{`
        @keyframes strip-left  { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes strip-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .strip-left  { animation: strip-left  28s linear infinite; }
        .strip-right { animation: strip-right 32s linear infinite; }
        .strip-left:hover, .strip-right:hover { animation-play-state: paused; }
        @keyframes photoIn { from { transform: scale(0.85); opacity:0; } to { transform: scale(1); opacity:1; } }
      `}</style>

      <div className="mt-12 md:mt-20 w-full flex flex-col gap-3">
        <InfiniteRow photos={row1} direction="left"  onSelect={setSelected} />
        <InfiniteRow photos={row2} direction="right" onSelect={setSelected} />
        <InfiniteRow photos={row3} direction="left"  onSelect={setSelected} />
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt="Увеличенное фото"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            style={{ animation: 'photoIn 0.25s ease' }}
          />
        </div>
      )}
    </>
  )
}

const SUBMIT_ORDER_URL = "https://functions.poehali.dev/fd8d856a-281a-4060-ae02-ddf67d5494bd"

const PRODUCTS = ["Наградная медаль", "Значок / нагрудный знак", "Брелок", "Корпоративная символика", "Другое"]

function OrderForm() {
  const [form, setForm] = React.useState({ name: '', phone: '', product: '', message: '' })
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(SUBMIT_ORDER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ name: '', phone: '', product: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-amber-500">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="text-white">
            <h2 className="text-4xl font-bold lg:text-5xl leading-tight">
              Оставьте заявку — рассчитаем стоимость бесплатно
            </h2>
            <p className="mt-4 text-amber-100 text-lg leading-relaxed">
              Опишите, что хотите изготовить. Мы свяжемся с вами в течение 2 часов и предложим решение.
            </p>
            <div className="mt-8 space-y-3">
              {["Бесплатный расчёт за 2 часа", "Минимальный тираж от 1 штуки", "Доставка по всей России"].map((t) => (
                <div key={t} className="flex items-center gap-3 text-amber-100">
                  <div className="size-2 rounded-full bg-white flex-shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-xl">
                <div className="text-4xl mb-4">🏅</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Заявка принята!</h3>
                <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-amber-600 hover:underline">
                  Отправить ещё одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 space-y-4 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Ваше имя *</label>
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="Иван Иванов"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Телефон *</label>
                    <input
                      name="phone" value={form.phone} onChange={handleChange} required
                      placeholder="+7 (999) 123-45-67"
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Что изготовить?</label>
                  <select
                    name="product" value={form.product} onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                  >
                    <option value="">Выберите изделие...</option>
                    {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Детали заказа</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} rows={4}
                    placeholder="Тираж, размер, материал, особые пожелания..."
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
                  />
                </div>
                {status === 'error' && <p className="text-sm text-red-500">Что-то пошло не так. Попробуйте ещё раз.</p>}
                <button
                  type="submit" disabled={status === 'loading'}
                  className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3.5 text-base transition-colors"
                >
                  {status === 'loading' ? 'Отправляем...' : 'Отправить заявку →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function SoftwareDevelopmentWebsite() {
  const BASE = "https://cdn.poehali.dev/projects/70dfa8fa-e1a8-4f30-9eb8-02de021f36df/bucket/gallery/"
  const galleryPhotos = [
    "2022-11-28 10-27-36.JPG",
    "2022-11-28 10-27-36_1669622268106.JPG",
    "2022-11-28 10-27-36_1669643908724.JPG",
    "2022-11-28 10-27-36_1669643912230.JPG",
    "2022-11-28 10-27-36_1669643916490.JPG",
    "2022-11-28 10-27-36_1669643920160.JPG",
    "2022-11-28 10-27-36_1669643923746.JPG",
    "2022-11-28 10-27-36_1669643930048.JPG",
    "2022-11-28 10-27-36_1669643933168.JPG",
    "2022-12-13 18-25-26.JPG",
    "2022-12-13 18-25-26_1670957913431.JPG",
    "2022-12-13 18-25-26_1670957918479.JPG",
    "2022-12-13 18-25-26_1670957921289.JPG",
    "2022-12-13 18-25-26_1670957924695.JPG",
    "2022-12-13 18-25-26_1670957932173.JPG",
    "2022-12-13 18-25-26_1670957934814.JPG",
    "2022-12-13 18-25-26_1670957937607.JPG",
    "2022-12-13 18-25-26_1670957940360.JPG",
    "2022-12-13 18-25-26_1670957942893.JPG",
    "2022-12-13 18-25-26_1670957945577.JPG",
  ]

  // Кодируем пробелы в именах файлов для корректных URL
  const toUrl = (f: string) => BASE + f.replace(/ /g, '%20')

  // Сетка использует первые 12 фото, галерея — оставшиеся 8 (без пересечений)
  const gridItems = galleryPhotos.slice(0, 12).map(toUrl)
  const galleryItems = galleryPhotos.slice(12).map(toUrl)

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">

        {/* Hero */}
        <section>
          <div className="relative pt-28 md:pt-40 pb-12 bg-gradient-to-b from-amber-50/70 via-white to-white">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center">
                <AnimatedGroup variants={transitionVariants}>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-4 py-1.5 text-sm font-medium text-amber-700 mb-6">
                    <Medal className="size-4" />
                    <span>Литейная мастерская · Ручная работа</span>
                  </div>

                  <h1 className="mt-2 max-w-4xl mx-auto font-extrabold text-foreground text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
                    Медали, значки<br />и брелоки{" "}
                    <span className="text-amber-500">под ваш заказ</span>
                  </h1>
                  <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
                    Литейная мастерская RCMETAL — наградные медали, фирменные значки и именные брелоки ручной работы из качественного металла.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{ container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } }, ...transitionVariants }}
                  className="mt-10 flex flex-col items-center justify-center gap-3 md:flex-row"
                >
                  <Button
                    size="lg"
                    className="rounded-xl px-8 text-base bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-200/60"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}
                  >
                    Оставить заявку
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-8 text-base border-2 border-border hover:border-amber-400 hover:text-amber-600 font-semibold text-foreground"
                    onClick={() => document.getElementById('gallery')?.scrollIntoView({behavior:'smooth'})}
                  >
                    Наши работы
                  </Button>
                </AnimatedGroup>

                {/* Stats */}
                <div className="mt-14 flex flex-wrap justify-center gap-8 md:gap-20">
                  {[
                    { num: "500+", label: "выполненных заказов" },
                    { num: "10 лет", label: "в производстве" },
                    { num: "от 1 шт", label: "минимальный тираж" },
                  ].map((s) => (
                    <div key={s.num} className="text-center">
                      <div className="text-3xl font-bold text-foreground">{s.num}</div>
                      <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <AnimatedGroup variants={{ container: { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } } }, ...transitionVariants }}>
              <PhotoStrip photos={gridItems} />
            </AnimatedGroup>
          </div>
        </section>

        {/* Категории */}
        <section id="services" className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground lg:text-5xl">Что мы изготавливаем</h2>
              <p className="mt-3 text-muted-foreground">Широкий ассортимент изделий из металла под любые задачи</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Medal className="size-8 text-amber-500" />, title: "Наградные медали", desc: "Спортивные и корпоративные медали любого дизайна. Литьё, гравировка, эмаль — воплотим любую идею." },
                { icon: <Star className="size-8 text-amber-500" />, title: "Значки и нагрудные знаки", desc: "Фирменные значки для сотрудников, мероприятий и брендирования. Высокая детализация и точная цветопередача." },
                { icon: <Sparkles className="size-8 text-amber-500" />, title: "Брелоки и сувениры", desc: "Именные брелоки, корпоративные сувениры и подарки с логотипом. Оригинальное решение для любого события." },
              ].map((cat) => (
                <div key={cat.title} className="group rounded-2xl border border-border bg-white p-8 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300">
                  <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground lg:text-5xl">
                Почему выбирают <span className="text-amber-500">RCMETAL</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Мы создаём изделия из металла с душой — каждая медаль несёт ваш уникальный образ
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <Star className="size-6 text-amber-500" />, title: "Ручная работа", desc: "Каждое изделие изготавливается вручную с вниманием к деталям — только авторское литьё." },
                { icon: <Shield className="size-6 text-amber-500" />, title: "Любой тираж", desc: "Берёмся за партии от 1 штуки и крупные тиражи — гибкие условия для любого заказа." },
                { icon: <Clock className="size-6 text-amber-500" />, title: "Точно в срок", desc: "Соблюдаем оговорённые сроки — получите изделия вовремя, даже перед важным мероприятием." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white border border-border p-8 text-center shadow-sm">
                  <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Form Section */}
        <OrderForm />

        {/* Gallery Section */}
        <section id="gallery" className="py-16 md:py-24 bg-white">
          <div className="text-center mb-10 px-6">
            <h2 className="text-4xl font-bold text-foreground lg:text-5xl">
              Наши <span className="text-amber-500">работы</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Медали, значки и брелоки, изготовленные в нашей мастерской
            </p>
          </div>
          <PhotoStrip photos={galleryItems} />
        </section>
      </main>

      <footer className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl py-14 px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="text-xl font-bold text-white tracking-wide">RC<span className="text-amber-400">METAL</span></div>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Литейная мастерская — наградные медали, значки и брелоки ручной работы под заказ.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Продукция</h3>
              <ul className="space-y-2 text-sm">
                {["Наградные медали", "Значки и нагрудные знаки", "Брелоки под заказ", "Корпоративная символика", "Спортивные награды"].map(t => (
                  <li key={t}><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">{t}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Компания</h3>
              <ul className="space-y-2 text-sm">
                {["О мастерской", "Наши работы", "Процесс производства", "Отзывы клиентов"].map(t => (
                  <li key={t}><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">{t}</a></li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Контакты</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>info@rcmetal.ru</li>
                <li>+7 (495) 123-45-67</li>
                <li>Москва, ул. Технопарковая, 15</li>
              </ul>
              <Button
                size="sm"
                className="mt-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold"
                onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}
              >
                Оставить заявку
              </Button>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">© 2024 RCMETAL. Все права защищены.</div>
            <div className="flex gap-6 text-sm">
              {["Политика конфиденциальности", "Условия использования"].map(t => (
                <a key={t} href="#" className="text-slate-500 hover:text-amber-400 transition-colors">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}