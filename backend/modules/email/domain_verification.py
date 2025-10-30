# 📧 Domain Verification - Resend API

import asyncio
import logging
from typing import Dict, List, Optional

import httpx
from backend.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class DomainVerification:
    """Handle domain verification and DNS record validation for Resend."""
    
    def __init__(self):
        self.api_key = settings.resend_api_key
        self.base_url = "https://api.resend.com"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def verify_domain(self, domain: str) -> Dict:
        """Verify domain ownership and DNS records."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/domains",
                    headers=self.headers,
                    json={"name": domain}
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                logger.error(f"Domain verification failed: {e}")
                raise
    
    async def get_domain_status(self, domain: str) -> Dict:
        """Get domain verification status."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/domains/{domain}",
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                logger.error(f"Failed to get domain status: {e}")
                raise
    
    async def get_dns_records(self, domain: str) -> List[Dict]:
        """Get required DNS records for domain verification."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/domains/{domain}/records",
                    headers=self.headers
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                logger.error(f"Failed to get DNS records: {e}")
                raise
    
    def generate_dns_instructions(self, domain: str) -> Dict[str, str]:
        """Generate DNS setup instructions for domain."""
        return {
            "spf": f"v=spf1 include:spf.resend.com ~all",
            "dkim_1": f"resend._domainkey.{domain} → resend._domainkey.resend.com",
            "dkim_2": f"resend2._domainkey.{domain} → resend2._domainkey.resend.com", 
            "dkim_3": f"resend3._domainkey.{domain} → resend3._domainkey.resend.com",
            "return_path": f"rp._domainkey.{domain} → rp._domainkey.resend.com",
            "dmarc": f"v=DMARC1; p=none; rua=mailto:dmarc@{domain}; ruf=mailto:dmarc@{domain}; fo=1",
            "click_tracking": f"click.{domain} → click.resend.com"
        }
    
    async def check_dns_propagation(self, domain: str) -> Dict[str, bool]:
        """Check if DNS records have propagated."""
        import dns.resolver
        
        results = {}
        instructions = self.generate_dns_instructions(domain)
        
        try:
            # Check SPF record
            spf_records = dns.resolver.resolve(domain, 'TXT')
            spf_found = any('include:spf.resend.com' in str(record) for record in spf_records)
            results['spf'] = spf_found
            
            # Check DKIM records
            dkim_domains = [
                f"resend._domainkey.{domain}",
                f"resend2._domainkey.{domain}",
                f"resend3._domainkey.{domain}"
            ]
            
            dkim_results = []
            for dkim_domain in dkim_domains:
                try:
                    dns.resolver.resolve(dkim_domain, 'CNAME')
                    dkim_results.append(True)
                except:
                    dkim_results.append(False)
            
            results['dkim'] = all(dkim_results)
            
            # Check return path
            try:
                dns.resolver.resolve(f"rp._domainkey.{domain}", 'CNAME')
                results['return_path'] = True
            except:
                results['return_path'] = False
            
            # Check DMARC
            try:
                dmarc_records = dns.resolver.resolve(f"_dmarc.{domain}", 'TXT')
                dmarc_found = any('v=DMARC1' in str(record) for record in dmarc_records)
                results['dmarc'] = dmarc_found
            except:
                results['dmarc'] = False
            
            # Check click tracking
            try:
                dns.resolver.resolve(f"click.{domain}", 'CNAME')
                results['click_tracking'] = True
            except:
                results['click_tracking'] = False
                
        except Exception as e:
            logger.error(f"DNS propagation check failed: {e}")
            results = {key: False for key in ['spf', 'dkim', 'return_path', 'dmarc', 'click_tracking']}
        
        return results
    
    async def setup_domain(self, domain: str) -> Dict:
        """Complete domain setup process."""
        logger.info(f"Setting up domain: {domain}")
        
        # Step 1: Verify domain
        verification_result = await self.verify_domain(domain)
        logger.info(f"Domain verification initiated: {verification_result}")
        
        # Step 2: Get DNS instructions
        dns_instructions = self.generate_dns_instructions(domain)
        logger.info(f"DNS instructions generated for {domain}")
        
        # Step 3: Wait for DNS propagation (with timeout)
        max_attempts = 30  # 5 minutes with 10s intervals
        for attempt in range(max_attempts):
            dns_status = await self.check_dns_propagation(domain)
            all_verified = all(dns_status.values())
            
            if all_verified:
                logger.info(f"All DNS records verified for {domain}")
                break
            
            logger.info(f"DNS propagation check {attempt + 1}/{max_attempts}: {dns_status}")
            await asyncio.sleep(10)
        
        # Step 4: Get final domain status
        final_status = await self.get_domain_status(domain)
        
        return {
            "domain": domain,
            "verification": verification_result,
            "dns_instructions": dns_instructions,
            "dns_status": dns_status,
            "final_status": final_status,
            "all_verified": all(dns_status.values())
        }


# Convenience function
async def setup_converto_domain() -> Dict:
    """Setup converto.fi domain for Resend."""
    verifier = DomainVerification()
    return await verifier.setup_domain("converto.fi")
