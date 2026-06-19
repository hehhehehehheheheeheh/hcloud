"use client"

export default function ItemsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Kho rương vật phẩm</h1>
      <p className="mt-2 text-muted">Quản lý rương bảo mật cho Mini World / Minecraft.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface transition-colors hover:border-accent hover:bg-accent/5"
          >
            <div className="text-center">
              <div className="text-3xl">📦</div>
              <p className="mt-2 text-xs text-muted">Rương trống</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
