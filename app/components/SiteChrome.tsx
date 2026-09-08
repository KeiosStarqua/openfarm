import Link from "next/link"

const links = [
  { href: "/", label: "Mở đầu" },
  { href: "/cho", label: "Chợ câu chuyện" },
  { href: "/nong-dan", label: "Nhật ký nông dân" },
]

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        <span className="stamp">OF</span>
        <span>
          <strong>OpenFarm</strong>
          <em>Từ ruộng đến bàn ăn</em>
        </span>
      </Link>
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-current={current === link.href || undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Nhật ký trồng trọt do nông dân ghi. Người mua đọc được cả mùa vụ.</p>
      <p>Sui · Move · Walrus · OpenFarm</p>
    </footer>
  )
}
