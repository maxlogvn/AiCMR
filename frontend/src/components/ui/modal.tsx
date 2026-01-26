"use client"

/**
 * Modal Component - AiCMR Design System
 *
 * Cách dùng:
 * 1. Import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } từ '@/components/ui/modal'
 * 2. Wrap modal content với các sub-components phù hợp
 * 3. Control open/close state với open + onOpenChange props
 *
 * @example
 * ```tsx
 * import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '@/components/ui/modal'
 * import { useState } from 'react'
 *
 * export default function Example() {
 *   const [open, setOpen] = useState(false)
 *
 *   return (
 *     <Modal open={open} onOpenChange={setOpen}>
 *       <ModalContent>
 *         <ModalHeader>
 *           <ModalTitle>Bạn có chắc không?</ModalTitle>
 *           <ModalDescription>
 *             Hành động này không thể hoàn tác.
 *           </ModalDescription>
 *         </ModalHeader>
 *
 *         <ModalFooter>
 *           <Button variant="secondary" onClick={() => setOpen(false)}>
 *             Hủy
 *           </Button>
 *           <Button onClick={() => {
 *             // Do something
 *             setOpen(false)
 *           }}>
 *             Xác nhận
 *           </Button>
 *         </ModalFooter>
 *       </ModalContent>
 *     </Modal>
 *   )
 * }
 * ```
 *
 * Design System Principles:
 * - "Eliminate Choices" - Chỉ 1 modal style, không có size variants
 * - Opinionated - Spacing cố định (p-6), animation 200ms
 * - Documentation = Code - Examples inline, no separate docs
 */

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Modal - Root component (controls open/close state)
 *
 * Props:
 * - open (boolean) - Controlled open state
 * - onOpenChange (callback) - Called khi modal should close
 * - defaultOpen (boolean) - Uncontrolled open state
 * - ...props - All Radix Dialog props
 */
const Modal = DialogPrimitive.Root

/**
 * ModalTrigger - Button để mở modal
 *
 * Props:
 * - asChild (boolean) - Trigger as child element (default: false)
 * - ...props - All Radix DialogTrigger props
 */
const ModalTrigger = DialogPrimitive.Trigger

/**
 * ModalPortal - Renders modal outside DOM hierarchy
 *
 * Props:
 * - forceMount (boolean) - Force mount portal
 * - container (HTMLElement) - Container element
 * - ...props - All Radix DialogPortal props
 */
const ModalPortal = DialogPrimitive.Portal

/**
 * ModalOverlay - Backdrop (semi-transparent black)
 *
 * Styling:
 * - Fixed inset-0, z-50
 * - Background: bg-black/50 (50% opacity black)
 * - Backdrop blur: backdrop-blur-sm
 * - Animation: Fade in/out (200ms)
 */
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * ModalContent - Main modal content wrapper
 *
 * Props:
 * - className - Optional Tailwind classes
 * - ...props - All Radix DialogContent props
 *
 * Styling:
 * - Fixed center of screen: left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
 * - Max width: max-w-lg (512px)
 * - Padding: p-6 (24px)
 * - Rounded: sm:rounded-lg
 * - Shadow: shadow-lg
 * - Animation: Zoom in/out + slide + fade (200ms)
 */
const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Đóng</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

/**
 * ModalHeader - Header section với title và description
 *
 * Props:
 * - className - Optional Tailwind classes
 * - ...props - All standard div attributes
 *
 * Styling:
 * - Layout: flex flex-col space-y-1.5
 * - Text align: text-center sm:text-left (responsive)
 */
const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
ModalHeader.displayName = "ModalHeader"

/**
 * ModalTitle - Title text (h3 heading)
 *
 * Props:
 * - className - Optional Tailwind classes
 * - ...props - All standard h3 attributes
 *
 * Styling:
 * - Font size: text-lg (18px)
 * - Font weight: font-semibold (600)
 * - Line height: leading-none tracking-tight
 */
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

/**
 * ModalDescription - Description text (paragraph)
 *
 * Props:
 * - className - Optional Tailwind classes
 * - ...props - All standard p attributes
 *
 * Styling:
 * - Font size: text-sm (14px)
 * - Color: text-muted-foreground
 */
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

/**
 * ModalFooter - Footer section với action buttons
 *
 * Props:
 * - className - Optional Tailwind classes
 * - ...props - All standard div attributes
 *
 * Styling:
 * - Layout: flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2
 * - Responsive: Stack vertical on mobile, horizontal on desktop
 */
const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
ModalFooter.displayName = "ModalFooter"

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
}

