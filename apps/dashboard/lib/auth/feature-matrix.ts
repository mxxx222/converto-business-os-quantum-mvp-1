export async function getFeatureMatrix(userId: string, tenantId: string) {
  return {
    'copilot:reset': ['admin'],
    'billing:manage': ['admin', 'manager'],
    'ai:run': ['admin', 'manager', 'user'],
  }
}

export function isAllowed(matrix: Record<string, string[]>, feature: string, roles: string[]) {
  const allowed = matrix[feature] || []
  return roles.some((r) => allowed.includes(r))
}


