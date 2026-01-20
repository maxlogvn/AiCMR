# API Call Pattern (Frontend)

Quy chuẩn gọi API từ frontend Next.js.

## Cấu Trúc

1. Định nghĩa Interface trong `src/types/`
2. Sử dụng Axios instance từ `src/lib/api`
3. Sử dụng TanStack Query (`useQuery`/`useMutation`)

## Axios Instance

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/backend/api/v1',
  timeout: 10000
});

// Interceptor: Tự động refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Refresh token và retry
      await refreshToken();
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

## useQuery (GET Requests)

```typescript
import { useQuery } from '@tanstack/react-query';
import type { User } from '@/types/user';

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{user.name}</div>;
}
```

## useMutation (POST/PUT/PATCH/DELETE)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function UpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      const res = await api.patch('/users/me', data);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      toast.success('Cập nhật thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    }
  });

  const handleSubmit = (data) => mutation.mutate(data);

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Upload File

```typescript
const uploadMutation = useMutation({
  mutationFn: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/uploads/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
});
```

## Error Handling

```typescript
try {
  await api.post('/endpoint', data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Unauthorized
    } else if (error.response?.status === 403) {
      // Forbidden
    } else if (error.response?.status === 422) {
      // Validation error
    }
  }
}
```

## Tham Chiếu
- Frontend libraries: `lookup/frontend-libraries.md`
- API endpoints: `lookup/api-endpoints.md`
- Frontend guide: `concepts/code-style-frontend.md`