/**
 * Usage Examples
 *
 * **Basic Controlled Modal:**
 * ```tsx
 * import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '@/components/ui/modal'
 * import { useState } from 'react'
 *
 * export default function BasicModal() {
 *   const [open, setOpen] = useState(false)
 *
 *   return (
 *     <Modal open={open} onOpenChange={setOpen}>
 *       <ModalContent>
 *         <ModalHeader>
 *           <ModalTitle>Bạn có chắc không?</ModalTitle>
 *           <ModalDescription>
 *             Hành động này không thể hoàn tác.
 *           </ModalDescription>
 *         </ModalHeader>
 *
 *         <ModalFooter>
 *           <Button variant="secondary" onClick={() => setOpen(false)}>
 *             Hủy
 *           </Button>
 *           <Button onClick={() => {
 *             // Do something
 *             setOpen(false)
 *           }}>
 *             Xác nhận
 *           </Button>
 *         </ModalFooter>
 *       </ModalContent>
 *     </Modal>
 *   )
 * }
 * ```
 *
 * **Modal with Trigger Button:**
 * ```tsx
 * import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '@/components/ui/modal'
 *
 * export default function TriggerModal() {
 *   return (
 *     <Modal>
 *       <ModalTrigger asChild>
 *         <Button>Mở Modal</Button>
 *       </ModalTrigger>
 *
 *       <ModalContent>
 *         <ModalHeader>
 *           <ModalTitle>Tiêu đề Modal</ModalTitle>
 *           <ModalDescription>
 *             Mô tả modal ở đây.
 *           </ModalDescription>
 *         </ModalHeader>
 *
 *         <div className="py-4">
 *           <p>Nội dung modal ở đây.</p>
 *         </div>
 *
 *         <ModalFooter>
 *           <Button variant="secondary">Đóng</Button>
 *           <Button>Xác nhận</Button>
 *         </ModalFooter>
 *       </ModalContent>
 *     </Modal>
 *   )
 * }
 * ```
 *
 * **Confirmation Modal:**
 * ```tsx
 * function DeleteConfirmationModal({ open, onConfirm, onCancel }) {
 *   return (
 *     <Modal open={open} onOpenChange={onCancel}>
 *       <ModalContent>
 *         <ModalHeader>
 *           <ModalTitle>Xóa mục</ModalTitle>
 *           <ModalDescription>
 *             Bạn có chắc muốn xóa mục này? Hành động này không thể hoàn tác.
 *           </ModalDescription>
 *         </ModalHeader>
 *
 *         <ModalFooter>
 *           <Button variant="secondary" onClick={onCancel}>
 *             Hủy
 *           </Button>
 *           <Button variant="destructive" onClick={onConfirm}>
 *             Xóa
 *           </Button>
 *         </ModalFooter>
 *       </ModalContent>
 *     </Modal>
 *   )
 * }
 *
 * // Usage
 * function MyComponent() {
 *   const [showDeleteModal, setShowDeleteModal] = useState(false)
 *
 *   const handleDelete = () => {
 *     // Delete logic here
 *     setShowDeleteModal(false)
 *   }
 *
 *   return (
 *     <>
 *       <Button onClick={() => setShowDeleteModal(true)}>Xóa</Button>
 *       <DeleteConfirmationModal
 *         open={showDeleteModal}
 *         onConfirm={handleDelete}
 *         onCancel={() => setShowDeleteModal(false)}
 *       />
 *     </>
 *   )
 * }
 * ```
 *
 * **Form Modal:**
 * ```tsx
 * import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '@/components/ui/modal'
 * import { FormLayout, FormField } from '@/components/ui/form-layout'
 * import { useForm } from 'react-hook-form'
 *
 * function CreateUserModal({ open, onOpenChange, onSubmit }) {
 *   const { register, handleSubmit } = useForm()
 *
 *   return (
 *     <Modal open={open} onOpenChange={onOpenChange}>
 *       <ModalContent className="max-w-2xl">
 *         <ModalHeader>
 *           <ModalTitle>Tạo người dùng mới</ModalTitle>
 *           <ModalDescription>
 *             Điền thông tin vào form bên dưới để tạo tài khoản người dùng mới.
 *           </ModalDescription>
 *         </ModalHeader>
 *
 *         <FormLayout onSubmit={handleSubmit(onSubmit)} columns={2}>
 *           <FormField
 *             label="Tên"
 *             name="firstName"
 *             required={true}
 *             {...register('firstName', { required: 'Tên là bắt buộc' })}
 *           />
 *
 *           <FormField
 *             label="Họ"
 *             name="lastName"
 *             required={true}
 *             {...register('lastName', { required: 'Họ là bắt buộc' })}
 *           />
 *
 *           <FormField
 *             label="Email"
 *             name="email"
 *             type="email"
 *             required={true}
 *             {...register('email', { required: 'Email là bắt buộc' })}
 *           />
 *
 *           <FormField
 *             label="Vai trò"
 *             name="role"
 *             placeholder="Chọn vai trò"
 *           />
 *
 *           <ModalFooter className="col-span-2">
 *             <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
 *               Hủy
 *             </Button>
 *             <Button type="submit">Tạo người dùng</Button>
 *           </ModalFooter>
 *         </FormLayout>
 *       </ModalContent>
 *     </Modal>
 *   )
 * }
 * ```
 */
