const formatMsToMinutes = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return "00:00:00"

  const totalSeconds = Math.floor(value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((value % 1000) / 10)

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`
}

export { formatMsToMinutes }
