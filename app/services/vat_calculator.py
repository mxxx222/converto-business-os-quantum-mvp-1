from typing import Optional
from decimal import Decimal
import json


class VATCalculator:
    """Finnish VAT calculation service"""
    
    # Finnish VAT rates (as of 2024)
    VAT_RATES = {
        "standard": Decimal("0.24"),  # 24%
        "reduced": Decimal("0.14"),   # 14% (food, books, etc.)
        "super_reduced": Decimal("0.10"),  # 10% (pharmaceuticals, etc.)
        "zero": Decimal("0.00"),      # 0% (exports, etc.)
    }
    
    # Product categories with reduced rates
    REDUCED_RATE_CATEGORIES = [
        "food", "books", "newspapers", "magazines", "transport_passengers",
        "hotels", "restaurants", "entertainment", "sports", "cultural_events"
    ]
    
    SUPER_REDUCED_RATE_CATEGORIES = [
        "pharmaceuticals", "medical_devices", "books_educational"
    ]

    @classmethod
    def calculate_vat(cls, amount: Decimal, category: Optional[str] = None, 
                     vat_rate: Optional[str] = None,
                     buyer_country: Optional[str] = None,
                     seller_country: Optional[str] = "FI",
                     buyer_vat_id: Optional[str] = None) -> dict:
        """
        Calculate VAT for given amount
        
        Args:
            amount: Net amount (without VAT)
            category: Product category (optional)
            vat_rate: Specific VAT rate to use (optional)
        
        Returns:
            dict with net, vat, gross amounts and rate used
        """
        # Reverse charge / intra-EU rules (simplified):
        # - B2B intra-EU (buyer VAT ID present, different country): reverse charge -> zero rate
        # - Exports (outside EU): zero
        intra_eu_b2b = buyer_vat_id and buyer_country and buyer_country != seller_country

        if intra_eu_b2b:
            rate = cls.VAT_RATES["zero"]
            rate_name = "reverse_charge"
        elif vat_rate and vat_rate in cls.VAT_RATES:
            rate = cls.VAT_RATES[vat_rate]
            rate_name = vat_rate
        elif category in cls.SUPER_REDUCED_RATE_CATEGORIES:
            rate = cls.VAT_RATES["super_reduced"]
            rate_name = "super_reduced"
        elif category in cls.REDUCED_RATE_CATEGORIES:
            rate = cls.VAT_RATES["reduced"]
            rate_name = "reduced"
        else:
            rate = cls.VAT_RATES["standard"]
            rate_name = "standard"
        
        vat_amount = amount * rate
        gross_amount = amount + vat_amount
        
        return {
            "net_amount": float(amount),
            "vat_amount": float(vat_amount),
            "gross_amount": float(gross_amount),
            "vat_rate": float(rate),
            "vat_rate_name": rate_name
        }

    @classmethod
    def calculate_net_from_gross(cls, gross_amount: Decimal, 
                               category: Optional[str] = None,
                               vat_rate: Optional[str] = None) -> dict:
        """
        Calculate net amount from gross amount (reverse calculation)
        
        Args:
            gross_amount: Gross amount (including VAT)
            category: Product category (optional)
            vat_rate: Specific VAT rate to use (optional)
        
        Returns:
            dict with net, vat, gross amounts and rate used
        """
        if vat_rate and vat_rate in cls.VAT_RATES:
            rate = cls.VAT_RATES[vat_rate]
        elif category in cls.SUPER_REDUCED_RATE_CATEGORIES:
            rate = cls.VAT_RATES["super_reduced"]
        elif category in cls.REDUCED_RATE_CATEGORIES:
            rate = cls.VAT_RATES["reduced"]
        else:
            rate = cls.VAT_RATES["standard"]
        
        # Net = Gross / (1 + VAT_rate)
        net_amount = gross_amount / (1 + rate)
        vat_amount = gross_amount - net_amount
        
        return {
            "net_amount": float(net_amount),
            "vat_amount": float(vat_amount),
            "gross_amount": float(gross_amount),
            "vat_rate": float(rate),
            "vat_rate_name": next(k for k, v in cls.VAT_RATES.items() if v == rate)
        }

    @classmethod
    def get_vat_rates(cls) -> dict:
        """Get all available VAT rates"""
        return {
            name: float(rate) for name, rate in cls.VAT_RATES.items()
        }

    @classmethod
    def get_categories(cls) -> dict:
        """Get product categories with their VAT rates"""
        return {
            "reduced_rate": cls.REDUCED_RATE_CATEGORIES,
            "super_reduced_rate": cls.SUPER_REDUCED_RATE_CATEGORIES,
            "standard_rate": "All other categories"
        }


# Convenience functions
def calculate_vat(amount: float, category: Optional[str] = None, 
                 vat_rate: Optional[str] = None) -> dict:
    """Calculate VAT for given amount (float input)"""
    return VATCalculator.calculate_vat(Decimal(str(amount)), category, vat_rate)


def calculate_net_from_gross(gross_amount: float, category: Optional[str] = None,
                           vat_rate: Optional[str] = None) -> dict:
    """Calculate net amount from gross amount (float input)"""
    return VATCalculator.calculate_net_from_gross(Decimal(str(gross_amount)), category, vat_rate)
