"use client"

/**
 * Toast Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Import { toast, Toaster } từ '@/components/ui/toast'
 * 2. Thêm <Toaster /> vào root layout (app/layout.tsx)
 * 3. Gọi toast.success(), toast.error(), toast.warning() khi cần
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { Toaster } from '@/components/ui/toast'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Toaster
 *           position="bottom-right"
 *           expand={false}
 *           richColors
 *           closeButton
 *         />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Usage in component
 * import { toast } from '@/components/ui/toast'
 *
 * function MyComponent() {
 *   const handleClick = () => {
 *     toast.success('Thao tác thành công!')
 *     toast.error('Có lỗi xảy ra!')
 *     toast.warning('Vui lòng kiểm tra lại')
 *   }
 *
 *   return <button onClick={handleClick}>Hiển thị Toast</button>
 * }
 * ```
 *
 * Design System Principles:
 * - "Eliminate Choices" - Chỉ 3 toast variants (success, error, warning)
 * - Opinionated - Position bottom-right, auto-dismiss 5s
 * - Documentation = Code - Examples inline, no separate docs
 */

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner"

/**
 * Toast - Toast notifications function
 *
 * Variants:
 * - success (green) - Success messages, confirmations
 * - error (red) - Errors, failures, validation issues
 * - warning (yellow) - Warnings, pending actions, notifications
 *
 * Features:
 * - Auto-dismiss sau 5 giây
 * - Click để dismiss
 * - Stack nhiều toast
 * - Smooth enter/exit animation
 * - ARIA live regions (accessible)
 */
export const toast = sonnerToast

/**
 * Toaster - Renders toast container
 *
 * Props:
 * - position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"
 * - expand: boolean - Expand toast on hover
 * - richColors: boolean - Use rich color scheme
 * - closeButton: boolean - Show close button
 * - duration: number - Auto-dismiss duration (ms)
 * - ...props - All Sonner Toaster props
 *
 * Recommended Config:
 * - position: "bottom-right"
 * - expand: false
 * - richColors: true
 * - closeButton: true
 * - duration: 5000 (5 seconds)
 */
export const Toaster = SonnerToaster

export {
  /**
   * Toast Types (re-export from sonner)
   */
  toast,
}

