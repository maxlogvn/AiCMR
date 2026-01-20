# Frontend Libraries

Thư viện và công cụ dùng trong frontend Next.js.

## UI Components

**shadcn/ui**:
- Component cơ bản (Button, Card, Input...)
- Thêm mới: `docker compose exec frontend npx shadcn@latest add [component]`
- Styled with Tailwind CSS

**cn() utility**:
```typescript
import { cn } from '@/lib/utils';

cn("base-class", condition && "conditional-class");
```

## State Management

**TanStack Query** (Server State):
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId)
});
```

**Zustand** (Client State):
- Lưu tại `src/store/`
- Dùng cho theme, sidebar, auth state
```typescript
import useAuthStore from '@/store/authStore';

const { user, setUser } = useAuthStore();
```

## Form & Validation

**React Hook Form** + **Zod**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

## Notifications

**Sonner**:
```typescript
import { toast } from 'sonner';

toast.success("Thành công!");
toast.error("Lỗi: {}", error);
toast.info("Thông báo");
```

## Animation

**Framer Motion**:
```typescript
import { motion } from 'framer-motion';

<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  Content
</motion.div>
```

## Tham Chiếu
- Frontend guide: `concepts/code-style-frontend.md`
- API calling: `examples/api-call.md`
- Architecture: `concepts/architecture.md`
