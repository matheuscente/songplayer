const trimString = <T extends object> (item: T): T => {
    return Object.fromEntries(
        Object.entries(item).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      ) as T
}

export default trimString