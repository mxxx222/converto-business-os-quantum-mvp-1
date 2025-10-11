
import importlib, json, os, logging
from fastapi import FastAPI

class ModuleRegistry:
    def __init__(self):
        self.manifests = {}

    def load_all(self, app: FastAPI, base_path="app/modules"):
        if not os.path.isdir(base_path):
            logging.warning("Module base not found: %s", base_path)
            return
        for mod in sorted(os.listdir(base_path)):
            mod_dir = os.path.join(base_path, mod)
            if not os.path.isdir(mod_dir):
                continue
            manifest_path = os.path.join(mod_dir, "manifest.json")
            if not os.path.exists(manifest_path):
                continue
            try:
                with open(manifest_path, "r", encoding="utf-8") as f:
                    manifest = json.load(f)
                module_fs = os.path.basename(mod_dir)
                module_id = manifest.get("id") or module_fs
                self.manifests[module_id] = manifest
                api_module = f"app.modules.{module_fs}.api"
                api = importlib.import_module(api_module)
                app.include_router(api.router)
                logging.info("Loaded module: %s", module_id)
            except Exception as e:
                logging.exception("Module %s skipped: %s", mod, e)

registry = ModuleRegistry()
