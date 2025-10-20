import os
import stripe
from typing import Optional
from fastapi import HTTPException
from app.models.billing import StripeCustomer
from shared_core.utils.db import SessionLocal

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def get_client():
    """Get Stripe client"""
    return stripe


async def get_or_create_customer_for_tenant(db, tenant_id: int, email: str) -> str:
    """Get or create Stripe customer for tenant"""
    # Check if customer already exists
    existing = db.query(StripeCustomer).filter(StripeCustomer.tenant_id == tenant_id).first()
    if existing:
        return existing.customer_id
    
    # Create new customer
    try:
        customer = stripe.Customer.create(
            email=email,
            metadata={"tenant_id": str(tenant_id)}
        )
        
        # Save to database
        stripe_customer = StripeCustomer(
            tenant_id=tenant_id,
            customer_id=customer.id
        )
        db.add(stripe_customer)
        db.commit()
        
        return customer.id
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")


async def create_subscription(customer_id: str, price_id: str) -> dict:
    """Create Stripe subscription"""
    try:
        subscription = stripe.Subscription.create(
            customer=customer_id,
            items=[{"price": price_id}],
            payment_behavior="default_incomplete",
            payment_settings={"save_default_payment_method": "on_subscription"},
            expand=["latest_invoice.payment_intent"],
        )
        
        return {
            "subscription_id": subscription.id,
            "client_secret": subscription.latest_invoice.payment_intent.client_secret,
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")


async def handle_webhook(payload: bytes, sig_header: str) -> dict:
    """Handle Stripe webhook"""
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event["type"] == "customer.subscription.created":
        subscription = event["data"]["object"]
        # Handle subscription creation
        pass
    elif event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        # Handle subscription update
        pass
    elif event["type"] == "invoice.payment_succeeded":
        invoice = event["data"]["object"]
        # Handle successful payment
        pass
    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        # Handle failed payment
        pass
    else:
        print(f"Unhandled event type {event['type']}")
    
    return {"status": "success"}
