// Nếu bạn vẫn thấy lỗi sau khi xóa cache, hãy sử dụng import trực tiếp này thay vì wrapper

// SAU: Sử dụng trong file page.tsx:
// import { Badge } from "@/components/ui/badge";
// thay vì:
// import { Badge } from "@/components/ui/badge-wrapped";

// Hiện tại file src/components/ui/badge-wrapped.tsx đang import từ badge.tsx
// Có thể Next.js không thể resolve alias -> wrapper correctly
// Import trực tiếp có thể resolve vấn đề này

export { BADGE_IMPORT_DIRECT } = "badge.tsx";
export { BADGE_IMPORT_WRAPPED } = "badge-wrapped.tsx";
