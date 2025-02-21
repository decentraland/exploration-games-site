const compareDataChanged = (
  oldData: Record<string, string | number | object> | null,
  newData: Record<string, string | number | object> | null
) => {
  const changedData: Record<string, boolean> = {}
  const allKeys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {}),
  ])
  for (const key of allKeys) {
    changedData[key] =
      JSON.stringify(oldData?.[key]) !== JSON.stringify(newData?.[key])
  }
  return changedData
}

export { compareDataChanged }
