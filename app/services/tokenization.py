from __future__ import annotations

import os
import base64
import json
import hmac
import hashlib
from typing import Dict

import requests
from cryptography.fernet import Fernet


class Tokenizer:
    """PII tokenization using Vault Transit if configured, else local Fernet.

    ENV:
      VAULT_ADDR, VAULT_TOKEN, VAULT_TRANSIT_KEY (e.g., 'pii')
      FERNET_KEY (fallback)
    """

    def __init__(self) -> None:
        self.vault_addr = os.getenv("VAULT_ADDR")
        self.vault_token = os.getenv("VAULT_TOKEN")
        self.vault_key = os.getenv("VAULT_TRANSIT_KEY", "pii")
        fkey = os.getenv("FERNET_KEY") or base64.urlsafe_b64encode(hashlib.sha256(b"default-key").digest())
        self.fernet = Fernet(fkey)

    def tokenize(self, plaintext: str) -> Dict[str, str]:
        if self.vault_addr and self.vault_token:
            try:
                url = f"{self.vault_addr}/v1/transit/encrypt/{self.vault_key}"
                headers = {"X-Vault-Token": self.vault_token}
                b64 = base64.b64encode(plaintext.encode()).decode()
                resp = requests.post(url, headers=headers, json={"plaintext": b64}, timeout=5)
                resp.raise_for_status()
                ct = resp.json()["data"]["ciphertext"]
                return {"token": ct}
            except Exception:
                pass
        # fallback
        token = self.fernet.encrypt(plaintext.encode()).decode()
        return {"token": token}

    def detokenize(self, token: str) -> str:
        if token.startswith("vault:v1:") and self.vault_addr and self.vault_token:
            try:
                url = f"{self.vault_addr}/v1/transit/decrypt/{self.vault_key}"
                headers = {"X-Vault-Token": self.vault_token}
                resp = requests.post(url, headers=headers, json={"ciphertext": token}, timeout=5)
                resp.raise_for_status()
                b64 = resp.json()["data"]["plaintext"]
                return base64.b64decode(b64.encode()).decode()
            except Exception:
                pass
        # fallback
        return self.fernet.decrypt(token.encode()).decode()


