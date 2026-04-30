"use client"

import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart()

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return ""
    
    let message = "Hola! Me gustaria hacer el siguiente pedido:\n\n"
    items.forEach((item, index) => {
      const price = item.priceMayor > 0 ? ` - $${item.priceMayor.toLocaleString("es-AR")}` : ""
      message += `${index + 1}. ${item.name} (Cod: ${item.code}) x${item.quantity}${price}\n`
    })
    message += `\nTotal de items: ${totalItems}\n\nGracias!`
    
    return encodeURIComponent(message)
  }

  const whatsappUrl = `https://wa.me/5491150628422?text=${generateWhatsAppMessage()}`

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#1EA7E1]" />
              <h2 className="text-lg font-semibold">Tu Pedido</h2>
              {totalItems > 0 && (
                <span className="rounded-full bg-[#1EA7E1] px-2 py-0.5 text-xs font-medium text-white">
                  {totalItems}
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">
                  Tu carrito esta vacio
                </p>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Agrega productos desde el catalogo
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.code}
                    className="flex gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:shadow-sm"
                  >
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#E6F6FD]">
                      {item.image ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-[#1EA7E1]/40" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-medium leading-tight">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Cod: {item.code}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.code, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.code, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeItem(item.code)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-4">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de productos:</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a]"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Finalizar pedido por WhatsApp
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
