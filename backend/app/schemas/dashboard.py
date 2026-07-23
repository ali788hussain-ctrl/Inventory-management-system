from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_products: int
    active_products: int
    total_categories: int
    total_suppliers: int
    total_stock: int
    low_stock_products: int
    recent_transactions: int