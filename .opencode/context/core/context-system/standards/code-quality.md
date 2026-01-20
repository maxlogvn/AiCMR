# Tiêu chuẩn chất lượng mã (Code Quality)

Core concept:
Code cần dễ đọc, dễ kiểm tra và dễ duy trì — ưu tiên code tự giải thích, hàm nhỏ, và sử dụng kiểu dữ liệu khi ngôn ngữ hỗ trợ.

Key points:
- Tên biến/hàm rõ nghĩa và theo quy ước ngôn ngữ (snake_case cho Python, camelCase/PascalCase cho JS/TS).
- Giữ hàm nhỏ (<50 dòng) và mỗi hàm chỉ đảm nhiệm một trách nhiệm (Single Responsibility).
- Sử dụng type hints / TypeScript types; chạy kiểm tra kiểu (mypy/tsc) trước khi commit.
- Viết test cho logic quan trọng (unit/integration); tích hợp CI để chạy pytest/tsc.
- Dùng lint/format (black/isort/eslint/prettier) và pre-commit hooks; commit message ngắn gọn mô tả "why".

Minimal example (Python):
```python
def compute_tax(amount: float, rate: float = 0.1) -> float:
    """Tính thuế đơn giản: amount * rate"""
    return round(amount * rate, 2)
```

References:
- .opencode/context/core/context-system/standards/mvi.md
- PEP8: https://peps.python.org/pep-0008/
- Conventional Commits: https://www.conventionalcommits.org/

Last Updated: 2026-01-20
