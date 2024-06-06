'use client'

export function parseFinancials(rawText: string) {
  const lines = rawText.split('\n')
  const blocks = []
  let currentBlock = {}

  lines.forEach((line) => {
    const [title, ...rest] = line.split(' ')

    if (title.endsWith(':')) {
      if (Object.keys(currentBlock).length > 0) {
        blocks.push(currentBlock)
      }
      currentBlock = { title: title.slice(0, -1), [rest.join(' ')]: null }
    } else {
      const key = title
      const value = rest.join(' ')
      currentBlock[key as string] = value
    }
  })

  if (Object.keys(currentBlock).length > 0) {
    blocks.push(currentBlock)
  }

  const jsonData = blocks.reduce((acc, block) => {
    const { title, ...data } = block
    acc[title] = data
    return acc
  }, {})

  return JSON.stringify(jsonData, null, 2)
}
