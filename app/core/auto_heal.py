"""
Auto-Heal Engine - Self-Correcting AI System

Automatically detects errors, suggests fixes, and learns from corrections.
"""

import os
import json
import hashlib
from datetime import datetime
from typing import Dict, Any, Optional, List
from pathlib import Path
from app.core.ai_adapter import AIAdapter


class AutoHealEngine:
    """
    AI-powered error detection and auto-correction system
    
    Features:
    - Error fingerprinting
    - AI-suggested fixes
    - Learning from successful corrections
    - Knowledge base persistence
    """
    
    def __init__(self, kb_path: str = "data/auto_heal_kb.json"):
        self.ai = AIAdapter()
        self.kb_path = Path(kb_path)
        self.knowledge_base = self._load_knowledge_base()
        self.error_history: List[Dict[str, Any]] = []
    
    def create_fingerprint(self, error: Exception, context: Dict[str, Any]) -> str:
        """
        Create unique fingerprint for error
        
        Args:
            error: Exception object
            context: Error context (file, line, stack trace)
            
        Returns:
            16-character hash string
        """
        signature = (
            f"{type(error).__name__}|"
            f"{str(error)}|"
            f"{context.get('file', '')}|"
            f"{context.get('function', '')}"
        )
        return hashlib.sha256(signature.encode()).hexdigest()[:16]
    
    def analyze_error(
        self,
        error: Exception,
        context: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """
        Analyze error and suggest fix
        
        Args:
            error: Exception object
            context: Error context
            
        Returns:
            {
                "fingerprint": str,
                "suggestion": str (code diff),
                "confidence": float,
                "known_fix": bool
            }
        """
        fingerprint = self.create_fingerprint(error, context)
        
        # Check if we've seen this before
        if fingerprint in self.knowledge_base:
            kb_entry = self.knowledge_base[fingerprint]
            
            # Update occurrence count
            kb_entry["count"] += 1
            kb_entry["last_seen"] = datetime.now().isoformat()
            
            # Return known fix if exists
            if kb_entry.get("successful_fix"):
                self._save_knowledge_base()
                return {
                    "fingerprint": fingerprint,
                    "suggestion": kb_entry["successful_fix"],
                    "confidence": 0.95,  # High confidence (known fix)
                    "known_fix": True
                }
        else:
            # New error - create KB entry
            self.knowledge_base[fingerprint] = {
                "error_type": type(error).__name__,
                "error_message": str(error),
                "file": context.get("file", "unknown"),
                "first_seen": datetime.now().isoformat(),
                "last_seen": datetime.now().isoformat(),
                "count": 1,
                "fixes_attempted": [],
                "successful_fix": None
            }
        
        # Ask AI for fix
        try:
            suggestion = self._ask_ai_for_fix(error, context)
            
            # Record suggestion
            self.knowledge_base[fingerprint]["fixes_attempted"].append({
                "suggestion": suggestion,
                "timestamp": datetime.now().isoformat(),
                "applied": False
            })
            
            self._save_knowledge_base()
            
            return {
                "fingerprint": fingerprint,
                "suggestion": suggestion,
                "confidence": 0.7,  # Medium confidence (AI guess)
                "known_fix": False
            }
            
        except Exception as e:
            print(f"[AutoHeal] AI analysis failed: {e}")
            return None
    
    def _ask_ai_for_fix(self, error: Exception, context: Dict[str, Any]) -> str:
        """
        Ask AI for fix suggestion
        
        Returns:
            Code diff or fix description
        """
        prompt = f"""You are a Python debugging expert. Analyze this error and suggest a minimal fix.

ERROR TYPE: {type(error).__name__}
ERROR MESSAGE: {str(error)}

FILE: {context.get('file', 'unknown')}
LINE: {context.get('line', 'unknown')}
FUNCTION: {context.get('function', 'unknown')}

STACK TRACE:
{context.get('stack_trace', 'N/A')[:1000]}

CODE CONTEXT (if available):
{context.get('code_context', 'N/A')[:500]}

Suggest a minimal fix. Be specific and concise.
If you can, provide a code snippet or diff.
"""
        
        return self.ai.simple(prompt, temperature=0.1, max_tokens=1000)
    
    def record_fix_result(
        self,
        fingerprint: str,
        fix: str,
        success: bool,
        notes: Optional[str] = None
    ):
        """
        Record result of applied fix
        
        Args:
            fingerprint: Error fingerprint
            fix: The fix that was applied
            success: Whether fix resolved the error
            notes: Optional notes
        """
        if fingerprint in self.knowledge_base:
            kb_entry = self.knowledge_base[fingerprint]
            
            # Update fixes attempted
            for attempted in kb_entry["fixes_attempted"]:
                if attempted["suggestion"] == fix:
                    attempted["applied"] = True
                    attempted["success"] = success
                    attempted["notes"] = notes
            
            # If successful, mark as successful_fix
            if success:
                kb_entry["successful_fix"] = fix
                kb_entry["fixed_at"] = datetime.now().isoformat()
            
            self._save_knowledge_base()
    
    def get_statistics(self) -> Dict[str, Any]:
        """
        Get auto-heal statistics
        
        Returns:
            Stats about errors, fixes, success rate
        """
        total_errors = len(self.knowledge_base)
        fixed_errors = sum(
            1 for entry in self.knowledge_base.values()
            if entry.get("successful_fix")
        )
        
        total_occurrences = sum(
            entry["count"] for entry in self.knowledge_base.values()
        )
        
        return {
            "total_unique_errors": total_errors,
            "fixed_errors": fixed_errors,
            "success_rate": fixed_errors / total_errors if total_errors > 0 else 0,
            "total_occurrences": total_occurrences,
            "knowledge_base_size": len(json.dumps(self.knowledge_base))
        }
    
    def export_knowledge_base(self) -> str:
        """
        Export knowledge base as JSON
        
        Returns:
            JSON string
        """
        return json.dumps(self.knowledge_base, indent=2)
    
    def import_knowledge_base(self, kb_json: str):
        """
        Import knowledge base from JSON
        
        Args:
            kb_json: JSON string
        """
        imported = json.loads(kb_json)
        
        # Merge with existing
        for fingerprint, entry in imported.items():
            if fingerprint not in self.knowledge_base:
                self.knowledge_base[fingerprint] = entry
            else:
                # Merge fixes_attempted
                existing = self.knowledge_base[fingerprint]
                existing["fixes_attempted"].extend(entry["fixes_attempted"])
                
                # Use successful fix if we don't have one
                if not existing.get("successful_fix") and entry.get("successful_fix"):
                    existing["successful_fix"] = entry["successful_fix"]
        
        self._save_knowledge_base()
    
    def _load_knowledge_base(self) -> Dict[str, Any]:
        """Load knowledge base from disk"""
        try:
            if self.kb_path.exists():
                with open(self.kb_path, "r") as f:
                    return json.load(f)
        except Exception as e:
            print(f"[AutoHeal] Failed to load KB: {e}")
        
        return {}
    
    def _save_knowledge_base(self):
        """Save knowledge base to disk"""
        try:
            self.kb_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.kb_path, "w") as f:
                json.dump(self.knowledge_base, f, indent=2)
        except Exception as e:
            print(f"[AutoHeal] Failed to save KB: {e}")


# Global instance
_auto_heal_engine = None

def get_auto_heal() -> AutoHealEngine:
    """Get global AutoHealEngine instance"""
    global _auto_heal_engine
    if _auto_heal_engine is None:
        _auto_heal_engine = AutoHealEngine()
    return _auto_heal_engine