/**
 * Usage Examples
 *
 * **Basic Success Toast:**
 * ```tsx
 * import { toast } from '@/components/ui/toast'
 *
 * function MyComponent() {
 *   const handleSuccess = () => {
 *     toast.success('Người dùng đã được tạo thành công!')
 *   }
 *
 *   return <Button onClick={handleSuccess}>Tạo người dùng</Button>
 * }
 * ```
 *
 * **Error Toast:**
 * ```tsx
 * function MyComponent() {
 *   const handleError = () => {
 *     toast.error('Không thể tạo người dùng. Vui lòng thử lại.')
 *   }
 *
 *   return <Button onClick={handleError}>Tạo người dùng</Button>
 * }
 * ```
 *
 * **Warning Toast:**
 * ```tsx
 * function MyComponent() {
 *   const handleWarning = () => {
 *     toast.warning('Vui lòng điền tất cả các trường bắt buộc.')
 *   }
 *
 *   return <Button onClick={handleWarning}>Gửi</Button>
 * }
 * ```
 *
 * **Toast with Action:**
 * ```tsx
 * import { toast } from '@/components/ui/toast'
 * import { Button } from '@/components/ui/button'
 *
 * function MyComponent() {
 *   const handleWithAction = () => {
 *     toast('Người dùng đã được tạo thành công', {
 *       action: {
 *         label: 'Xem',
 *         onClick: () => {
 *           // Navigate to user profile
 *           console.log('Xem người dùng')
 *         },
 *       },
 *     })
 *   }
 *
 *   return <Button onClick={handleWithAction}>Tạo người dùng</Button>
 * }
 * ```
 *
 * **Promise Toast:**
 * ```tsx
 * import { toast } from '@/components/ui/toast'
 *
 * function MyComponent() {
 *   const handleAsync = async () => {
 *     toast.promise(
 *       fetch('/api/users', {
 *         method: 'POST',
 *         body: JSON.stringify({ name: 'John' }),
 *       }),
 *       {
 *         loading: 'Đang tạo người dùng...',
 *         success: 'Người dùng đã được tạo thành công!',
 *         error: 'Không thể tạo người dùng',
 *       }
 *     )
 *   }
 *
 *   return <Button onClick={handleAsync}>Tạo người dùng</Button>
 * }
 * ```
 *
 * **Form Validation Toasts:**
 * ```tsx
 * import { useForm } from 'react-hook-form'
 * import { toast } from '@/components/ui/toast'
 *
 * function UserForm() {
 *   const { handleSubmit, register } = useForm()
 *
 *   const onSubmit = async (data) => {
 *     try {
 *       const response = await fetch('/api/users', {
 *         method: 'POST',
 *         body: JSON.stringify(data),
 *       })
 *
 *       if (!response.ok) {
 *         throw new Error('Không thể tạo người dùng')
 *       }
 *
 *       toast.success('Người dùng đã được tạo thành công!')
 *     } catch (error) {
 *       toast.error(error.message)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       {/* Form fields */}
 *       <button type="submit">Gửi</button>
 *     </form>
 *   )
 * }
 * ```
 *
 * **Custom Icon Toast:**
 * ```tsx
 * import { toast } from '@/components/ui/toast'
 * import { CheckCircle } from 'lucide-react'
 *
 * function MyComponent() {
 *   const handleCustom = () => {
 *     toast.success('Người dùng đã được tạo!', {
 *       icon: <CheckCircle className="h-5 w-5" />,
 *     })
 *   }
 *
 *   return <Button onClick={handleCustom}>Tạo người dùng</Button>
 * }
 * ```
 *
 * **Multiple Toasts:**
 * ```tsx
 * function MyComponent() {
 *   const handleMultiple = () => {
 *     toast.success('Toast 1')
 *     toast.error('Toast 2')
 *     toast.warning('Toast 3')
 *   }
 *
 *   return <Button onClick={handleMultiple}>Hiển thị nhiều Toast</Button>
 * }
 * ```
 *
 * **Persistent Toast (no auto-dismiss):**
 * ```tsx
 * function MyComponent() {
 *   const handlePersistent = () => {
 *     toast.warning('Cần xác nhận từ bạn', {
 *       duration: Infinity, // Never auto-dismiss
 *     })
 *   }
 *
 *   return <Button onClick={handlePersistent}>Hiển thị Toast</Button>
 * }
 * ```
 *
 * **Dismissible Toast:**
 * ```tsx
 * function MyComponent() {
 *   const handleDismissible = () => {
 *     toast.success('Click để đóng', {
 *       dismissible: true, // Allow click to dismiss (default: true)
 *     })
 *   }
 *
 *   return <Button onClick={handleDismissible}>Hiển thị Toast</Button>
 * }
 * ```
 *
 * **Position Options:**
 * ```tsx
 * // In app/layout.tsx
 * import { Toaster } from '@/components/ui/toast'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         {/* Bottom-right (recommended) *\/}
 *         <Toaster position="bottom-right" />
 *
 *         {/* Top-right *\/}
 *         <Toaster position="top-right" />
 *
 *         {/* Bottom-left *\/}
 *         <Toaster position="bottom-left" />
 *
 *         {/* Top-left *\/}
 *         <Toaster position="top-left" />
 *
 *         {/* Top-center *\/}
 *         <Toaster position="top-center" />
 *
 *         {/* Bottom-center *\/}
 *         <Toaster position="bottom-center" />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 *
 * **Accessibility Features:**
 *
 * - ARIA live regions: Screen readers announce toast content
 * - Role attributes: status (success), alert (error)
 * - Keyboard navigation: Tab to focus, Enter/Space to dismiss
 * - Focus management: Focus returns to trigger after dismiss
 *
 * **Toast Variants:**
 *
 * **Success (Green):**
 * - Icon: CheckCircle hoặc Check
 * - Color: green-500 (background), white (text)
 * - Use for: Successful operations, confirmations
 *
 * **Error (Red):**
 * - Icon: XCircle hoặc X
 * - Color: red-500 (background), white (text)
 * - Use for: Errors, failures, validation issues
 *
 * **Warning (Yellow):**
 * - Icon: AlertCircle hoặc AlertTriangle
 * - Color: yellow-500 (background), black (text)
 * - Use for: Warnings, pending actions, notifications
 *
 * **Animation Details:**
 *
 * **Duration:** 5000ms (5 seconds)
 *
 * **Animations:**
 * - Enter: Slide up + fade in
 * - Exit: Slide down + fade out
 * - Smooth transition: 200ms
 *
 * **Dismissal:**
 * - Click: Dismiss toast
 * - Escape: Dismiss all toasts (if configured)
 * - Auto-dismiss: 5 seconds (default)
 * - Hover: Pause auto-dismiss
 */
