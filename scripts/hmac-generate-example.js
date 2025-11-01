#!/usr/bin/env node
/**
 * Prints working HMAC examples (Node, Python, cURL) based on inputs.
 * Usage: node scripts/hmac-generate-example.js <secret> <method> <path> <bodyJson>
 */
const [,, secret = "YOUR_SECRET", method = "POST", path = "/api/leads", body = "{}"] = process.argv;
const msg = `${method.toUpperCase()} ${path}\n${body}`;
console.log("\n=== Node (crypto) ===\n");
console.log(`const crypto = require('crypto');\nconst secret='${secret}';\nconst msg='${msg.replace(/'/g, "'\\''")}';\nconst sig = crypto.createHmac('sha256', secret).update(msg).digest('hex');\nconsole.log(sig);`);
console.log("\n=== Python (hmac) ===\n");
console.log(`import hmac, hashlib\nsecret=b'${secret}'\nmsg=b'${msg.replace(/'/g, "'\\''")}';\nprint(hmac.new(secret, msg, hashlib.sha256).hexdigest())`);
console.log("\n=== cURL ===\n");
console.log(`SIG=$(node -e "const c=require('crypto');process.stdout.write(c.createHmac('sha256','${secret}').update('${msg.replace(/'/g, "'\\''")}').digest('hex'))")\ncurl -X ${method.toUpperCase()} \\\n  -H "Content-Type: application/json" \\\n  -H "X-Signature: $SIG" \\\n  -d '${body}' \\\n  "$NEXT_PUBLIC_API_URL${path}"`);
