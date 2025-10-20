export async function isSecurityOperator(slackUserId: string) {
  const allow = (process.env.SECURITY_SLACK_USER_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return allow.includes(slackUserId)
}


